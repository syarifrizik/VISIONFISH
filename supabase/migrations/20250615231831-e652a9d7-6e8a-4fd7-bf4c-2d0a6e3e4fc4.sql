
-- Create table for fish species history
CREATE TABLE public.fish_species_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  species_name TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 1,
  last_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for better performance
CREATE INDEX idx_fish_species_history_user_id ON public.fish_species_history(user_id);
CREATE INDEX idx_fish_species_history_last_used ON public.fish_species_history(user_id, last_used_at DESC);

-- Enable Row Level Security
ALTER TABLE public.fish_species_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own history
CREATE POLICY "Users can view their own fish species history" 
  ON public.fish_species_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own history
CREATE POLICY "Users can create their own fish species history" 
  ON public.fish_species_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own history
CREATE POLICY "Users can update their own fish species history" 
  ON public.fish_species_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own history
CREATE POLICY "Users can delete their own fish species history" 
  ON public.fish_species_history 
  FOR DELETE 
  USING (auth.uid() = user_id);
