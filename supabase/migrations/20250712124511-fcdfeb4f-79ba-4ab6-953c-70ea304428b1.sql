
-- Create user_api_keys table for premium user personal API keys
CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  key_value TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'gemini',
  daily_limit INTEGER NOT NULL DEFAULT 1000,
  current_usage INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_admin UUID REFERENCES auth.users(id),
  UNIQUE(user_id, provider)
);

-- Enable RLS on user_api_keys
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_api_keys
CREATE POLICY "Admins can manage all user API keys"
ON user_api_keys
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own API keys"
ON user_api_keys
FOR SELECT
USING (auth.uid() = user_id);

-- Update get_active_api_key function to support user-specific keys
CREATE OR REPLACE FUNCTION public.get_user_api_key(target_user_id UUID DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  api_key TEXT;
  is_premium BOOLEAN := false;
BEGIN
  -- Check if user is premium (if user_id provided)
  IF target_user_id IS NOT NULL THEN
    SELECT is_user_premium(target_user_id) INTO is_premium;
    
    -- If premium, try to get their personal API key first
    IF is_premium THEN
      SELECT key_value INTO api_key
      FROM user_api_keys
      WHERE user_id = target_user_id
        AND is_active = true
        AND current_usage < daily_limit
        AND provider = 'gemini'
      ORDER BY created_at DESC
      LIMIT 1;
      
      -- If found personal key, return it
      IF api_key IS NOT NULL THEN
        RETURN api_key;
      END IF;
    END IF;
  END IF;
  
  -- Fallback to system API key
  SELECT key_value INTO api_key
  FROM api_keys
  WHERE is_active = true
    AND current_usage < daily_limit
    AND provider = 'gemini'
  ORDER BY current_usage ASC, created_at ASC
  LIMIT 1;
  
  RETURN api_key;
END;
$$;

-- Function to increment API usage for user-specific or system keys
CREATE OR REPLACE FUNCTION public.increment_user_api_usage(target_user_id UUID DEFAULT NULL, api_key_value TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_premium BOOLEAN := false;
BEGIN
  -- Check if user is premium
  IF target_user_id IS NOT NULL THEN
    SELECT is_user_premium(target_user_id) INTO is_premium;
    
    -- If premium, try to increment their personal API key usage
    IF is_premium THEN
      UPDATE user_api_keys
      SET current_usage = current_usage + 1,
          updated_at = now()
      WHERE user_id = target_user_id
        AND key_value = api_key_value
        AND is_active = true;
      
      -- If we updated a user key, we're done
      IF FOUND THEN
        RETURN;
      END IF;
    END IF;
  END IF;
  
  -- Fallback to system API key
  UPDATE api_keys
  SET current_usage = current_usage + 1,
      updated_at = now()
  WHERE key_value = api_key_value
    AND is_active = true;
END;
$$;

-- Function to reset daily API usage for user keys
CREATE OR REPLACE FUNCTION public.reset_user_api_usage()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reset user API keys
  UPDATE user_api_keys
  SET current_usage = 0,
      last_reset_at = now()
  WHERE last_reset_at < (now() - interval '24 hours');
  
  -- Reset system API keys
  UPDATE api_keys
  SET current_usage = 0,
      last_reset_at = now()
  WHERE last_reset_at < (now() - interval '24 hours');
END;
$$;
