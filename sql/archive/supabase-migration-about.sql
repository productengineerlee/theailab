-- About 테이블 생성
-- Supabase SQL Editor에서 실행하세요

-- 1. about 테이블 생성
CREATE TABLE IF NOT EXISTS about (
  id BIGSERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE, -- 'hero', 'mission', 'vision'
  title_en VARCHAR(255),
  title_ko VARCHAR(255),
  subtitle VARCHAR(255),
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 제약조건 추가
ALTER TABLE about 
ADD CONSTRAINT about_section_check 
CHECK (section IN ('hero', 'mission', 'vision'));

-- 3. 컬럼 설명
COMMENT ON COLUMN about.section IS '섹션 구분: hero, mission, vision';
COMMENT ON COLUMN about.title_en IS '영문 제목';
COMMENT ON COLUMN about.title_ko IS '한글 제목/부제';
COMMENT ON COLUMN about.subtitle IS '부제목';
COMMENT ON COLUMN about.content IS '본문 내용';

-- 4. RLS 활성화
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- 5. Public 읽기 권한
CREATE POLICY "Enable read access for all users" ON about FOR SELECT USING (true);

-- 6. Admin 권한 (인증된 사용자만 수정 가능)
CREATE POLICY "Enable insert for authenticated users only" ON about FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON about FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON about FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Updated_at 자동 업데이트 함수 (없으면 생성)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Updated_at 자동 업데이트 트리거
CREATE TRIGGER update_about_updated_at 
BEFORE UPDATE ON about 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 9. 초기 데이터 삽입
INSERT INTO about (section, title_en, title_ko, subtitle, content, order_index) VALUES
('hero', 'ABOUT US', NULL, NULL, '더에이아이랩은 누구나 쉽게 배우고, 일상과 업무에서 실질적으로 활용할 수 있도록 보편적 인공지능 시대를 지향합니다.', 1),
('mission', 'AI for Everyone, for Everything', '모든 사람을 위한, 모든 것을 위한 AI', NULL, '인공지능이 특정 분야나 소수의 전문가에게만 국한되지 않고, 누구나 자신의 삶과 일에서 AI를 자유롭게 활용할 수 있도록 합니다.', 2),
('vision', 'AI for Education, Education for AI', '교육을 위한 AI, AI를 위한 교육', NULL, '교육은 AI 시대를 준비하는 가장 강력한 도구이며, AI는 교육을 혁신하는 가장 효과적인 수단입니다. 더에이아이랩은 이 선순환 구조를 만들어, AI 리터러시가 보편화된 사회를 실현합니다.', 3)
ON CONFLICT (section) DO NOTHING;

