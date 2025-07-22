
-- Step 1: First, let's add a unique constraint on user_id to the subscriptions table
-- This is needed for the ON CONFLICT clause to work
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id);

-- Step 2: Now upgrade the specific user to premium status
-- Replace the email with the actual email: rizikassegaf.syarifrizik@gmail.com
INSERT INTO subscriptions (user_id, plan_type, starts_at, ends_at, is_active)
SELECT 
  au.id,
  'premium',
  now(),
  NULL, -- NULL means unlimited/no expiry
  true
FROM auth.users au
WHERE au.email = 'rizikassegaf.syarifrizik@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  plan_type = 'premium',
  starts_at = now(),
  ends_at = NULL,
  is_active = true,
  updated_at = now();

-- Step 3: Verify the upgrade worked
SELECT 
  au.email,
  s.plan_type,
  s.is_active,
  s.starts_at,
  s.ends_at,
  is_user_premium(au.id) as is_premium_check
FROM auth.users au
LEFT JOIN subscriptions s ON au.id = s.user_id
WHERE au.email = 'rizikassegaf.syarifrizik@gmail.com';

-- Step 4: Create a function to sync premium status (for admin use)
CREATE OR REPLACE FUNCTION sync_user_premium_status(user_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  is_premium BOOLEAN;
  premium_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not found');
  END IF;
  
  -- Check premium status
  SELECT is_user_premium(user_id) INTO is_premium;
  
  -- Get premium end date if applicable
  SELECT ends_at INTO premium_end_date 
  FROM subscriptions 
  WHERE user_id = sync_user_premium_status.user_id 
  AND plan_type = 'premium' 
  AND is_active = true;
  
  RETURN jsonb_build_object(
    'success', true,
    'user_id', user_id,
    'is_premium', is_premium,
    'premium_until', premium_end_date,
    'message', CASE 
      WHEN is_premium THEN 'User has premium access'
      ELSE 'User has free access'
    END
  );
END;
$$;
