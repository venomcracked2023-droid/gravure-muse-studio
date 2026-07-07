ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price_usdt numeric(10,2) NOT NULL DEFAULT 2.00;

CREATE TABLE public.album_purchases (
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

CREATE INDEX album_purchases_user_chapter_idx
  ON public.album_purchases(user_id, chapter_id);

CREATE UNIQUE INDEX album_purchases_completed_uniq
  ON public.album_purchases(user_id, chapter_id)
  WHERE status = 'completed';

GRANT SELECT, INSERT ON public.album_purchases TO authenticated;
GRANT ALL ON public.album_purchases TO service_role;

ALTER TABLE public.album_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own purchases"
  ON public.album_purchases FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own pending purchase"
  ON public.album_purchases FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status IN ('new','pending'));

CREATE TRIGGER update_album_purchases_updated_at
  BEFORE UPDATE ON public.album_purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();