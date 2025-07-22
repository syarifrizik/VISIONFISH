
-- Create RPC functions for user API key management

-- Function to get user API keys for admin
CREATE OR REPLACE FUNCTION public.get_user_api_keys(target_user_id UUID)
RETURNS TABLE(
  id UUID,
  name TEXT,
  key_value TEXT,
  provider TEXT,
  daily_limit INTEGER,
  current_usage INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  RETURN QUERY
  SELECT 
    uk.id,
    uk.name,
    uk.key_value,
    uk.provider,
    uk.daily_limit,
    uk.current_usage,
    uk.is_active,
    uk.created_at
  FROM user_api_keys uk
  WHERE uk.user_id = target_user_id
  ORDER BY uk.created_at DESC;
END;
$$;

-- Function to add user API key
CREATE OR REPLACE FUNCTION public.add_user_api_key(
  target_user_id UUID,
  key_name TEXT,
  key_value TEXT,
  key_provider TEXT DEFAULT 'gemini',
  key_limit INTEGER DEFAULT 1000
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Insert the new API key
  INSERT INTO user_api_keys (user_id, name, key_value, provider, daily_limit, created_by_admin)
  VALUES (target_user_id, key_name, key_value, key_provider, key_limit, auth.uid());
  
  -- Log admin activity
  INSERT INTO admin_activities (admin_id, action_type, target_user_id, details)
  VALUES (auth.uid(), 'user_api_key_added', target_user_id, 
    jsonb_build_object('key_name', key_name, 'provider', key_provider, 'daily_limit', key_limit));
END;
$$;

-- Function to delete user API key
CREATE OR REPLACE FUNCTION public.delete_user_api_key(key_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_user_id UUID;
  key_name TEXT;
BEGIN
  -- Check if current user is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Get key details for logging
  SELECT user_id, name INTO key_user_id, key_name
  FROM user_api_keys 
  WHERE id = key_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'API key not found.';
  END IF;
  
  -- Delete the API key
  DELETE FROM user_api_keys WHERE id = key_id;
  
  -- Log admin activity
  INSERT INTO admin_activities (admin_id, action_type, target_user_id, details)
  VALUES (auth.uid(), 'user_api_key_deleted', key_user_id, 
    jsonb_build_object('key_name', key_name, 'key_id', key_id));
END;
$$;
