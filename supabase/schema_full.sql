-- ====================================================================
-- GRAVUREHUB / GRAVURE-MUSE-STUDIO: FULL DATABASE SCHEMA
-- Execute this script in your personal Supabase SQL Editor
-- (https://supabase.com/dashboard/project/<your-project-id>/sql)
-- ====================================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'contributor', 'user');
  END IF;
END $$;

-- 2. HELPER FUNCTIONS: updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure all columns exist even if table was pre-created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone') THEN
    CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Restrict direct email column reading to protect user privacy
REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, display_name, avatar_url, created_at) ON public.profiles TO anon, authenticated;

-- Safe RPC to read email
CREATE OR REPLACE FUNCTION public.get_my_email()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT email FROM public.profiles WHERE id = auth.uid()
$$;
REVOKE ALL ON FUNCTION public.get_my_email() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_email() TO authenticated;

-- 4. USER ROLES TABLE & has_role FUNCTION
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT exists (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Anyone can view roles') THEN
    CREATE POLICY "Anyone can view roles" ON public.user_roles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Only admins can insert roles') THEN
    CREATE POLICY "Only admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Only admins can delete roles') THEN
    CREATE POLICY "Only admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Batch read emails for admins
CREATE OR REPLACE FUNCTION public.get_profile_emails(_ids uuid[])
RETURNS TABLE (id uuid, email text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  RETURN QUERY SELECT p.id, p.email FROM public.profiles p WHERE p.id = ANY(_ids);
END
$$;
REVOKE ALL ON FUNCTION public.get_profile_emails(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_profile_emails(uuid[]) TO authenticated;

-- 5. CONTRIBUTOR APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.contributor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pen_name text NOT NULL,
  reason text NOT NULL,
  sample_link text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.contributor_applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contributor_applications' AND policyname = 'Users can view own application') THEN
    CREATE POLICY "Users can view own application" ON public.contributor_applications FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contributor_applications' AND policyname = 'Admins can view all applications') THEN
    CREATE POLICY "Admins can view all applications" ON public.contributor_applications FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contributor_applications' AND policyname = 'Users can insert own application') THEN
    CREATE POLICY "Users can insert own application" ON public.contributor_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contributor_applications' AND policyname = 'Users can update own pending application') THEN
    CREATE POLICY "Users can update own pending application" ON public.contributor_applications FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contributor_applications' AND policyname = 'Admins can update any application') THEN
    CREATE POLICY "Admins can update any application" ON public.contributor_applications FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Trigger: create profile & grant admin to first user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _is_first boolean;
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, email) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email
  );
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO _is_first;
  IF _is_first THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'contributor');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: auto grant contributor role on application approve
CREATE OR REPLACE FUNCTION public.handle_application_approved()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.user_id, 'contributor') ON CONFLICT DO NOTHING;
    NEW.reviewed_at := now();
  END IF;
  IF NEW.status = 'rejected' AND (OLD.status IS DISTINCT FROM 'rejected') THEN
    NEW.reviewed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_application_status_change ON public.contributor_applications;
CREATE TRIGGER on_application_status_change
  BEFORE UPDATE ON public.contributor_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_application_approved();

-- 6. COMICS (MODELS) TABLE
CREATE TABLE IF NOT EXISTS public.comics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  cover_id text NOT NULL DEFAULT '',
  genres text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  booking_url text,
  order_url text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comics_featured ON public.comics (featured) WHERE featured = true;
ALTER TABLE public.comics ADD COLUMN IF NOT EXISTS booking_url text;
ALTER TABLE public.comics ADD COLUMN IF NOT EXISTS order_url text;
ALTER TABLE public.comics ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.comics ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comics' AND policyname = 'Comics viewable by everyone') THEN
    CREATE POLICY "Comics viewable by everyone" ON public.comics FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comics' AND policyname = 'Contributors can create comics') THEN
    CREATE POLICY "Contributors can create comics" ON public.comics FOR INSERT WITH CHECK (auth.uid() = created_by AND (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin')));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comics' AND policyname = 'Owner or admin can update comics') THEN
    CREATE POLICY "Owner or admin can update comics" ON public.comics FOR UPDATE USING (auth.uid() = created_by OR public.has_role(auth.uid(),'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comics' AND policyname = 'Owner or admin can delete comics') THEN
    CREATE POLICY "Owner or admin can delete comics" ON public.comics FOR DELETE USING (auth.uid() = created_by OR public.has_role(auth.uid(),'admin'));
  END IF;
END $$;

DROP TRIGGER IF EXISTS comics_updated_at ON public.comics;
CREATE TRIGGER comics_updated_at
  BEFORE UPDATE ON public.comics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. CHAPTERS (ALBUMS) TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comic_id uuid NOT NULL REFERENCES public.comics(id) ON DELETE CASCADE,
  title text NOT NULL,
  pages text[] NOT NULL DEFAULT '{}',
  order_index int NOT NULL DEFAULT 0,
  cover_id text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  is_premium boolean NOT NULL DEFAULT false,
  price_usdt numeric(10,2) NOT NULL DEFAULT 2.00,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chapters_comic_order ON public.chapters(comic_id, order_index);
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS cover_id text NOT NULL DEFAULT '';
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS video_url text NOT NULL DEFAULT '';
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS price_usdt numeric(10,2) NOT NULL DEFAULT 2.00;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chapters' AND policyname = 'Chapters viewable by everyone') THEN
    CREATE POLICY "Chapters viewable by everyone" ON public.chapters FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chapters' AND policyname = 'Owner or admin can insert chapters') THEN
    CREATE POLICY "Owner or admin can insert chapters" ON public.chapters FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.comics c WHERE c.id = comic_id AND (c.created_by = auth.uid() OR public.has_role(auth.uid(),'admin'))));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chapters' AND policyname = 'Owner or admin can update chapters') THEN
    CREATE POLICY "Owner or admin can update chapters" ON public.chapters FOR UPDATE USING (EXISTS (SELECT 1 FROM public.comics c WHERE c.id = comic_id AND (c.created_by = auth.uid() OR public.has_role(auth.uid(),'admin'))));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chapters' AND policyname = 'Owner or admin can delete chapters') THEN
    CREATE POLICY "Owner or admin can delete chapters" ON public.chapters FOR DELETE USING (EXISTS (SELECT 1 FROM public.comics c WHERE c.id = comic_id AND (c.created_by = auth.uid() OR public.has_role(auth.uid(),'admin'))));
  END IF;
