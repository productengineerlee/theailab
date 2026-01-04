-- History 샘플 데이터
-- Supabase SQL Editor에서 실행하세요
-- 먼저 테이블 마이그레이션(supabase-migration-history-update.sql)을 실행하세요

-- 기존 데이터 삭제 (선택사항)
-- TRUNCATE TABLE history RESTART IDENTITY CASCADE;

-- AICE 교육 샘플
INSERT INTO history (year_month, major_category, sub_category, client, education_content, participants) VALUES
('2026-01', 'AICE', 'BASIC', '협성고등학교', 'aice basic', 30),
('2025-12', 'AICE', 'ASSOCIATE', '서울대학교', 'aice associate', 25),
('2025-11', 'AICE', 'PROFESSIONAL', '연세대학교', 'aice professional', 20);

-- AI교육 샘플
INSERT INTO history (year_month, major_category, sub_category, client, education_content, participants) VALUES
('2025-10', 'AI교육', '생성형AI', '카카오', 'ChatGPT 활용 교육', 40),
('2025-09', 'AI교육', '데이터분석', '네이버', 'Python 데이터 분석', 35),
('2025-08', 'AI교육', '바이브코딩', '삼성전자', '바이브코딩 실습', 50),
('2025-07', 'AI교육', 'AI자동화', 'LG전자', 'RPA 자동화 교육', 30);

-- 자격증 교육 샘플
INSERT INTO history (year_month, major_category, sub_category, client, education_content, participants) VALUES
('2025-06', '자격증', '빅데이터분석기사', '고려대학교', '빅데이터분석기사 과정', 45),
('2025-05', '자격증', 'ADsP', '한양대학교', 'ADsP 자격증 준비반', 38),
('2025-04', '자격증', 'SQLD', '성균관대학교', 'SQLD 자격증 과정', 42),
('2025-03', '자격증', '경영정보시각화능력', '이화여대', '경영정보시각화능력 교육', 28);

