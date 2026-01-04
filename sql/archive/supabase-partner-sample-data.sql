-- Partner 샘플 데이터
-- Supabase SQL Editor에서 실행하세요
-- 먼저 테이블 마이그레이션(supabase-migration-partner-update.sql)을 실행하세요

-- 기존 데이터 삭제 (선택사항)
-- TRUNCATE TABLE partner RESTART IDENTITY CASCADE;

-- 파트너사 데이터 추가
INSERT INTO partner (name, url, description, order_index) VALUES
('KT', 'https://www.kt.com', 'AI 교육 플랫폼 개발 및 통신 인프라 지원', 1),
('한국경제', 'https://www.hankyung.com', 'AI 경제 교육 콘텐츠 제작 및 배포', 2),
('잼코딩', 'https://www.jamcoding.co.kr', 'AI 코딩 교육 플랫폼 공동 개발', 3),
('아주대학교', 'https://www.ajou.ac.kr', 'AI 연구 및 산학협력 프로젝트', 4);

