
-- Add is_private column to community_posts table
ALTER TABLE public.community_posts 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- Update RLS policies for community_posts
DROP POLICY IF EXISTS "Users can view public community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can view their own community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can insert their own community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update their own community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete their own community posts" ON public.community_posts;

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view public community posts" ON public.community_posts
  FOR SELECT USING (is_private = false OR user_id = auth.uid());

CREATE POLICY "Users can view their own community posts" ON public.community_posts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own community posts" ON public.community_posts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own community posts" ON public.community_posts
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own community posts" ON public.community_posts
  FOR DELETE USING (user_id = auth.uid());
