# 🚀 배포 체크리스트

배포 전 이 체크리스트를 확인하세요!

---

## 📝 배포 전 (Pre-Deployment)

### **코드 품질**
- [ ] `npm run lint` 실행 → 에러 0개
- [ ] `npm run build` 실행 → 빌드 성공
- [ ] 모든 페이지 로컬 테스트 완료
- [ ] 한/영 번역 확인
- [ ] 이미지 로딩 확인
- [ ] Admin 기능 테스트

### **Git**
- [ ] 모든 변경사항 커밋
- [ ] GitHub에 Push 완료
- [ ] 브랜치: `main` 또는 `master`

### **환경 변수**
- [ ] `.env` 파일 확인
- [ ] Supabase URL 정확성 확인
- [ ] Anon Key 정확성 확인

---

## 🗄️ Supabase 설정

### **프로젝트 생성**
- [ ] Supabase 계정 생성
- [ ] 새 프로젝트 생성
- [ ] Region: Seoul 선택
- [ ] 데이터베이스 비밀번호 저장

### **데이터베이스 설정**
- [ ] `sql/00-complete-setup.sql` 실행
- [ ] 에러 없이 완료 확인
- [ ] 테이블 생성 확인 (7개)
- [ ] Storage 버킷 확인 (2개)

### **API 키 확보**
- [ ] Project URL 복사
- [ ] Anon Key 복사
- [ ] 안전한 곳에 저장

---

## 🌐 Vercel 배포

### **프로젝트 설정**
- [ ] Vercel 계정 생성/로그인
- [ ] GitHub 저장소 연결
- [ ] Framework: Vite 선택
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### **환경 변수 입력**
- [ ] `VITE_SUPABASE_URL` 추가
- [ ] `VITE_SUPABASE_ANON_KEY` 추가
- [ ] 값에 공백 없는지 확인

### **배포 실행**
- [ ] Deploy 버튼 클릭
- [ ] 빌드 로그 확인
- [ ] 배포 성공 메시지 확인
- [ ] 배포 URL 확인

---

## ✅ 배포 후 확인 (Post-Deployment)

### **기본 기능**
- [ ] 홈페이지 접속 가능
- [ ] About 페이지 표시
- [ ] Culture 페이지 표시
- [ ] Product 페이지 표시
- [ ] Partner 페이지 표시
- [ ] Career 페이지 표시
- [ ] News 페이지 표시
- [ ] IR 페이지 표시

### **다국어**
- [ ] 한국어 → 영어 전환
- [ ] 영어 → 한국어 전환
- [ ] 모든 페이지 번역 확인

### **Admin**
- [ ] `/admin/login` 접속
- [ ] Admin 계정 생성 (Supabase Auth)
- [ ] 대시보드 접속
- [ ] 데이터 조회 가능
- [ ] 데이터 수정 가능
- [ ] 이미지 업로드 가능

### **반응형**
- [ ] 모바일 화면 (375px)
- [ ] 태블릿 화면 (768px)
- [ ] 데스크톱 화면 (1920px)

### **성능**
- [ ] Lighthouse 점수 확인 (권장: 90+ 점)
- [ ] 페이지 로딩 속도 (권장: 2초 이내)
- [ ] 이미지 최적화 확인

---

## 🐛 문제 발생 시

### **빌드 실패**
```bash
# 로컬에서 확인
npm run build
npm run preview
```

### **환경 변수 오류**
1. Vercel Settings → Environment Variables 확인
2. `VITE_` 접두사 확인
3. 재배포

### **데이터베이스 오류**
```sql
-- Supabase SQL Editor에서
sql/fixes/about-rls.sql
sql/fixes/culture-rls.sql
sql/fixes/storage-fix.sql
```

### **404 오류**
Vercel Settings → Rewrites 추가:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 📊 배포 완료!

### **URL 공유**
- [ ] 배포 URL 저장
- [ ] 팀원에게 공유
- [ ] 도메인 연결 (선택)

### **모니터링 설정**
- [ ] Vercel Analytics 활성화
- [ ] Supabase Reports 확인
- [ ] 에러 모니터링 설정

### **문서 업데이트**
- [ ] README.md 업데이트
- [ ] 배포 URL 추가
- [ ] 팀원 가이드 작성

---

## 🎉 축하합니다!

프로젝트가 성공적으로 배포되었습니다!

**다음 단계:**
1. 사용자 피드백 수집
2. 버그 수정 및 개선
3. 새로운 기능 추가

---

**배포일**: ____________________
**배포 URL**: ____________________
**배포자**: ____________________

---

**참고 문서:**
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 상세 배포 가이드
- [sql/README.md](./sql/README.md) - SQL 파일 가이드
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase 설정 가이드

