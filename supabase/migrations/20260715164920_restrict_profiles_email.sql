-- Restrict email column access on public.profiles
-- Everyone can read non-email columns; email is only accessible to the owner or admins via RPC.

REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, display_name, avatar_url, created_at) ON public.profiles TO anon, authenticated;

-- Owner reads their own email
CREATE OR REPLACE FUNCTION public.get_my_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles WHERE id = auth.uid()
$$;
REVOKE ALL ON FUNCTION public.get_my_email() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_email() TO authenticated;

-- Admins read a batch of emails
CREATE OR REPLACE FUNCTION public.get_profile_emails(_ids uuid[])
RETURNS TABLE (id uuid, email text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  RETURN QUERY SELECT p.id, p.email FROM public.profiles p WHERE p.id = ANY(_ids);
END
$$;
REVOKE ALL ON FUNCTION public.get_profile_emails(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_profile_emails(uuid[]) TO authenticated;
