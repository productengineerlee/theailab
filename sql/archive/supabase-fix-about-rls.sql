-- About 테이블 RLS 정책 수정
-- 실행일: 2026-01-04
-- 문제: Admin에서 수정 후 데이터를 읽을 수 없음 (Array(0) 반환)

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Allow public read access" ON about;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON about;
DROP POLICY IF EXISTS "Enable read access for all users" ON about;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON about;

-- 새로운 정책: 모든 작업 허용 (개발/테스트용)
CREATE POLICY "Allow all operations on about"
ON about
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 정책 확인
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'about';

-- 데이터 확인
SELECT id, section, title_en, title_ko, content FROM about ORDER BY order_index;

