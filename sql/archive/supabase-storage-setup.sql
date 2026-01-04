-- Supabase Storage 버킷 설정
-- Supabase SQL Editor에서 실행하세요

-- 1. 'images' 버킷이 없으면 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Public 읽기 권한 설정 (모든 사용자가 이미지 조회 가능)
CREATE POLICY "Public Access for images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- 3. 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- 4. 인증된 사용자만 업데이트 가능
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- 5. 인증된 사용자만 삭제 가능
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

