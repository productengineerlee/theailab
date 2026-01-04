-- History 테이블 업데이트
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 category 컬럼을 major_category로 변경
ALTER TABLE history RENAME COLUMN category TO major_category;

-- 2. sub_category 컬럼 추가
ALTER TABLE history ADD COLUMN IF NOT EXISTS sub_category VARCHAR(100);

-- 3. logo_url 컬럼 추가 (거래처 로고)
ALTER TABLE history ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 4. major_category 컬럼에 체크 제약조건 추가
ALTER TABLE history 
ADD CONSTRAINT history_major_category_check 
CHECK (major_category IN ('AICE', 'AI교육', '자격증'));

-- 5. 기존 데이터가 있다면 기본값으로 'AICE' 설정
UPDATE history SET major_category = 'AICE' WHERE major_category IS NULL OR major_category = '';

-- 6. 컬럼 설명 추가
COMMENT ON COLUMN history.major_category IS '대분류: AICE, AI교육, 자격증';
COMMENT ON COLUMN history.sub_category IS '중분류: AICE(BASIC, ASSOCIATE, PROFESSIONAL), AI교육(생성형AI, 데이터분석, 바이브코딩, AI자동화), 자격증(빅데이터분석기사, ADsP, SQLD, 경영정보시각화능력)';
COMMENT ON COLUMN history.logo_url IS '거래처 로고 이미지 URL';

