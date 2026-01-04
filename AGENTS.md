# AI Agent 개발 가이드

## 프로젝트 개요

**theailab**은 React + TypeScript + Vite 기반의 웹 애플리케이션입니다.

### 기술 스택
- **프레임워크**: React 19.2 + TypeScript
- **빌드 도구**: Vite 7.2
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: shadcn/ui (new-york style)
- **아이콘**: lucide-react

---

## 핵심 개발 규칙

### 1. UI 컴포넌트 개발 원칙

#### shadcn/ui 활용
모든 UI 컴포넌트는 **shadcn/ui**를 기반으로 개발합니다.

**컴포넌트 추가 방법:**

```bash
# 단일 컴포넌트 추가
npx shadcn@latest add button

# 여러 컴포넌트 동시 추가
npx shadcn@latest add button card dialog

# 자주 사용하는 컴포넌트
npx shadcn@latest add button input label card dialog alert-dialog
npx shadcn@latest add dropdown-menu select tabs accordion
npx shadcn@latest add toast form sheet avatar badge
```

**컴포넌트 위치:**
- 설치된 컴포넌트: `src/components/ui/`
- 커스텀 컴포넌트: `src/components/`

#### 스타일 가이드
- **shadcn/ui 스타일**: `new-york` (컴포넌트에 rounded 스타일 적용)
- **베이스 컬러**: `neutral`
- **CSS 변수 사용**: 활성화 (테마 커스터마이징 가능)
- **아이콘 라이브러리**: `lucide-react` 사용

```tsx
// 좋은 예시
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Search } from "lucide-react"

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <h2>제목</h2>
      </CardHeader>
      <CardContent>
        <Button>
          <Search className="mr-2 h-4 w-4" />
          검색
        </Button>
      </CardContent>
    </Card>
  )
}
```

### 2. 파일 및 폴더 구조

```
theailab/
├── src/
│   ├── components/          # 커스텀 컴포넌트
│   │   └── ui/             # shadcn/ui 컴포넌트
│   ├── lib/
│   │   └── utils.ts        # 유틸리티 함수 (cn 헬퍼 포함)
│   ├── hooks/              # 커스텀 훅
│   ├── assets/             # 정적 리소스
│   ├── App.tsx             # 메인 App 컴포넌트
│   ├── main.tsx            # 엔트리 포인트
│   └── index.css           # 글로벌 스타일 (Tailwind 포함)
├── public/                 # 공개 정적 파일
└── components.json         # shadcn/ui 설정
```

### 3. 개발 워크플로우

#### 새로운 기능 개발 시

1. **필요한 shadcn/ui 컴포넌트 확인 및 추가**
```bash
npx shadcn@latest add [component-name]
```

2. **커스텀 컴포넌트 작성**
- `src/components/` 폴더에 생성
- shadcn/ui 컴포넌트를 조합하여 구성

3. **스타일링**
- Tailwind CSS 유틸리티 클래스 사용
- `cn()` 헬퍼 함수로 조건부 스타일 적용

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "rounded-lg p-4",
  isActive && "bg-primary text-primary-foreground"
)} />
```

4. **타입 안정성 확인**
- TypeScript strict 모드 준수
- 모든 props에 타입 정의

### 4. 자주 사용하는 컴포넌트 패턴

#### Form 처리
```bash
npx shadcn@latest add form input label button
```

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LoginForm() {
  return (
    <form>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" />
        </div>
        <Button type="submit">로그인</Button>
      </div>
    </form>
  )
}
```

#### Dialog/Modal
```bash
npx shadcn@latest add dialog button
```

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>제목</DialogTitle>
        </DialogHeader>
        <p>내용</p>
      </DialogContent>
    </Dialog>
  )
}
```

#### 데이터 테이블
```bash
npx shadcn@latest add table card
```

### 5. Path Alias 사용

프로젝트에 설정된 path alias:

```typescript
"@/components/*"  → "src/components/*"
"@/lib/*"         → "src/lib/*"
"@/ui/*"          → "src/components/ui/*"
"@/hooks/*"       → "src/hooks/*"
"@/utils/*"       → "src/lib/utils/*"
```

**사용 예시:**
```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCustomHook } from "@/hooks/useCustomHook"
```

### 6. 스크립트 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린트 검사
npm run lint

# 미리보기 (빌드 후)
npm run preview
```

