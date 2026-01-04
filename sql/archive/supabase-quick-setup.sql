-- ====================================
-- Supabase 빠른 설정 스크립트
-- ====================================
-- 이 파일을 Supabase SQL Editor에서 실행하세요
-- 실행 순서: 1 → 2 → 3

-- ====================================
-- 1. History 테이블 마이그레이션
-- ====================================

-- 기존 category 컬럼을 major_category로 변경
DO $$
BEGIN
  -- category 컬럼이 존재하면 major_category로 변경
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'history' AND column_name = 'category'
  ) THEN
    ALTER TABLE history RENAME COLUMN category TO major_category;
  END IF;
END $$;

-- sub_category 컬럼 추가
ALTER TABLE history ADD COLUMN IF NOT EXISTS sub_category VARCHAR(100);

-- logo_url 컬럼 추가
ALTER TABLE history ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 기존 데이터 업데이트 (기본값 설정)
UPDATE history 
SET major_category = 'AICE' 
WHERE major_category IS NULL 
   OR major_category = '' 
   OR major_category NOT IN ('AICE', 'AI교육', '자격증');

-- 제약조건 삭제 후 재생성
ALTER TABLE history DROP CONSTRAINT IF EXISTS history_major_category_check;
ALTER TABLE history 
ADD CONSTRAINT history_major_category_check 
CHECK (major_category IN ('AICE', 'AI교육', '자격증'));

-- 컬럼 설명 추가
COMMENT ON COLUMN history.major_category IS '대분류: AICE, AI교육, 자격증';
COMMENT ON COLUMN history.sub_category IS '중분류: AICE(BASIC, ASSOCIATE, PROFESSIONAL), AI교육(생성형AI, 데이터분석, 바이브코딩, AI자동화), 자격증(빅데이터분석기사, ADsP, SQLD, 경영정보시각화능력)';
COMMENT ON COLUMN history.logo_url IS '거래처 로고 이미지 URL';

-- ====================================
-- 2. Storage 버킷 생성
-- ====================================

-- images 버킷 생성 (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ====================================
-- 3. Storage 정책 설정
-- ====================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- SELECT 정책 (모든 사용자 읽기 가능)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- INSERT 정책 (인증된 사용자 업로드)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- UPDATE 정책 (인증된 사용자 수정)
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- DELETE 정책 (인증된 사용자 삭제)
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- ====================================
-- 완료 메시지
-- ====================================
DO $$
BEGIN
  RAISE NOTICE '✅ History 테이블 마이그레이션 완료';
  RAISE NOTICE '✅ Storage 버킷 생성 완료';
  RAISE NOTICE '✅ Storage 정책 설정 완료';
  RAISE NOTICE '';
  RAISE NOTICE '이제 Admin 페이지에서 이미지 업로드를 테스트하세요!';
END $$;

