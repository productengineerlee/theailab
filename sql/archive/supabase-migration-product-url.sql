-- Product 테이블에 url 컬럼 추가
-- 실행일: 2026-01-04

-- url 컬럼 추가
ALTER TABLE product 
ADD COLUMN IF NOT EXISTS url TEXT;

-- url 컬럼에 설명 추가
COMMENT ON COLUMN product.url IS '제품 링크 URL (외부 링크)';

-- 기존 데이터 확인
SELECT id, title, url FROM product ORDER BY id;

