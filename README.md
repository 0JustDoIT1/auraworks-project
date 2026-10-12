# HIDDEN KICE 스토어

히든카이스 교재를 조회하고 장바구니에 담을 수 있는 스토어 메인 페이지입니다.
화면에 보이는 기능을 중심으로, 각 기능이 실제 서비스처럼 동작하도록 예외 상황까지 다루는 데 집중했습니다.

- **배포:** https://auraworks-project.vercel.app/
- **저장소:** https://github.com/0JustDoIT1/auraworks-project

## 기술 스택

| 구분 | 사용 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, React Compiler), React 19 |
| 언어 | TypeScript (strict) |
| 스타일 | Tailwind CSS v4, Pretendard (`next/font/local`) |
| 데이터 | Supabase (publishable key + RLS로 SELECT만 허용) |
| UI 라이브러리 | lucide-react(아이콘), embla-carousel(캐러셀), sonner(토스트) |
| 배포 | GitHub + Vercel |

라이브러리는 직접 만들면 품질을 보장하기 어려운 영역(캐러셀 터치·드래그, 토스트)에만 쓰고, 장바구니 상태 관리나 모달처럼 브라우저·React 기본 기능으로 충분한 부분은 직접 구현했습니다.

## 기능별 구현

### 1. 교재 목록: Supabase + CSR 조회

`api/books.ts` → `hooks/useBooks.ts` → 컴포넌트 순서로만 데이터가 흐르도록 나눴습니다. 컴포넌트는 Supabase를 모르고, hook이 돌려주는 `books / totalCount / isLoading / error / refetch`만 씁니다.

- **서버에서 페이지·필터 처리:** 전체를 받아서 자르지 않고, Supabase 쿼리에서 `range()`로 12개씩, `count: "exact"`로 전체 개수를 함께 받습니다. 유형 필터는 `eq("type")`, 제목 검색은 `ilike("title")`로 처리합니다.
- **검색어 특수문자 처리:** `%`, `_`, `\`를 그대로 넣으면 와일드카드로 동작하기 때문에 이스케이프해서 문자 그대로 검색되게 했습니다.
- **늦게 도착한 응답 무시:** 검색은 입력할 때마다 바로 요청합니다. 이때 이전 요청의 응답이 늦게 도착해 최신 결과를 덮어쓰지 않도록, 요청 조건을 키(`keyword|type|page|…`)로 만들어 현재 키와 같은 응답만 반영합니다. `isLoading`도 별도 state 없이 "현재 키의 응답이 아직 없음"으로 계산합니다.
- **DB 타입과 화면 타입 분리:** DB 컬럼(snake_case, `BookRow`)을 화면용 타입(camelCase, `Book`)으로 변환하는 함수를 api 계층에 둬서, 컬럼이 바뀌어도 컴포넌트는 영향을 받지 않습니다.
- **모든 상태를 화면에 표시:**
  - 첫 로딩: "불러오는 중…"
  - 에러: 안내 문구 + "다시 시도" 버튼(`refetch`)
  - 빈 결과: 검색·필터 중이면 "조건에 맞는 교재가 없습니다."
  - 재조회 중: 이전 목록을 흐리게 유지하고, 결과 영역에 최소 높이를 둬서 레이아웃이 흔들리지 않게 했습니다.

### 2. 검색 · 필터 · 페이지네이션

- 검색어나 필터가 바뀌면 1페이지로 돌아갑니다. 같은 검색어가 다시 들어오면 페이지를 유지합니다.
- 페이지네이션은 현재 페이지를 가운데 두고 최대 5개 번호를 보여주며, 첫/마지막 페이지에서는 이전/다음 버튼을 비활성화합니다.
- **페이지 이동 후 목록 맨 위로 스크롤:** 클릭 즉시 스크롤하면 스크롤 도중 새 데이터가 그려지면서 부드러운 스크롤이 끊기는 문제가 있었습니다. 그래서 새 페이지 데이터가 렌더된 뒤(`isLoading`이 끝난 시점)에 스크롤하도록 바꿨습니다.

### 3. 가격 · 할인

카드, 상세 모달, 장바구니가 모두 `utils/pricing.ts`의 `getBookPrice` 하나로 할인가를 계산합니다. 화면마다 계산식이 달라 금액이 어긋나는 일을 막기 위해서입니다. 할인율이 `null`이거나 0 이하, 100 이상이면 할인 없음으로 처리합니다.

### 4. 상품 상세 모달

공통 `Dialog` 컴포넌트를 네이티브 `<dialog>`와 `showModal()`로 만들었습니다. 포커스 가두기, Esc 닫기, 배경 처리를 브라우저가 맡아서 직접 구현할 코드가 줄고 접근성도 기본으로 확보됩니다. 바깥 클릭으로도 닫히며, 같은 컴포넌트를 `position="right"`로 써서 장바구니 드로어에도 재사용했습니다.

### 5. 장바구니

로그인이 없으므로 localStorage에 저장합니다. 외부 상태 라이브러리 없이 `useSyncExternalStore`로 구현했습니다.

- **어디서든 같은 상태:** 스토어(`store/cartStore.ts`)는 하나이고, 헤더 배지·드로어·담기 버튼이 모두 `useCart`로 같은 상태를 구독합니다.
- **SSR 안전:** 서버 렌더링과 hydration 중에는 빈 장바구니를 쓰고, 이후 브라우저 저장값으로 바꿔 hydration 불일치를 피했습니다.
- **다른 탭과 동기화:** `storage` 이벤트로 다른 탭에서 바뀐 장바구니를 반영합니다.
- **방어 처리:** 저장된 데이터는 형식을 검사해서 손상된 항목은 버립니다. 시크릿 모드나 용량 초과로 저장에 실패해도 화면 상태는 유지합니다.
- **수량 규칙:** 같은 상품을 다시 담으면 수량이 늘어나고, 수량은 1~99로 제한합니다.
- **담기 결과 안내:** 스토어의 `add`가 결과(`added` / `increased` / `max`)를 돌려줘서 "담았습니다 / 수량을 늘렸습니다 / 최대 수량입니다" 토스트를 구분해 보여줍니다.
- **금액 요약:** 상품 금액, 할인 금액, 결제 예정 금액을 수량까지 반영해 계산합니다.

### 6. 히어로 배너

- embla-carousel로 무한 반복, 5초 자동 재생, 마우스를 올리면 일시정지, 스와이프 후에도 자동 재생 유지를 설정했습니다.
- **이미지맵 링크:** 배너는 문구까지 포함된 이미지 한 장이라, 이미지 속 "히든카이스 시리즈 보기" 버튼 위치에만 투명 링크를 얹었습니다. 위치를 이미지 대비 %로 지정해서 화면 크기가 바뀌어도 버튼을 따라갑니다. 키보드로 이동하면 해당 위치에 포커스 테두리가 보입니다.
- 화면에 보이지 않는 슬라이드는 `inert`로 처리해 키보드 포커스가 들어가지 않게 했습니다.

### 7. 레이아웃 · 스타일

- 공통 컨테이너를 `container-page` 유틸리티 하나로 정의했습니다. 콘텐츠는 최대 1400px이고, 좁은 화면에서는 좌우 16px 여백을 둡니다. Header, 배너, 목록, Footer가 같은 폭을 씁니다.
- Pretendard는 가변 폰트 파일 하나를 `next/font/local`로 불러와 빌드에 포함시키고, Tailwind 테마의 `--font-sans`에 연결했습니다.
- 색상은 `@theme` 토큰(`primary`, `accent`)으로만 관리합니다.

## 폴더 구조

```
src/
├─ app/
│  ├─ _components/      # 페이지 전용 UI, feature 간 조합 (HeroBanner, StoreBookList)
│  ├─ layout.tsx        # 폰트, Header·Footer, Toaster
│  └─ page.tsx
├─ components/
│  ├─ layout/           # Header, HeaderNav, Footer
│  └─ ui/               # Dialog, Pagination, CountBadge
├─ features/
│  ├─ books/
│  │  ├─ api/           # Supabase 조회
│  │  ├─ components/    # BookList, BookGrid, BookCard, BookToolbar, BookDetailModal
│  │  ├─ hooks/         # useBooks
│  │  ├─ types/
│  │  └─ utils/         # 가격·할인 계산
│  └─ cart/
│     ├─ components/    # CartButton, CartDrawer
│     ├─ hooks/         # useCart
│     ├─ store/         # localStorage 기반 장바구니 스토어
│     └─ types/
└─ lib/
   ├─ supabase/         # Supabase 클라이언트 (한 곳에서만 생성)
   └─ utils/            # 공통 포맷 함수
