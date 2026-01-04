-- Career 샘플 데이터 추가
-- Supabase SQL Editor에서 실행하세요

-- 혜택 및 복지
INSERT INTO career (title, description, type, order_index) VALUES
('맥북 프로 지급', '', 'benefit', 1),
('눈치 안보고 언제든지 2시간 단위로 자유롭게 쓸 수 있는 휴가', '', 'benefit', 2),
('카페 같은 근무 환경', '', 'benefit', 3),
('유연 출퇴근제', '', 'benefit', 4),
('커피, 음료, 간식 무한 제공', '', 'benefit', 5),
('업무 관련 도서 및 콘텐츠 구입 지원', '', 'benefit', 6),
('성과에 따른 인센티브 및 스톡옵션 부여', '', 'benefit', 7);

-- 면접 절차
INSERT INTO career (title, description, type, order_index) VALUES
('1차 서류 면접', '', 'process', 1),
('2차 실무 면접', '', 'process', 2),
('3차 임원 면접', '', 'process', 3),
('최종 합격', '', 'process', 4);

