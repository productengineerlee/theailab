# 더에이아이랩 Admin 시스템 가이드

## 🔐 로그인 정보

- **URL**: `http://localhost:5174/admin/login`
- **아이디**: `admin`
- **비밀번호**: `robot1765!`

## 📋 Supabase 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 새 프로젝트 생성
2. 프로젝트 설정에서 API 정보 확인:
   - Project URL
   - Anon (public) Key

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 데이터베이스 스키마 생성

1. Supabase Dashboard → SQL Editor 이동
2. `supabase-schema.sql` 파일의 내용을 복사하여 실행
3. 다음 테이블이 생성됩니다:
   - `history` - 교육 이력
   - `product` - 제품 정보
   - `partner` - 파트너 정보
   - `career` - 채용 정보 (혜택/프로세스)
   - `news` - 뉴스

### 4. Product 이미지 업로드 설정

**4.1. 데이터베이스 마이그레이션**

Supabase Dashboard → SQL Editor에서 `supabase-migration-product-image.sql` 실행:

```sql
ALTER TABLE product ADD COLUMN IF NOT EXISTS image_url TEXT;
```

**4.2. Storage 버킷 생성**

1. Supabase Dashboard → Storage 메뉴로 이동
2. "New bucket" 버튼 클릭
3. 버킷 정보 입력:
   - **Name**: `product-images`
   - **Public bucket**: ✅ ON (체크)
   - **File size limit**: 5 MB (선택사항)
   - **Allowed MIME types**: `image/*` (선택사항)
4. "Create bucket" 클릭

**4.3. Storage 정책 (자동 생성)**

Public 버킷으로 설정하면:
- ✅ 모든 사용자가 이미지를 읽을 수 있음
- ✅ 업로드는 애플리케이션 코드를 통해서만 가능

## 🚀 Admin 시스템 사용법

### History 관리

**입력 필드:**
- **년월** (YYYY-MM): 교육 진행 년월
- **거래처**: 교육 진행 기관/회사명
- **교육내용**: 교육 프로그램 내용 (예: AICE Basic)
- **인원**: 교육 참가 인원 수

**예시:**
- 년월: 2025-01
- 거래처: 협성고등학교
- 교육내용: AICE Basic
- 인원: 30

### Product 관리

**입력 필드:**
- **제목**: 제품/서비스명
- **설명**: 제품 설명
- **제품 이미지**: 제품 대표 이미지 (선택 사항)
  - 지원 형식: JPG, PNG, GIF, WEBP 등
  - 최대 파일 크기: 5MB
  - 권장 크기: 1200×800px 이상

**이미지 업로드 방법:**
1. "새 항목" 버튼 클릭 또는 기존 항목 수정
2. "제품 이미지" 섹션에서 파일 선택
3. 이미지 미리보기 확인
4. "저장" 버튼 클릭

**예시:**
- 제목: 코딩엑스 codingx.ai
- 설명: 삼단형 클릭판, vod 제공 - test
- 이미지: codingx-logo.png (업로드)

### Partner 관리

- **파트너명**: 파트너 기관/회사명
- **로고 URL**: (선택) 파트너 로고 이미지 URL

### Career 관리

- **타입**: 혜택(benefit) 또는 프로세스(process)
- **제목**: 항목 제목
- **설명**: 항목 설명
- **순서**: 표시 순서 (숫자)

### News 관리

- **날짜** (YYYY.MM): 뉴스 날짜
- **제목**: 뉴스 제목
- **내용**: 뉴스 내용

## 📁 프로젝트 구조

```
src/
├── contexts/
│   └── AuthContext.tsx          # 인증 컨텍스트
├── components/
│   ├── ProtectedRoute.tsx       # 보호된 라우트 컴포넌트
│   └── ui/                      # shadcn/ui 컴포넌트
├── layouts/
│   ├── Layout.tsx               # 공개 페이지 레이아웃
│   └── AdminLayout.tsx          # Admin 페이지 레이아웃
├── lib/
│   └── supabase.ts              # Supabase 클라이언트 설정
└── pages/
    ├── admin/
    │   ├── Login.tsx            # Admin 로그인
    │   ├── Dashboard.tsx        # Admin 대시보드
    │   ├── HistoryManage.tsx    # History 관리
    │   ├── ProductManage.tsx    # Product 관리
    │   ├── PartnerManage.tsx    # Partner 관리
    │   ├── CareerManage.tsx     # Career 관리
    │   └── NewsManage.tsx       # News 관리
    └── [공개 페이지들]
```

## 🔒 보안 주의사항

### 현재 구현 (개발용)

- 하드코딩된 아이디/비밀번호 사용
- SessionStorage 기반 인증

### 프로덕션 배포 시 권장사항

1. **Supabase Auth 사용**
   ```typescript
   // Supabase Auth로 업그레이드
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'admin@theailab.co',
     password: password,
   });
   ```

2. **환경 변수 보호**
   - `.env` 파일을 `.gitignore`에 추가
   - Vercel/Netlify 등 배포 플랫폼의 환경 변수 설정 사용

3. **Row Level Security (RLS)**
   - 현재 스키마에 RLS가 설정되어 있음
   - 인증된 사용자만 데이터 수정 가능
   - 모든 사용자는 데이터 조회 가능

## 🛠️ 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📝 데이터 마이그레이션

기존 하드코딩된 데이터를 Supabase로 마이그레이션하려면:

1. Admin 페이지에서 각 항목을 수동으로 입력하거나
2. Supabase SQL Editor에서 INSERT 쿼리 실행:

```sql
-- History 예시
INSERT INTO history (year_month, client, education_content, participants)
VALUES 
  ('2025-01', '협성고등학교', 'AICE Basic', 30),
  ('2025-01', '한밭대학교', 'AICE Basic', 45);

-- Product 예시
INSERT INTO product (title, description)
VALUES 
  ('AI 교육 플랫폼', '누구나 쉽게 배울 수 있는 체계적인 AI 교육 콘텐츠를 제공합니다.');
```

## 🎯 다음 단계

1. `.env` 파일 생성 및 Supabase 정보 입력
2. Supabase에서 스키마 실행
3. Admin 로그인 (`/admin/login`)
4. 데이터 입력 및 관리
5. 공개 페이지에서 데이터 확인

## 💡 문제 해결

### "Supabase credentials not found" 오류
- `.env` 파일이 올바르게 생성되었는지 확인
- 환경 변수 이름이 `VITE_` 접두사로 시작하는지 확인
- 개발 서버 재시작

### 데이터가 표시되지 않음
- Supabase 대시보드에서 데이터가 실제로 저장되었는지 확인
- 브라우저 콘솔에서 에러 메시지 확인
- RLS 정책이 올바르게 설정되었는지 확인

### 로그인이 안됨
- 아이디: `admin`, 비밀번호: `robot1765!` 정확히 입력
- 브라우저 캐시 삭제 후 재시도

### 이미지 업로드 오류
- **"이미지 업로드 실패"** 오류 시:
  - Supabase Storage에 `product-images` 버킷이 생성되었는지 확인
  - 버킷이 Public으로 설정되었는지 확인
  - 파일 크기가 5MB 이하인지 확인
  - 이미지 파일 형식이 지원되는지 확인 (JPG, PNG, GIF, WEBP)
  
- **이미지가 표시되지 않음**:
  - Supabase Dashboard → Storage → product-images 버킷에서 파일이 업로드되었는지 확인
  - 브라우저 개발자 도구(F12) → Network 탭에서 이미지 로드 오류 확인
  - 버킷이 Public으로 설정되어 있는지 재확인

