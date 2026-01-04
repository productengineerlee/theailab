-- Career 테이블에 job_posting type 추가
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 체크 제약조건 삭제
ALTER TABLE career DROP CONSTRAINT IF EXISTS career_type_check;

-- 2. 새로운 체크 제약조건 추가 (job_posting 포함)
ALTER TABLE career 
ADD CONSTRAINT career_type_check 
CHECK (type IN ('benefit', 'process', 'job_posting'));

-- 3. 컬럼 설명 추가
COMMENT ON COLUMN career.type IS 'benefit: 혜택 및 복지, process: 채용 절차, job_posting: 채용 공고';

