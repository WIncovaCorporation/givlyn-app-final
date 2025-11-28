-- Migration: Create missing SQL functions for Givlyn
-- Date: 2024-11-28

-- First, create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.ai_usage_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- RLS policies for ai_usage_log
DROP POLICY IF EXISTS "Users can view own usage" ON public.ai_usage_log;
CREATE POLICY "Users can view own usage" ON public.ai_usage_log
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service can insert usage" ON public.ai_usage_log;
CREATE POLICY "Service can insert usage" ON public.ai_usage_log
  FOR INSERT WITH CHECK (true);

-- Function: get_user_roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS TABLE(role TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT ur.role::TEXT
  FROM user_roles ur
  WHERE ur.user_id = _user_id;
END;
$$;

-- Function: check_and_increment_ai_usage
CREATE OR REPLACE FUNCTION public.check_and_increment_ai_usage(
  p_user_id UUID,
  p_feature_type TEXT,
  p_daily_limit INTEGER
)
RETURNS TABLE(allowed BOOLEAN, remaining INTEGER, reset_date TIMESTAMP) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_count INTEGER;
BEGIN
  -- Get current usage count for today
  SELECT COUNT(*) INTO v_count
  FROM ai_usage_log
  WHERE user_id = p_user_id
    AND feature_type = p_feature_type
    AND DATE(created_at) = v_today;
  
  -- Check if under limit
  IF v_count < p_daily_limit THEN
    -- Log the usage
    INSERT INTO ai_usage_log (user_id, feature_type, created_at)
    VALUES (p_user_id, p_feature_type, NOW());
    
    RETURN QUERY SELECT 
      TRUE::BOOLEAN AS allowed,
      (p_daily_limit - v_count - 1)::INTEGER AS remaining,
      (v_today + INTERVAL '1 day')::TIMESTAMP AS reset_date;
  ELSE
    RETURN QUERY SELECT 
      FALSE::BOOLEAN AS allowed,
      0::INTEGER AS remaining,
      (v_today + INTERVAL '1 day')::TIMESTAMP AS reset_date;
  END IF;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_user_roles(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_and_increment_ai_usage(UUID, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_increment_ai_usage(UUID, TEXT, INTEGER) TO service_role;
