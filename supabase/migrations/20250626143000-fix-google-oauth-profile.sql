
-- Fix the handle_new_user trigger to properly handle Google OAuth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- For Google OAuth users, don't auto-create username to trigger setup modal
  -- For email/password users, create username from email prefix
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    CASE 
      -- If it's Google OAuth (has name in user_metadata), don't set username to trigger setup
      WHEN NEW.raw_user_meta_data->>'name' IS NOT NULL THEN NULL
      -- For email/password, use email prefix as username
      ELSE COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
    END,
    CASE 
      -- If Google OAuth, use the name from Google
      WHEN NEW.raw_user_meta_data->>'name' IS NOT NULL THEN NEW.raw_user_meta_data->>'name'
      -- Otherwise use email prefix
      ELSE COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
    END
  );
  
  -- Insert into user_settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  -- Insert into user_profile_stats
  INSERT INTO public.user_profile_stats (user_id)
  VALUES (NEW.id);
  
  -- Insert into privacy_settings
  INSERT INTO public.privacy_settings (user_id, profile_visibility, show_activity, show_followers, show_following, show_catches)
  VALUES (NEW.id, 'public', true, true, true, true);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;
