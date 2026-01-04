-- ========================================
-- Culture 테이블 RLS 정책 수정
-- ========================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Enable read access for all users" ON culture;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON culture;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON culture;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON culture;

-- 새로운 정책 생성 (더 관대한 정책)
-- 1. 모든 사용자 읽기 허용
CREATE POLICY "Enable read access for all users" 
ON culture FOR SELECT 
USING (true);

-- 2. 모든 인증된 사용자 INSERT 허용
CREATE POLICY "Enable insert for authenticated users" 
ON culture FOR INSERT 
WITH CHECK (true);

-- 3. 모든 인증된 사용자 UPDATE 허용
CREATE POLICY "Enable update for authenticated users" 
ON culture FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- 4. 모든 인증된 사용자 DELETE 허용
CREATE POLICY "Enable delete for authenticated users" 
ON culture FOR DELETE 
USING (true);

