
-- Add additional SQL schema for premium features

-- Create a view to identify premium users for easy querying
CREATE OR REPLACE VIEW premium_users AS
SELECT user_id 
FROM subscriptions 
WHERE plan_type = 'premium' 
  AND is_active = true 
  AND (ends_at IS NULL OR ends_at > now());

-- Add a product promotions table for the chatroom feature
CREATE TABLE product_promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT,
  contact_info TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for product promotions
ALTER TABLE product_promotions ENABLE ROW LEVEL SECURITY;

-- Everyone can view active promotions
CREATE POLICY "Anyone can view active promotions"
  ON product_promotions FOR SELECT
  USING (is_active = true);

-- Users can see all their own promotions (active and inactive)
CREATE POLICY "Users can view all their own promotions"
  ON product_promotions FOR SELECT
  USING (auth.uid() = user_id);

-- Only premium users can create promotions (free users are limited by trigger)
CREATE POLICY "Only premium or limited free users can create promotions"
  ON product_promotions FOR INSERT
  WITH CHECK (
    is_user_premium(auth.uid()) OR (
      (SELECT COUNT(*) FROM product_promotions 
       WHERE user_id = auth.uid() 
       AND DATE(created_at) = CURRENT_DATE) < 3
    )
  );

-- Users can only update their own promotions
CREATE POLICY "Users can update their own promotions"
  ON product_promotions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own promotions
CREATE POLICY "Users can delete their own promotions"
  ON product_promotions FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to check if a user has reached their daily free promotion limit
CREATE OR REPLACE FUNCTION check_premium_promotion_limit()
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
    RAISE EXCEPTION 'Daily promotion limit reached for free users. Upgrade to premium for unlimited promotions.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for promotion limit
DROP TRIGGER IF EXISTS premium_promotion_limit ON product_promotions;
CREATE TRIGGER premium_promotion_limit
  BEFORE INSERT ON product_promotions
  FOR EACH ROW
  EXECUTE FUNCTION check_premium_promotion_limit();

-- Create a table to track chat messages for the community chatroom
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  reply_to UUID REFERENCES chat_messages(id),
  is_pinned BOOLEAN DEFAULT false,
  is_promotion BOOLEAN DEFAULT false,
  promotion_id UUID REFERENCES product_promotions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for chat messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can view chat messages
CREATE POLICY "Anyone can view chat messages"
  ON chat_messages FOR SELECT
  USING (true);

-- Authenticated users can insert chat messages
CREATE POLICY "Authenticated users can create chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own messages
CREATE POLICY "Users can update their own messages"
  ON chat_messages FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM admins))
  WITH CHECK (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM admins));

-- Create a user profiles table with extended fields for premium users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- Premium-only fields
  profession TEXT,
  location TEXT,
  contact_info TEXT,
  social_links JSONB,
  expertise TEXT[]
);

-- Create function to synchronize premium status
CREATE OR REPLACE FUNCTION sync_premium_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update user_profiles when subscription changes
    UPDATE user_profiles
    SET 
      is_premium = (NEW.plan_type = 'premium' AND NEW.is_active = true AND (NEW.ends_at IS NULL OR NEW.ends_at > now())),
      premium_until = NEW.ends_at,
      updated_at = now()
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update user_profiles when subscription is deleted
    UPDATE user_profiles
    SET 
      is_premium = false,
      premium_until = NULL,
      updated_at = now()
    WHERE id = OLD.user_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for synchronizing premium status
DROP TRIGGER IF EXISTS sync_premium_status_trigger ON subscriptions;
CREATE TRIGGER sync_premium_status_trigger
  AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_premium_status();

-- Create a function to get premium user statistics for the dashboard
CREATE OR REPLACE FUNCTION get_premium_user_statistics(user_uuid UUID)
RETURNS TABLE (
  promotion_count BIGINT,
  promotion_views BIGINT,
  premium_days_left INTEGER,
  is_premium BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM product_promotions WHERE user_id = user_uuid) AS promotion_count,
    (SELECT COALESCE(SUM(view_count), 0) FROM product_promotions WHERE user_id = user_uuid) AS promotion_views,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM premium_users WHERE user_id = user_uuid
      ) THEN
        CASE
          WHEN (SELECT ends_at FROM subscriptions WHERE user_id = user_uuid AND is_active = true ORDER BY ends_at DESC LIMIT 1) IS NULL
          THEN -1 -- Indefinite subscription
          ELSE EXTRACT(DAY FROM 
            (SELECT ends_at FROM subscriptions WHERE user_id = user_uuid AND is_active = true ORDER BY ends_at DESC LIMIT 1) - now()
          )::INTEGER
        END
      ELSE 0
    END AS premium_days_left,
    EXISTS (SELECT 1 FROM premium_users WHERE user_id = user_uuid) AS is_premium;
END;
$$ LANGUAGE plpgsql;
