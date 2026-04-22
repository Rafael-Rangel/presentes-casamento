-- =============================================================================
-- Supabase → SQL Editor → Run (uma vez)
-- Cria o bucket de imagens dos presentes para upload a partir do painel.
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gift-images',
  'gift-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read gift images" ON storage.objects;
CREATE POLICY "Public read gift images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-images');
