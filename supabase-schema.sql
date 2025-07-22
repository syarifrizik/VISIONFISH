
-- Enable pgvector extension for potential AI features
CREATE EXTENSION IF NOT EXISTS pgvector;

-- Create table for user subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium')),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admin can insert subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
  ));

-- Create admin_roles table
CREATE TABLE admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users,
  is_active BOOLEAN DEFAULT true
);

-- Add RLS policies for admin_roles
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all admin roles
CREATE POLICY "Admins can view admin roles"
  ON admin_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

-- Only super admins can insert new admin roles
CREATE POLICY "Super admins can insert admin roles"
  ON admin_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles ar 
      WHERE ar.user_id = auth.uid() 
      AND ar.role = 'super_admin' 
      AND ar.is_active = true
    ) OR NOT EXISTS (SELECT 1 FROM admin_roles)  -- Allow first admin
  );

-- Create function to check if user is premium
CREATE OR REPLACE FUNCTION is_user_premium(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = $1
    AND plan_type = 'premium'
    AND is_active = true
    AND (ends_at IS NULL OR ends_at > now())
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to promote user to premium
CREATE OR REPLACE FUNCTION promote_user_to_premium(target_user_id UUID, duration_days INTEGER DEFAULT 30)
RETURNS TABLE (success BOOLEAN, message TEXT) AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() AND is_active = true
  ) THEN
    RETURN QUERY SELECT false, 'Unauthorized: Admin access required';
    RETURN;
  END IF;

  -- Insert or update subscription
  INSERT INTO subscriptions (user_id, plan_type, starts_at, ends_at, is_active)
  VALUES (
    target_user_id, 
    'premium', 
    now(), 
    CASE WHEN duration_days > 0 THEN now() + (duration_days || ' days')::interval ELSE NULL END,
    true
  )
  ON CONFLICT (user_id) DO UPDATE SET
    plan_type = 'premium',
    starts_at = now(),
    ends_at = CASE WHEN duration_days > 0 THEN now() + (duration_days || ' days')::interval ELSE NULL END,
    is_active = true,
    updated_at = now();

  RETURN QUERY SELECT true, 'User successfully promoted to premium';
END;
$$ LANGUAGE plpgsql;

-- Create function to promote user to admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(target_user_id UUID)
RETURNS TABLE (success BOOLEAN, message TEXT) AS $$
BEGIN
  -- Check if caller is admin (or if no admins exist yet)
  IF NOT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() AND is_active = true
  ) AND EXISTS (SELECT 1 FROM admin_roles) THEN
    RETURN QUERY SELECT false, 'Unauthorized: Admin access required';
    RETURN;
  END IF;

  -- Insert admin role
  INSERT INTO admin_roles (user_id, role, created_by)
  VALUES (target_user_id, 'admin', auth.uid())
  ON CONFLICT (user_id) DO UPDATE SET
    is_active = true,
    role = 'admin',
    created_by = auth.uid();

  RETURN QUERY SELECT true, 'User successfully promoted to admin';
END;
$$ LANGUAGE plpgsql;

-- Create function to remove admin role
CREATE OR REPLACE FUNCTION remove_admin_role(target_user_id UUID)
RETURNS TABLE (success BOOLEAN, message TEXT) AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() AND is_active = true
  ) THEN
    RETURN QUERY SELECT false, 'Unauthorized: Admin access required';
    RETURN;
  END IF;

  -- Prevent removing the last admin
  IF (SELECT COUNT(*) FROM admin_roles WHERE is_active = true) <= 1 THEN
    RETURN QUERY SELECT false, 'Cannot remove the last admin';
    RETURN;
  END IF;

  -- Remove admin role
  UPDATE admin_roles 
  SET is_active = false 
  WHERE user_id = target_user_id;

  RETURN QUERY SELECT true, 'Admin role successfully removed';
END;
$$ LANGUAGE plpgsql;

-- Add promotion_limit_check function
CREATE OR REPLACE FUNCTION check_promotion_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow premium users to post unlimited promotions
  IF (SELECT is_user_premium(NEW.user_id)) THEN
    RETURN NEW;
  END IF;

  -- Free users are limited to 3 promotions per day
  IF (SELECT COUNT(*) FROM product_promotions
      WHERE user_id = NEW.user_id
      AND DATE(created_at) = CURRENT_DATE) >= 3 THEN
    RAISE EXCEPTION 'Daily promotion limit reached for free users';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for promotion limit
DROP TRIGGER IF EXISTS product_promotion_limit ON product_promotions;
CREATE TRIGGER product_promotion_limit
  BEFORE INSERT ON product_promotions
  FOR EACH ROW
  EXECUTE FUNCTION check_promotion_limit();

-- Add user roles and permissions
CREATE TYPE user_role AS ENUM ('user', 'premium', 'admin');

-- Add role to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- Update RLS policies for product promotions
CREATE POLICY "Premium users can create unlimited promotions"
ON product_promotions
FOR INSERT
WITH CHECK (
  is_user_premium(auth.uid()) OR (
    -- Free users check daily limit
    (SELECT COUNT(*) FROM product_promotions 
     WHERE user_id = auth.uid() 
     AND DATE(created_at) = CURRENT_DATE) < 3
  )
);