```

### 구조를 이렇게 잡은 이유

- **도메인(feature) 단위로 묶기:** 교재(`books`)와 장바구니(`cart`)처럼 기능별로 폴더를 나눠, 기능을 추가하거나 지울 때 한 폴더 안에서 끝나게 했습니다. 새 기능(예: 주문, 챌린지)도 같은 모양의 폴더를 하나 추가하면 됩니다.
- **역할별 하위 폴더:** feature 안의 파일은 루트에 두지 않고 `api / components / hooks / store / types / utils`로 나눠, 파일 위치만 보고도 역할을 알 수 있게 했습니다.
- **의존 방향을 한쪽으로:** `app → features → components/ui, lib` 순서로만 import하고, feature끼리는 서로 import하지 않습니다.
  - 교재 목록과 장바구니는 `app/_components/StoreBookList.tsx`에서 연결합니다. 그래서 `books`는 장바구니가 있는지 모르고 `onAddToCart` prop만 받습니다.
  - 공통 `Header`도 장바구니를 모르고, `layout.tsx`가 `CartButton`을 slot(`cartSlot`)으로 넣어 줍니다.
- **바꿀 곳을 한 곳으로:** Supabase 클라이언트는 `lib/supabase/client.ts`에서만 만들고, 장바구니를 서버 저장으로 바꿀 때는 `cartStore`의 저장·불러오기만 바꾸면 되도록 했습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

프로젝트 루트에 `.env` 파일을 만들고 Supabase 값을 넣어야 합니다.

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

### Supabase `books` 테이블

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | number | 기본 키 |
| `title` | string | 교재명 |
| `type` | `"single"` \| `"pass"` | 단품 / 패스 |
| `price` | number | 정가 |
| `sale_percent` | number \| null | 할인율(%) |
| `thumbnail_url` | string \| null | 썸네일 이미지 URL |

RLS를 켜고 SELECT만 허용하는 정책을 걸어, 브라우저에 노출되는 publishable key로는 조회만 가능합니다.

## 구현 범위 밖 (임시 처리)

- 주문하기 버튼: 비활성 상태("준비 중")
- 헤더의 스토어 외 메뉴, 알림·마이페이지 아이콘: 동작 없음
- 히어로 배너 링크: `#`, 2~5번 슬라이드는 1번 이미지를 임시로 사용
