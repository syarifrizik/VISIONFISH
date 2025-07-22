
-- Fix missing privacy settings for existing users
INSERT INTO public.privacy_settings (user_id, profile_visibility, show_activity, show_followers, show_following, show_catches)
SELECT 
    p.id,
    'public' as profile_visibility,
    true as show_activity,
    true as show_followers,
    true as show_following,
    true as show_catches
FROM public.profiles p
LEFT JOIN public.privacy_settings ps ON p.id = ps.user_id
WHERE ps.user_id IS NULL;

-- Ensure the trigger for new users creates privacy settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );
  
  -- Insert into user_settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  -- Insert into user_profile_stats
  INSERT INTO public.user_profile_stats (user_id)
  VALUES (NEW.id);
  
  -- Insert into privacy_settings (FIXED: This was missing or failing)
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

-- Update RLS policy for user_activities to be more permissive for public activities
DROP POLICY IF EXISTS "Users can view activities" ON public.user_activities;
CREATE POLICY "Users can view activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (
    -- User can see their own activities
    auth.uid() = user_id 
    OR 
    -- User can see public activities from others (check privacy settings with fallback to public)
    COALESCE(
      (SELECT ps.show_activity FROM public.privacy_settings ps WHERE ps.user_id = user_activities.user_id),
      true  -- Default to true if no privacy settings found
    ) = true
  );

-- Update RLS policy for notes to be more permissive for public notes
DROP POLICY IF EXISTS "Users can view public notes from others" ON public.notes;
CREATE POLICY "Users can view public notes from others" 
  ON public.notes 
  FOR SELECT 
  USING (
    -- User can see their own notes (all)
    auth.uid() = user_id 
    OR 
    -- User can see public notes from others (not private and not archived)
    (is_private = false AND is_archived = false)
  );
