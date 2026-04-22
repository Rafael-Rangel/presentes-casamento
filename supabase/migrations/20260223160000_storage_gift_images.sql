-- Bucket público para fotos dos presentes (upload via service role na app).
-- Executar no SQL Editor se ainda não existir.

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

-- Leitura pública das imagens (lista / detalhe sem login)
DROP POLICY IF EXISTS "Public read gift images" ON storage.objects;

CREATE POLICY "Public read gift images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-images');

-- Uploads só pelo backend com service_role (ignora RLS); política explícita opcional para authenticated se no futuro quiseres upload direto do browser.
