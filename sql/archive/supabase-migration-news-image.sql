-- News 테이블에 image_url 및 link 컬럼 추가
-- Supabase SQL Editor에서 실행하세요

-- 1. News 테이블에 image_url 컬럼 추가
ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. News 테이블에 link 컬럼 추가 (원문 기사 링크)
ALTER TABLE news ADD COLUMN IF NOT EXISTS link TEXT;

-- 참고: 
-- - product-images 버킷을 news 썸네일에도 재사용합니다.
-- - 업로드 경로는 news/ 폴더로 구분됩니다.
-- - link 필드는 선택 사항이며, 원문 기사 URL을 저장합니다.

