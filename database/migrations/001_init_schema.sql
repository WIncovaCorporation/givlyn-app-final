CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), auth_id UUID UNIQUE, name TEXT, email TEXT UNIQUE, avatar_url TEXT, bio TEXT, created_at TIMESTAMP DEFAULT now());
CREATE TABLE lists (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, title TEXT NOT NULL, event_type VARCHAR(50), event_date DATE, is_public BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT now());
CREATE TABLE items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), list_id UUID REFERENCES lists(id) ON DELETE CASCADE, title TEXT NOT NULL, price DECIMAL(10,2), image_url TEXT, created_at TIMESTAMP DEFAULT now());
CREATE TABLE reservations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), item_id UUID REFERENCES items(id) ON DELETE CASCADE, reserved_by_user_id UUID REFERENCES users(id), status VARCHAR(20) DEFAULT 'reserved', created_at TIMESTAMP DEFAULT now());
CREATE TABLE follows (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), follower_id UUID REFERENCES users(id) ON DELETE CASCADE, following_id UUID REFERENCES users(id) ON DELETE CASCADE, UNIQUE(follower_id, following_id));
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_lists_user ON lists(user_id);
CREATE INDEX idx_items_list ON items(list_id);