END $$;

-- 8. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  comic_id uuid NOT NULL,
  chapter_id uuid,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_comic ON public.comments(comic_id, created_at desc);
CREATE INDEX IF NOT EXISTS idx_comments_chapter ON public.comments(chapter_id, created_at desc);
CREATE INDEX IF NOT EXISTS idx_comments_user ON public.comments(user_id);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Comments viewable by everyone') THEN
    CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Auth users can insert own comment') THEN
    CREATE POLICY "Auth users can insert own comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Owner or admin can update comment') THEN
    CREATE POLICY "Owner or admin can update comment" ON public.comments FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Owner or admin can delete comment') THEN
    CREATE POLICY "Owner or admin can delete comment" ON public.comments FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.validate_comment()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF length(btrim(NEW.content)) < 1 THEN RAISE EXCEPTION 'Bình luận không được trống'; END IF;
  IF length(NEW.content) > 2000 THEN RAISE EXCEPTION 'Bình luận tối đa 2000 ký tự'; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_comment_trg ON public.comments;
CREATE TRIGGER validate_comment_trg
  BEFORE INSERT OR UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.validate_comment();

-- 9. RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  comic_id uuid NOT NULL,
  score smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, comic_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_comic ON public.ratings(comic_id);
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ratings' AND policyname = 'Ratings viewable by everyone') THEN
    CREATE POLICY "Ratings viewable by everyone" ON public.ratings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ratings' AND policyname = 'Auth users can insert own rating') THEN
    CREATE POLICY "Auth users can insert own rating" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ratings' AND policyname = 'Owner can update own rating') THEN
    CREATE POLICY "Owner can update own rating" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ratings' AND policyname = 'Owner or admin can delete rating') THEN
    CREATE POLICY "Owner or admin can delete rating" ON public.ratings FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_ratings_updated_at ON public.ratings;
CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.validate_rating()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.score < 1 OR NEW.score > 5 THEN RAISE EXCEPTION 'Điểm đánh giá phải từ 1 đến 5'; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_rating_trg ON public.ratings;
CREATE TRIGGER validate_rating_trg
  BEFORE INSERT OR UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.validate_rating();

-- 10. ALBUM PURCHASES (PLISIO PAYMENT GATEWAY)
CREATE TABLE IF NOT EXISTS public.album_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  txn_id text UNIQUE,
  invoice_url text,
  amount numeric(24,8),
  source_amount numeric(10,2),
  source_currency text,
  currency text,
  status text NOT NULL DEFAULT 'new',
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS album_purchases_user_chapter_idx ON public.album_purchases(user_id, chapter_id);
CREATE UNIQUE INDEX IF NOT EXISTS album_purchases_completed_uniq ON public.album_purchases(user_id, chapter_id) WHERE status = 'completed';

GRANT SELECT, INSERT ON public.album_purchases TO authenticated;
GRANT ALL ON public.album_purchases TO service_role;

ALTER TABLE public.album_purchases ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'album_purchases' AND policyname = 'Users read their own purchases') THEN
    CREATE POLICY "Users read their own purchases" ON public.album_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'album_purchases' AND policyname = 'Users create own pending purchase') THEN
    CREATE POLICY "Users create own pending purchase" ON public.album_purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status IN ('new','pending'));
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_album_purchases_updated_at ON public.album_purchases;
CREATE TRIGGER update_album_purchases_updated_at
  BEFORE UPDATE ON public.album_purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. REALTIME REPLICATION (For instant live comments)
ALTER TABLE public.comments REPLICA IDENTITY FULL;
DO $$ BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;
