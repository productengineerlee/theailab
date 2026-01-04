# 🚀 배포 가이드

## 📋 목차
1. [배포 전 체크리스트](#배포-전-체크리스트)
2. [Supabase 설정](#supabase-설정)
3. [Vercel 배포](#vercel-배포)
4. [배포 후 확인](#배포-후-확인)
5. [문제 해결](#문제-해결)

---

## ✅ 배포 전 체크리스트

### **1. 코드 준비**
- [ ] 모든 기능 테스트 완료
- [ ] 린트 에러 없음 (`npm run lint`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 환경 변수 확인
- [ ] Git 커밋 완료

### **2. Supabase 준비**
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 마이그레이션 완료
- [ ] RLS 정책 설정 완료
- [ ] Storage 버킷 생성 완료
- [ ] API URL 및 Anon Key 확보

### **3. 도메인/호스팅 준비**
- [ ] Vercel 계정 생성
- [ ] 도메인 준비 (선택사항)

---

## 🗄️ Supabase 설정

### **Step 1: 프로젝트 생성**

1. **Supabase 대시보드** 접속: https://supabase.com
2. **"New Project"** 클릭
3. 프로젝트 정보 입력:
   - **Name**: `theailab-production`
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
   - **Region**: `Northeast Asia (Seoul)`
   - **Pricing Plan**: Free (또는 Pro)
4. **Create new project** 클릭 (약 2분 소요)

### **Step 2: 데이터베이스 설정**

1. **SQL Editor** 메뉴 클릭
2. **New Query** 클릭
3. 아래 파일 내용 복사 & 붙여넣기:
   ```
   sql/00-complete-setup.sql
   ```
4. **Run** 버튼 클릭 (⏱️ 약 1-2분)
5. 성공 메시지 확인

### **Step 3: API 키 확보**

1. **Settings** → **API** 메뉴 클릭
2. 다음 정보 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbG...` (긴 토큰)

---

## 🌐 Vercel 배포

### **Step 1: Vercel 계정 연결**

1. **Vercel** 접속: https://vercel.com
2. **"Add New"** → **"Project"** 클릭
3. **Import Git Repository** 선택
4. GitHub 저장소 연결

### **Step 2: 프로젝트 설정**

**Framework Preset**: `Vite`
**Root Directory**: `./` (기본값)
**Build Command**: `npm run build`
**Output Directory**: `dist`

### **Step 3: 환경 변수 설정**

**Environment Variables** 섹션에서 추가:

```
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbG...
```

### **Step 4: 배포 실행**

1. **Deploy** 버튼 클릭
2. 배포 진행 상황 확인 (약 2-3분)
3. 배포 완료 후 URL 확인

---

## 🔍 배포 후 확인

### **1. 기본 기능 테스트**

```
✅ 체크리스트:
□ 홈페이지 로딩
□ About 페이지 표시
□ Culture 페이지 표시
□ Product 페이지 표시
□ 언어 전환 (한국어 ↔ 영어)
□ 이미지 로딩
```

### **2. Admin 기능 테스트**

1. **Admin 로그인**: `https://your-domain.vercel.app/admin/login`
2. Admin 계정 생성 (Supabase Auth 사용)
3. 대시보드 접속
4. 데이터 CRUD 테스트

### **3. 성능 확인**

- Lighthouse 점수 확인
- 모바일/데스크톱 반응형 확인
- 페이지 로딩 속도 확인

---

## 🐛 문제 해결

### **1. 빌드 실패**

**증상**: Vercel 배포 중 빌드 오류

**해결**:
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 메시지 확인
# package.json 의존성 확인
npm install
```

### **2. 환경 변수 오류**

**증상**: API 호출 실패, Supabase 연결 불가

**해결**:
1. Vercel **Settings** → **Environment Variables** 확인
2. `VITE_` 접두사 확인
3. 값에 공백이나 따옴표 없는지 확인
4. 재배포: **Deployments** → **Redeploy**

### **3. 이미지 로딩 실패**

**증상**: 업로드한 이미지가 표시되지 않음

**해결**:
```sql
-- Supabase SQL Editor에서 실행
sql/fixes/storage-fix.sql
```

### **4. RLS 정책 오류**

**증상**: 데이터 조회/수정 실패

**해결**:
```sql
-- 해당 테이블의 RLS 정책 확인 및 수정
sql/fixes/about-rls.sql
sql/fixes/culture-rls.sql
```

### **5. 404 에러 (페이지 찾을 수 없음)**

**증상**: 특정 페이지 접속 시 404

**해결**:
1. Vercel **Settings** → **Rewrites** 확인
2. SPA 라우팅 설정:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/" }
     ]
   }
   ```

---

## 🔐 보안 권장사항

### **프로덕션 환경**

1. **RLS 정책 강화**:
   ```sql
   -- 읽기는 public, 쓰기는 authenticated만 허용
   DROP POLICY IF EXISTS "Allow all operations on [table]" ON [table];
   
   CREATE POLICY "Allow public read" ON [table]
   FOR SELECT TO public USING (true);
   
   CREATE POLICY "Allow authenticated write" ON [table]
   FOR INSERT TO authenticated USING (true) WITH CHECK (true);
   ```

2. **Admin 접근 제한**:
   - Admin 페이지에 인증 추가
   - 특정 이메일만 허용

3. **API 키 관리**:
   - Anon Key는 공개 가능 (RLS로 보호)
   - Service Role Key는 **절대** 노출 금지

---

## 📊 모니터링

### **Vercel Analytics** (선택사항)

1. Vercel 프로젝트 → **Analytics** 탭
2. Enable Analytics
3. 트래픽, 성능 모니터링

### **Supabase Monitoring**

1. Supabase **Dashboard** → **Reports**
2. 데이터베이스 사용량, API 요청 수 확인

---

## 🔄 업데이트 프로세스

### **코드 업데이트**

```bash
# 1. 코드 수정
git add .
git commit -m "Feature: Add new feature"
git push origin main

# 2. Vercel 자동 배포 (약 2-3분)
# 3. 배포 완료 후 확인
```

### **데이터베이스 업데이트**

```sql
-- Supabase SQL Editor에서 마이그레이션 실행
-- sql/migrations/ 폴더의 필요한 파일 실행
```

---

## 📞 지원

**문제가 계속되면**:
1. Vercel 로그 확인: **Deployments** → 해당 배포 → **Function Logs**
2. Supabase 로그 확인: **Logs** → **API** 또는 **Postgres**
3. 브라우저 콘솔 확인 (F12)

---

**마지막 업데이트**: 2026-01-04

