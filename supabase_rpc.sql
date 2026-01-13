-- Drop existing function if it exists
DROP FUNCTION IF EXISTS lookup_student_by_identifier(text);

-- Create secure function to search students (Fixed with Aliases)
CREATE OR REPLACE FUNCTION lookup_student_by_identifier(search_term text)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  email text,
  phone text
) 
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Only allow if the search term is at least 3 characters to prevent scanning everything
  IF length(search_term) < 3 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    u.id as user_id,
    COALESCE(u.raw_user_meta_data->>'full_name', 'Unknown') as full_name,
    u.email::text as email,
    COALESCE(u.raw_user_meta_data->>'phone', '') as phone
  FROM auth.users u
  WHERE 
    -- Filter for students only
    (u.raw_user_meta_data->>'role' = 'student' OR u.raw_user_meta_data->>'role' IS NULL)
    AND (
      -- Search email
      u.email ILIKE search_term || '%'
      OR
      -- Search phone (stored in metadata)
      u.raw_user_meta_data->>'phone' ILIKE search_term || '%'
    )
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users (teachers)
GRANT EXECUTE ON FUNCTION lookup_student_by_identifier(text) TO authenticated;
