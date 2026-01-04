-- Product 테이블에 image_url 컬럼 추가
-- Supabase SQL Editor에서 실행하세요

-- 1. Product 테이블에 image_url 컬럼 추가
ALTER TABLE product ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Supabase Storage 버킷 생성 (Supabase Dashboard에서 수동으로 생성 필요)
-- Storage > New bucket > Name: "product-images", Public: true

-- ⚠️ 주의사항:
-- 이 SQL을 실행한 후, Supabase Dashboard에서 Storage 버킷을 생성해야 합니다.
-- 
-- Supabase Dashboard 설정 방법:
-- 1. Supabase 프로젝트 Dashboard 접속
-- 2. 좌측 메뉴에서 "Storage" 클릭
-- 3. "New bucket" 버튼 클릭
-- 4. Bucket 정보 입력:
--    - Name: product-images
--    - Public bucket: ON (체크)
--    - File size limit: 5 MB (선택사항)
--    - Allowed MIME types: image/* (선택사항)
-- 5. "Create bucket" 클릭
-- 
-- Storage Policies (자동 생성됨):
-- - Public 버킷으로 설정하면 모든 사용자가 이미지를 읽을 수 있습니다.
-- - 업로드는 애플리케이션 코드를 통해서만 가능합니다.



