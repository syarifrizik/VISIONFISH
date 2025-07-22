
-- Fix RLS policies untuk table notes agar memungkinkan viewing catatan publik dari user lain
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

-- Fix RLS policies untuk table user_activities agar memungkinkan viewing aktivitas publik
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
CREATE POLICY "Users can view activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (
    -- User can see their own activities
    auth.uid() = user_id 
    OR 
    -- User can see public activities from others (check privacy settings)
    EXISTS (
      SELECT 1 FROM public.privacy_settings ps 
      WHERE ps.user_id = user_activities.user_id 
      AND ps.show_activity = true
    )
  );

-- Ensure RLS is enabled on both tables
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
