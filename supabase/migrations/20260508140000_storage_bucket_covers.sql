-- 공개 커버 이미지용 Storage 버킷 (WR뉴스·갤러리 업로드 → DB에는 공개 URL 저장)
-- 대시보드에서도 동일 버킷을 쓰려면 Supabase 프로젝트에 이 마이그레이션을 적용하세요.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'covers',
  'covers',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read covers" ON storage.objects;

CREATE POLICY "Public read covers"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'covers');