---

## shadcn/ui 컴포넌트 카탈로그

### 자주 사용하는 컴포넌트

| 컴포넌트 | 추가 명령어 | 용도 |
|---------|-----------|------|
| Button | `npx shadcn@latest add button` | 버튼, 액션 |
| Input | `npx shadcn@latest add input` | 텍스트 입력 |
| Card | `npx shadcn@latest add card` | 카드 레이아웃 |
| Dialog | `npx shadcn@latest add dialog` | 모달, 대화상자 |
| Select | `npx shadcn@latest add select` | 드롭다운 선택 |
| Toast | `npx shadcn@latest add toast` | 알림 메시지 |
| Form | `npx shadcn@latest add form` | 폼 처리 |
| Table | `npx shadcn@latest add table` | 데이터 테이블 |
| Tabs | `npx shadcn@latest add tabs` | 탭 UI |
| Avatar | `npx shadcn@latest add avatar` | 프로필 이미지 |
| Badge | `npx shadcn@latest add badge` | 뱃지, 태그 |
| Alert | `npx shadcn@latest add alert` | 경고 메시지 |
| Sheet | `npx shadcn@latest add sheet` | 사이드 패널 |
| Accordion | `npx shadcn@latest add accordion` | 아코디언 |
| Dropdown Menu | `npx shadcn@latest add dropdown-menu` | 드롭다운 메뉴 |

---

## 코딩 컨벤션

### TypeScript
- **Strict 모드 사용**
- 명시적 타입 정의 (any 사용 지양)
- Interface vs Type: 컴포넌트 props는 interface 사용

### React
- **함수형 컴포넌트 사용**
- Hooks 규칙 준수
- 컴포넌트명: PascalCase
- 파일명: PascalCase (컴포넌트), camelCase (유틸리티)

### 스타일링
- **Tailwind CSS 유틸리티 우선**
- 재사용 가능한 스타일은 컴포넌트로 추상화
- `cn()` 함수로 동적 클래스 조합

```tsx
// 좋은 예시
<div className="flex items-center gap-4 rounded-lg bg-card p-6">
  <Button size="lg" variant="default">확인</Button>
</div>

// 나쁜 예시 (인라인 스타일 지양)
<div style={{ display: 'flex', padding: '24px' }}>
  <button>확인</button>
</div>
```

---

## 주의사항

### ❌ 하지 말아야 할 것

1. **shadcn/ui 컴포넌트 직접 수정**
   - `src/components/ui/` 파일 직접 수정 금지
   - 커스터마이징이 필요하면 래퍼 컴포넌트 생성

2. **CSS 파일 남발**
   - 가능한 Tailwind 유틸리티 사용
   - 글로벌 스타일은 `index.css`에만

3. **타입 무시**
   - `@ts-ignore` 사용 지양
   - any 타입 최소화

### ✅ 권장사항

1. **컴포넌트 합성**
   - shadcn/ui 컴포넌트를 조합하여 복잡한 UI 구성
   - 재사용 가능한 단위로 분리

2. **접근성 고려**
   - shadcn/ui는 기본적으로 접근성 지원
   - ARIA 속성 적절히 활용

3. **반응형 디자인**
   - Tailwind 반응형 유틸리티 활용
   - 모바일 우선 접근

```tsx
// 반응형 예시
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</div>
```

---

## 빠른 참조

### 컴포넌트 추가
```bash
npx shadcn@latest add [component-name]
```

### 개발 서버 실행
```bash
npm run dev
```

### 임포트 예시
```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar } from "lucide-react"
```

### 공식 문서
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

**마지막 업데이트**: 2026-01-03



