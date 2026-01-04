-- 데이터베이스 스키마 생성 SQL
-- Supabase SQL Editor에서 실행하세요

-- History 테이블
CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,
  year_month VARCHAR(7) NOT NULL, -- YYYY-MM 형식
  client VARCHAR(255) NOT NULL, -- 거래처
  education_content TEXT NOT NULL, -- 교육내용
  participants INTEGER NOT NULL DEFAULT 0, -- 인원
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product 테이블
CREATE TABLE IF NOT EXISTS product (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner 테이블
CREATE TABLE IF NOT EXISTS partner (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career 테이블
CREATE TABLE IF NOT EXISTS career (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('benefit', 'process')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News 테이블
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  date VARCHAR(7) NOT NULL, -- YYYY.MM 형식
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_history_year_month ON history(year_month);
CREATE INDEX IF NOT EXISTS idx_career_type ON career(type);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date);

-- Row Level Security (RLS) 활성화
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner ENABLE ROW LEVEL SECURITY;
ALTER TABLE career ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Public 읽기 권한 (모든 사용자가 조회 가능)
CREATE POLICY "Enable read access for all users" ON history FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON product FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON partner FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON career FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON news FOR SELECT USING (true);

-- Admin 권한 (인증된 사용자만 수정 가능)
-- 주의: 실제 프로덕션에서는 더 세밀한 권한 설정 필요
CREATE POLICY "Enable insert for authenticated users only" ON history FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON history FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON history FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON product FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON product FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON product FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON partner FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON partner FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON partner FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON career FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON career FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON career FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON news FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON news FOR DELETE USING (auth.role() = 'authenticated');

-- Updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 트리거 적용
CREATE TRIGGER update_history_updated_at BEFORE UPDATE ON history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON product FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partner_updated_at BEFORE UPDATE ON partner FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_career_updated_at BEFORE UPDATE ON career FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



