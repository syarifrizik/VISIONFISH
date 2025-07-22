
-- Create function to check username availability
CREATE OR REPLACE FUNCTION public.check_username_availability(username_input text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if username exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = username_input) THEN
    RETURN jsonb_build_object(
      'available', false,
      'message', 'Username sudah digunakan, silakan pilih yang lain'
    );
  END IF;
  
  -- Check username format (3+ chars, only letters, numbers, underscore)
  IF LENGTH(username_input) < 3 THEN
    RETURN jsonb_build_object(
      'available', false,
      'message', 'Username harus minimal 3 karakter'
    );
  END IF;
  
  IF NOT username_input ~ '^[a-zA-Z0-9_]+$' THEN
    RETURN jsonb_build_object(
      'available', false,
      'message', 'Username hanya boleh huruf, angka, dan underscore'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'available', true,
    'message', 'Username tersedia ✓'
  );
END;
$$;

-- Create function to set user profile with username
CREATE OR REPLACE FUNCTION public.set_user_profile(
  user_id_input uuid,
  username_input text,
  email_input text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  display_name_value text;
BEGIN
  -- Extract display name from email (remove domain)
  display_name_value := split_part(email_input, '@', 1);
  
  -- Check username availability first
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = username_input AND id != user_id_input) THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Username sudah digunakan'
    );
  END IF;
  
  -- Update or insert profile
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (user_id_input, username_input, display_name_value)
  ON CONFLICT (id) 
  DO UPDATE SET 
    username = username_input,
    display_name = display_name_value,
    updated_at = now();
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Profil berhasil diperbarui'
  );
END;
$$;
