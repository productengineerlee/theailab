-- Partner 테이블 업데이트
-- Supabase SQL Editor에서 실행하세요

-- 1. url 컬럼 추가 (파트너사 웹사이트)
ALTER TABLE partner ADD COLUMN IF NOT EXISTS url TEXT;

-- 2. description 컬럼 추가 (파트너 사업 영역)
ALTER TABLE partner ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. name 컬럼을 NOT NULL로 변경
ALTER TABLE partner ALTER COLUMN name SET NOT NULL;

-- 4. 컬럼 설명 추가
COMMENT ON COLUMN partner.name IS '파트너사 회사명';
COMMENT ON COLUMN partner.logo_url IS '파트너사 로고 이미지 URL';
COMMENT ON COLUMN partner.url IS '파트너사 웹사이트 URL';
COMMENT ON COLUMN partner.description IS '파트너 사업 영역';

-- 5. order_index 컬럼 추가 (정렬용)
ALTER TABLE partner ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

