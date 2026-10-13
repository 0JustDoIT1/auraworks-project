<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Rules

## Stack

- Next.js 16 (App Router, React Compiler), React 19, TypeScript(strict), Tailwind CSS v4, Supabase, npm
- UI 라이브러리: `lucide-react`(아이콘), `embla-carousel-react` + `embla-carousel-autoplay`(히어로 캐러셀), `sonner`(토스트), `pretendard`(폰트)
- 별도 백엔드 없음. 새 라이브러리는 필요성 확인 후에만 추가

## Structure

- 페이지 전용 UI: `src/app/_components/`
- 의존 방향: app → features → components/ui, lib (feature 간 직접 import 금지)
- feature 간 연결은 app에서 조합 (예: `app/_components/StoreBookList.tsx`가 books와 cart를 연결)
- 공통 layout이 feature를 써야 하면 props(slot)로 주입 (예: `Header`의 `cartSlot`·`noticeSlot`에 `layout.tsx`가 `CartButton`·`NoticeButton` 전달)
- 도메인 단위: `src/features/<domain>/`
  - 파일은 루트에 두지 않고 역할별 폴더에 둠
    - `api/`: Supabase 호출
    - `components/`: UI
    - `hooks/`: `useXxx.ts`
    - `store/`: 상태와 동작을 가진 스토어
    - `types/`: 타입 (`types/<domain>.ts`)
    - `utils/`: 상태 없는 순수 함수 (계산·변환)
    - `constants/`: 값만 있는 상수 (필요할 때만 생성)
  - 현재 도메인: `books`(교재 목록·상세), `cart`(장바구니), `notices`(공지 알림)
- 공통: `src/components/layout`, `src/components/ui`
- 외부 클라이언트·유틸: `src/lib/` (Supabase 클라이언트는 `src/lib/supabase/client.ts` 한 곳에서만 생성)
- 폴더 kebab-case, 컴포넌트 PascalCase, hook `useXxx.ts`

## Data Flow (CSR)

- 교재 데이터는 CSR로 조회: `api/books.ts` → `hooks/useBooks.ts` → 컴포넌트
- Supabase 호출은 `features/*/api/`에서만. 컴포넌트에서 직접 호출 금지
- hook은 data / isLoading / error 상태를 반환하고, 화면은 로딩·에러·빈 상태를 모두 처리
- 공지는 같은 흐름: `api/notices.ts` → `hooks/useNotices.ts`, 읽은 공지 id 목록은 `notices/store/noticeReadStore.ts`(localStorage)
- 장바구니는 로그인 없이 localStorage에 저장: `cart/store/cartStore.ts`(`useSyncExternalStore`용 스토어) → `hooks/useCart.ts`
- 데이터가 필요 없는 컴포넌트는 Server Component 유지

## Supabase

- publishable key만 클라이언트에서 사용 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `.env`, git 제외)
- RLS 활성화 + SELECT만 허용하는 정책
- DB 컬럼명은 추측하지 말고 각 feature의 `types/`에 있는 Row 타입(`BookRow`, `NoticeRow`) 기준으로 사용

## Styling

- 컨테이너: `container-page` 유틸리티 사용 (`globals.css`, 콘텐츠 최대 1400px + 좌우 여백 16px)
- 폰트: Pretendard (`layout.tsx`에서 `next/font/local`로 `--font-pretendard` 생성 → `@theme inline`의 `--font-sans`에 연결)
- 색상은 `@theme` 토큰으로 관리 (`primary`, `accent`)
- 버튼 등 클릭 가능한 요소에는 `cursor-pointer` 지정 (Tailwind v4는 버튼 기본 커서가 `default`)
- 데스크톱 시안 기준, 모바일에서도 레이아웃이 깨지지 않게
- 사용자 표시 텍스트는 한국어

## Working Rules

- `any` 금지, nullable 필드 명시적 처리
- 요청 범위만 수정. 요청하지 않은 기능 추가나 리팩터링 금지
