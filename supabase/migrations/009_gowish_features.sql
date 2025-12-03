-- ============================================
-- GOWISH-STYLE FEATURES MIGRATION
-- Reservations, Follows, Notifications
-- ============================================

-- 1. RESERVATIONS TABLE
-- Allows guests to "reserve" a gift to avoid duplicates
-- Core feature of GoWish: owner never sees who reserved what
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES gift_items(id) ON DELETE CASCADE,
  reserved_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'purchased', 'cancelled')),
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  UNIQUE(item_id, reserved_by)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_reservations_item ON reservations(item_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(reserved_by);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- RLS for reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Users can see reservations for items they reserved
CREATE POLICY "Users can view their own reservations"
  ON reservations FOR SELECT
  USING (auth.uid() = reserved_by);

-- Users can create reservations
CREATE POLICY "Users can create reservations"
  ON reservations FOR INSERT
  WITH CHECK (auth.uid() = reserved_by);

-- Users can update their own reservations
CREATE POLICY "Users can update their own reservations"
  ON reservations FOR UPDATE
  USING (auth.uid() = reserved_by);

-- Users can delete their own reservations
CREATE POLICY "Users can delete their own reservations"
  ON reservations FOR DELETE
  USING (auth.uid() = reserved_by);

-- 2. FOLLOWS TABLE
-- Social feature: follow friends to see their wishlists
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Indexes for follows
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- RLS for follows
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Users can see their own follows
CREATE POLICY "Users can view follows they are part of"
  ON follows FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- Users can follow others
CREATE POLICY "Users can create follows"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can delete their follows"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- 3. NOTIFICATIONS TABLE
-- Re-engagement notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('reservation', 'follow', 'list_shared', 'price_drop', 'reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. SHARES TABLE (for tracking virality)
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES gift_lists(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('whatsapp', 'email', 'link', 'facebook', 'twitter', 'instagram')),
  shared_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for shares
CREATE INDEX IF NOT EXISTS idx_shares_list ON shares(list_id);
CREATE INDEX IF NOT EXISTS idx_shares_user ON shares(shared_by);
CREATE INDEX IF NOT EXISTS idx_shares_platform ON shares(platform);

-- RLS for shares
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Users can see shares for their own lists
CREATE POLICY "Users can view shares of their lists"
  ON shares FOR SELECT
  USING (auth.uid() = shared_by OR 
         list_id IN (SELECT id FROM gift_lists WHERE user_id = auth.uid()));

-- Users can create shares
CREATE POLICY "Users can create shares"
  ON shares FOR INSERT
  WITH CHECK (auth.uid() = shared_by);

-- 5. UPDATE gift_items TABLE
-- Add priority and reservation_count columns if not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'gift_items' AND column_name = 'priority') THEN
    ALTER TABLE gift_items ADD COLUMN priority INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'gift_items' AND column_name = 'is_reserved') THEN
    ALTER TABLE gift_items ADD COLUMN is_reserved BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 6. UPDATE gift_lists TABLE
-- Add event_date column if not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'gift_lists' AND column_name = 'event_date') THEN
    ALTER TABLE gift_lists ADD COLUMN event_date DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'gift_lists' AND column_name = 'cover_image') THEN
    ALTER TABLE gift_lists ADD COLUMN cover_image TEXT;
  END IF;
END $$;

-- 7. FUNCTION: Get reservation count for a list (for owner dashboard)
CREATE OR REPLACE FUNCTION get_list_reservation_count(list_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO count
  FROM reservations r
  JOIN gift_items gi ON r.item_id = gi.id
  WHERE gi.list_id = list_uuid
  AND r.status IN ('reserved', 'purchased');
  
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. FUNCTION: Check if user can reserve an item
CREATE OR REPLACE FUNCTION can_reserve_item(item_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  item_owner UUID;
  already_reserved BOOLEAN;
BEGIN
  -- Get the owner of the list containing this item
  SELECT gl.user_id INTO item_owner
  FROM gift_items gi
  JOIN gift_lists gl ON gi.list_id = gl.id
  WHERE gi.id = item_uuid;
  
  -- Owner cannot reserve their own items
  IF item_owner = user_uuid THEN
    RETURN false;
  END IF;
  
  -- Check if already reserved by anyone
  SELECT EXISTS(
    SELECT 1 FROM reservations 
    WHERE item_id = item_uuid 
    AND status IN ('reserved', 'purchased')
  ) INTO already_reserved;
  
  RETURN NOT already_reserved;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'GoWish features migration completed successfully!';
END $$;
