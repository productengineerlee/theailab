# SQL 파일 가이드

## 📁 폴더 구조

```
sql/
├── 00-complete-setup.sql          # 🚀 전체 설정 (처음 시작시 실행)
├── setup/                          # 초기 설정 파일
├── migrations/                     # 마이그레이션 파일
├── fixes/                          # 문제 해결 파일
└── sample-data/                    # 샘플 데이터
```

---

## 🚀 빠른 시작 (신규 프로젝트)

### **단계 1: 전체 설정 실행**
```sql
-- Supabase SQL Editor에서 실행
sql/00-complete-setup.sql
```

이 파일 하나로 모든 설정이 완료됩니다:
- ✅ 모든 테이블 생성
- ✅ Storage 버킷 생성
- ✅ RLS 정책 설정
- ✅ 샘플 데이터 추가 (선택)

### **단계 2: 환경 변수 설정**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### **단계 3: 개발 서버 실행**
```bash
npm install
npm run dev
```

---

## 📂 폴더 설명

### **`setup/` - 초기 설정**
- `supabase-quick-setup.sql`: 빠른 전체 설정
- `supabase-schema.sql`: 데이터베이스 스키마
- `supabase-storage-setup.sql`: Storage 버킷 설정

### **`migrations/` - 테이블 변경**
개별 테이블 생성/수정 SQL 파일들:
- `about.sql`: About 테이블
- `career.sql`: Career 테이블
- `culture.sql`: Culture 테이블
- `history-update.sql`: History 테이블 업데이트
- `news-image.sql`: News 이미지 추가
- `partner-update.sql`: Partner 테이블 업데이트
- `product-image.sql`: Product 이미지 추가
- `product-url.sql`: Product URL 추가

### **`fixes/` - 문제 해결**
RLS 정책 및 기타 문제 수정:
- `about-rls.sql`: About RLS 정책 수정
- `culture-rls.sql`: Culture RLS 정책 수정
- `storage-fix.sql`: Storage 권한 수정

### **`sample-data/` - 샘플 데이터**
테스트용 샘플 데이터:
- `career-sample.sql`: Career 샘플 데이터
- `history-sample.sql`: History 샘플 데이터
- `partner-sample.sql`: Partner 샘플 데이터

---

## 🔧 문제 해결

### **1. RLS 정책 오류**
```sql
-- fixes/ 폴더의 해당 파일 실행
sql/fixes/about-rls.sql
sql/fixes/culture-rls.sql
```

### **2. Storage 접근 오류**
```sql
sql/fixes/storage-fix.sql
```

### **3. 테이블 누락**
```sql
-- 전체 재설정
sql/00-complete-setup.sql
```

---

## 📝 주의사항

1. **순서 중요**: `00-complete-setup.sql`을 먼저 실행하세요
2. **백업**: 프로덕션 데이터베이스 수정 전 백업 필수
3. **환경 분리**: 개발/스테이징/프로덕션 환경별로 별도 실행
4. **샘플 데이터**: 프로덕션에서는 sample-data 파일 실행 금지

---

## 🌐 배포 체크리스트

- [ ] Supabase 프로젝트 생성
- [ ] `00-complete-setup.sql` 실행
- [ ] 환경 변수 설정 (.env.production)
- [ ] 빌드 테스트 (`npm run build`)
- [ ] Vercel 배포
- [ ] Admin 계정 생성

---

**마지막 업데이트**: 2026-01-04

