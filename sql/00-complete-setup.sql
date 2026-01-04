-- ============================================
-- The AI Lab - 완전한 데이터베이스 설정
-- ============================================
-- 이 파일 하나로 모든 테이블, Storage, RLS 정책을 설정합니다.
-- 실행 시간: 약 1-2분
-- 실행일: 2026-01-04
-- ============================================

-- ============================================
-- 1. 테이블 생성
-- ============================================

-- About 테이블
CREATE TABLE IF NOT EXISTS about (
  id BIGSERIAL PRIMARY KEY,
  section TEXT NOT NULL CHECK (section IN ('hero', 'mission', 'vision')),
  title_en TEXT,
  title_ko TEXT,
  subtitle TEXT,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Culture 테이블
CREATE TABLE IF NOT EXISTS culture (
  id BIGSERIAL PRIMARY KEY,
  section TEXT NOT NULL CHECK (section IN ('hero', 'principle', 'work_method', 'culture_value')),
  title TEXT,
  subtitle TEXT,
  content TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- History 테이블
CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  month TEXT NOT NULL,
  major_category TEXT NOT NULL CHECK (major_category IN ('AICE', 'AI교육', '자격증')),
  sub_category TEXT,
  client TEXT NOT NULL,
  education_content TEXT NOT NULL,
  participants INTEGER,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product 테이블
CREATE TABLE IF NOT EXISTS product (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner 테이블
CREATE TABLE IF NOT EXISTS partner (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  url TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career 테이블
CREATE TABLE IF NOT EXISTS career (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('benefit', 'process', 'job_posting')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News 테이블
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. 트리거 함수 생성
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 각 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_about_updated_at ON about;
CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON about
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_culture_updated_at ON culture;
CREATE TRIGGER update_culture_updated_at BEFORE UPDATE ON culture
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_history_updated_at ON history;
CREATE TRIGGER update_history_updated_at BEFORE UPDATE ON history
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_updated_at ON product;
CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON product
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_updated_at ON partner;
CREATE TRIGGER update_partner_updated_at BEFORE UPDATE ON partner
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_career_updated_at ON career;
CREATE TRIGGER update_career_updated_at BEFORE UPDATE ON career
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. RLS (Row Level Security) 정책 설정
-- ============================================

-- RLS 활성화
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE culture ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner ENABLE ROW LEVEL SECURITY;
ALTER TABLE career ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Allow all operations on about" ON about;
DROP POLICY IF EXISTS "Allow all operations on culture" ON culture;
DROP POLICY IF EXISTS "Allow all operations on history" ON history;
DROP POLICY IF EXISTS "Allow all operations on product" ON product;
DROP POLICY IF EXISTS "Allow all operations on partner" ON partner;
DROP POLICY IF EXISTS "Allow all operations on career" ON career;
DROP POLICY IF EXISTS "Allow all operations on news" ON news;

-- 모든 작업 허용 정책 (개발/테스트용)
CREATE POLICY "Allow all operations on about" ON about FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on culture" ON culture FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on history" ON history FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on product" ON product FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on partner" ON partner FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on career" ON career FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on news" ON news FOR ALL TO public USING (true) WITH CHECK (true);

-- ============================================
-- 4. Storage 버킷 생성
-- ============================================

-- images 버킷 생성 (이미지 통합 관리)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- product-images 버킷
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. Storage RLS 정책
-- ============================================

-- 기존 Storage 정책 삭제
DROP POLICY IF EXISTS "Allow public upload to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from product-images" ON storage.objects;

-- images 버킷 정책
CREATE POLICY "Allow public upload to images"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public read from images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'images');

CREATE POLICY "Allow public delete from images"
ON storage.objects FOR DELETE TO public
USING (bucket_id = 'images');

-- product-images 버킷 정책
CREATE POLICY "Allow public upload to product-images"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public read from product-images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Allow public delete from product-images"
ON storage.objects FOR DELETE TO public
USING (bucket_id = 'product-images');

-- ============================================
-- 6. 확인 쿼리
-- ============================================

-- 생성된 테이블 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Storage 버킷 확인
SELECT id, name, public FROM storage.buckets;

-- RLS 정책 확인
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- 완료!
-- ============================================
-- 모든 설정이 완료되었습니다.
-- 다음 단계:
-- 1. 샘플 데이터 추가 (선택): sql/sample-data/ 폴더 참조
-- 2. 환경 변수 설정: .env 파일에 Supabase URL과 KEY 추가
-- 3. 개발 서버 실행: npm run dev
-- ============================================

