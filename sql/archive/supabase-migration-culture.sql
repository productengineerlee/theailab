-- ========================================
-- Culture 테이블 생성 및 설정
-- ========================================

-- 1. Culture 테이블 생성
CREATE TABLE IF NOT EXISTS culture (
  id BIGSERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL CHECK (section IN ('hero', 'principle', 'work_method', 'culture_value')),
  title TEXT,
  subtitle TEXT,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_culture_section ON culture(section);
CREATE INDEX IF NOT EXISTS idx_culture_order ON culture(order_index);

-- 3. 코멘트 추가
COMMENT ON TABLE culture IS 'Culture 페이지의 섹션별 콘텐츠를 저장하는 테이블';
COMMENT ON COLUMN culture.section IS '섹션 구분: hero(히어로), principle(원칙), work_method(업무방식), culture_value(문화가치)';
COMMENT ON COLUMN culture.title IS '제목';
COMMENT ON COLUMN culture.subtitle IS '부제목';
COMMENT ON COLUMN culture.content IS '본문 내용';
COMMENT ON COLUMN culture.order_index IS '정렬 순서 (작은 숫자가 먼저 표시됨)';

-- 4. RLS (Row Level Security) 활성화
ALTER TABLE culture ENABLE ROW LEVEL SECURITY;

-- 5. 공개 읽기 권한 (모든 사용자가 조회 가능)
CREATE POLICY "Enable read access for all users" ON culture FOR SELECT USING (true);

-- 6. Admin 권한 (인증된 사용자만 수정 가능)
CREATE POLICY "Enable insert for authenticated users only" ON culture FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON culture FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON culture FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Updated_at 자동 업데이트 함수 (없으면 생성)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Updated_at 자동 업데이트 트리거
CREATE TRIGGER update_culture_updated_at 
BEFORE UPDATE ON culture 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 9. 초기 데이터 삽입
-- Hero Section
INSERT INTO culture (section, subtitle, title, content, order_index) VALUES
('hero', '일이 즐겁도록', 'OUR Culture', '현대인들은 하루의 1/3 이상을 회사에서 보내기에 그 시간이 즐거워야 삶이 좀 더 행복하고 윤택해질 수 있습니다. 회사에서 일하는 시간이 즐겁기 위해서는 건강하고 행복한 기업 문화가 갖추어져야 합니다.', 1)
ON CONFLICT DO NOTHING;

-- 기업문화 7가지 원칙
INSERT INTO culture (section, content, order_index) VALUES
('principle', '스타트업 마인드를 우리의 DNA에 새기고 기업의 미션과 비전을 실현하기 위해 노력한다', 1),
('principle', '한계를 뛰어넘는 목표를 설정하고 이를 통해 함께 성장한다', 2),
('principle', '자신의 역할에 한계를 짓지 않으며 유연한 팀을 운영한다', 3),
('principle', '모든 업무 과정은 투명하게 공유한다', 4),
('principle', '누구나 실패할 수 있다. 다만 성공적인 실패가 되어야 한다', 5),
('principle', '직급, 나이에 관계없이 상호 간 존칭을 사용하고 존중하고 배려한다', 6),
('principle', '우리는 지구의 보편적 삶과 교육을 향상시키기 위해 노력한다', 7)
ON CONFLICT DO NOTHING;

-- 업무방식 6가지
INSERT INTO culture (section, title, content, order_index) VALUES
('work_method', '한계를 뛰어넘는 목표와 퍼포먼스', '도전적인 목표 설정과 탁월한 성과 창출', 1),
('work_method', '투명한 공유', '모든 정보와 지식을 공개적으로 공유', 2),
('work_method', '유연한 팀과 책임감있는 리더십', '상황에 맞는 유연한 조직 운영', 3),
('work_method', '자기성찰과 피드백', '지속적인 개선을 위한 피드백 문화', 4),
('work_method', '적극적인 커뮤니케이션', '열린 소통과 활발한 의견 교환', 5),
('work_method', 'Open Door Policy', '언제든 자유롭게 소통할 수 있는 문화', 6)
ON CONFLICT DO NOTHING;

-- 팀워크 문화 4가지
INSERT INTO culture (section, title, content, order_index) VALUES
('culture_value', '우리는 함께 이 정글을 헤쳐나갈 동료입니다', '서로를 인정하고 칭찬하고 돕습니다', 1),
('culture_value', '소통을 위한 용기', '이타심과 선한 영향력을 발휘합니다', 2),
('culture_value', '나 먼저, 함께 역지사지', '생각하는 동료로서 상대방을 이해합니다', 3),
('culture_value', '편견을 가지지 않고 차별하지 않습니다', '틀린 것이 아니라 다른 것입니다', 4)
ON CONFLICT DO NOTHING;

