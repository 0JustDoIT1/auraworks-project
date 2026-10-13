<div align="center">

# HIDDEN KICE STORE

**히든카이스 교재 조회 · 장바구니 스토어 메인 페이지**

[배포 사이트](https://auraworks-project.vercel.app/) · [GitHub](https://github.com/0JustDoIT1/auraworks-project)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

<br />

## 👋 소개

- 화면에 보이는 기능 중심으로 구현
- "실제 서비스라면 어디서 깨질까?"를 기준으로 예외 상황까지 처리하는 데 집중

<br />

## 🛠 기술 스택

| 구분      | 사용                                              |
| --------- | ------------------------------------------------- |
| Framework | Next.js 16 (App Router, React Compiler), React 19 |
| Language  | TypeScript (strict)                               |
| Style     | Tailwind CSS v4, Pretendard                       |
| Data      | Supabase (publishable key + RLS로 SELECT만 허용)  |
| UI        | lucide-react · embla-carousel · sonner            |
| Deploy    | GitHub + Vercel                                   |

> **라이브러리 선택 기준**
>
> - 직접 만들면 품질 보장이 어려운 영역(캐러셀 터치·드래그, 토스트)에만 사용
> - 장바구니 상태 관리, 모달 등 브라우저·React 기본 기능으로 충분한 부분은 직접 구현

<br />

## ✨ 기능별 구현

### 1. 교재 목록: Supabase + CSR

- 데이터 흐름을 `api/books.ts` → `hooks/useBooks.ts` → 컴포넌트 한 방향으로 고정
- 컴포넌트는 Supabase를 모르고, hook이 반환하는 `books / totalCount / isLoading / error / refetch`만 사용
- **페이지·필터는 서버에서 처리**
  - 전체 조회 후 자르지 않고 `range()`로 12개씩 조회
  - 전체 개수는 `count: "exact"`로 함께 조회
  - 필터는 `eq("type")`, 검색은 `ilike("title")`
- **검색어 특수문자 이스케이프:** `%`, `_`, `\`가 와일드카드로 동작하지 않고 문자 그대로 검색되도록 처리
- **DB 타입과 화면 타입 분리**
  - DB 컬럼(snake_case `BookRow`)을 api 계층에서 화면용 타입(camelCase `Book`)으로 변환
  - 컬럼이 바뀌어도 컴포넌트는 영향 없음
- **모든 상태를 화면에 표시**

  | 상태      | 화면                                               |
  | --------- | -------------------------------------------------- |
  | 첫 로딩   | "불러오는 중…"                                     |
  | 에러      | 안내 문구 + `다시 시도` 버튼                       |
  | 빈 결과   | 검색·필터 중이면 "조건에 맞는 교재가 없습니다."    |
  | 재조회 중 | 이전 목록을 흐리게 유지, 최소 높이로 레이아웃 고정 |

> **고민한 점: 늦게 도착한 응답**
>
> - 문제: 입력할 때마다 바로 검색하므로, 이전 요청 응답이 늦게 도착해 최신 결과를 덮어쓸 수 있음
> - 해결: 요청 조건을 키(`keyword|type|page|…`)로 만들고, 현재 키와 일치하는 응답만 반영
> - `isLoading`도 별도 state 없이 "현재 키의 응답이 아직 없음"으로 계산

### 2. 검색 · 필터 · 페이지네이션

- 검색어·필터 변경 시 1페이지로 이동, 같은 검색어면 페이지 유지
- 현재 페이지를 가운데 두고 최대 5개 번호 표시
- 첫·마지막 페이지에서 이전·다음 버튼 비활성화

> **트러블슈팅: 페이지 이동 후 맨 위로 스크롤되다 멈추는 문제**
>
> - 증상: 응답 속도에 따라 스크롤이 될 때도 있고 안 될 때도 있음
> - 원인: 클릭 즉시 부드러운 스크롤을 시작했는데, 스크롤 도중 새 데이터가 그려지면서 스크롤이 끊김
> - 해결: 새 페이지가 렌더된 뒤(`isLoading` 종료 시점)에 스크롤하도록 변경

### 3. 가격 · 할인

- 카드, 상세 모달, 장바구니 모두 `utils/pricing.ts`의 `getBookPrice` 하나로 할인가 계산
- 화면마다 계산식이 달라 금액이 어긋나는 문제 방지
- 할인율이 `null`, 0 이하, 100 이상이면 할인 없음으로 처리

### 4. 상품 상세 모달

- 공통 `Dialog`를 네이티브 `<dialog>` + `showModal()`로 구현
- 포커스 가두기, Esc 닫기, 배경 처리를 브라우저에 위임 → 코드는 줄고 접근성은 기본 확보
- 바깥 클릭 시 닫기 지원
- 같은 컴포넌트를 `position="right"`로 장바구니 드로어에도 재사용

### 5. 장바구니

- 로그인이 없어 localStorage에 저장
- 외부 상태 라이브러리 없이 `useSyncExternalStore`로 구현
- **단일 상태:** 스토어(`store/cartStore.ts`) 하나를 헤더 배지, 드로어, 담기 버튼이 `useCart`로 함께 구독
- **SSR 안전:** 서버 렌더링·hydration 중에는 빈 장바구니를 쓰고, 이후 브라우저 저장값으로 교체 → hydration 불일치 방지
- **다른 탭 동기화:** `storage` 이벤트로 다른 탭의 변경 사항 반영
- **방어 처리**
  - 저장 데이터 형식을 검사해 손상된 항목 제거
  - 시크릿 모드·용량 초과로 저장에 실패해도 화면 상태 유지
- **수량 규칙:** 같은 상품을 다시 담으면 수량 증가, 1~99개로 제한
- **담기 결과별 안내:** 스토어의 `add`가 결과를 반환하고, 결과에 맞는 토스트 표시

  | 결과        | 토스트              |
  | ----------- | ------------------- |
  | `added`     | "담았습니다"        |
  | `increased` | "수량을 늘렸습니다" |
  | `max`       | "최대 수량입니다"   |

- **금액 요약:** 상품 금액, 할인 금액, 결제 예정 금액을 수량까지 반영해 계산

### 6. 히어로 배너

- embla-carousel 사용: 무한 반복, 5초 자동 재생, 마우스를 올리면 일시정지, 스와이프 후에도 자동 재생 유지
- 양 끝 이전·다음 버튼으로 수동 넘김
- **이미지맵 링크**
  - 배너가 문구까지 포함된 이미지 한 장이라, 이미지 속 "시리즈 보기" 버튼 위치에만 투명 링크 배치
  - 위치를 이미지 대비 %로 지정 → 화면 크기가 바뀌어도 버튼 위치를 따라감
  - 키보드 이동 시 해당 위치에 포커스 테두리 표시
- 보이지 않는 슬라이드는 `inert` 처리 → 키보드 포커스 진입 방지

### 7. 공지 알림

- 로그인이 없어 사용자별 알림 대신 **모든 사용자 공통 공지**를 Supabase `notices` 테이블에서 CSR로 조회
- 교재 목록과 같은 흐름: `api/notices.ts` → `hooks/useNotices.ts` → 컴포넌트
- 목록에는 최신 공지 최대 10개의 제목·날짜만 표시, 제목을 클릭하면 내용이 펼쳐지는 아코디언 (한 번에 하나)
- **개별 읽음 처리**
  - 읽은 공지 id 목록을 localStorage에 저장하고, 목록에 없는 공지 수를 헤더 배지로 표시
  - 공지를 펼치면 그 공지만 읽음 처리, `모두 읽음` 버튼으로 일괄 처리
  - 안 읽은 공지는 `NEW` 배지 + 굵은 제목으로 구분
- **SSR 안전:** 서버에서는 localStorage를 읽지 않고(`getServerSnapshot` → 전부 읽음 취급) 공지도 CSR로 조회 → hydration 불일치 없음
- **다른 탭 동기화:** `storage` 이벤트로 다른 탭에서 읽음 처리한 내용 반영
- **방어 처리:** 저장값이 배열이 아니거나 숫자가 아닌 항목은 무시, 저장 실패(시크릿 모드 등)해도 화면 상태 유지
- 로딩·에러(다시 시도)·빈 상태 처리, 장바구니와 같은 `Dialog`(`position="right"`)·`CountBadge` 재사용

> **확장성 확인:** 기존 `books`, `cart` 코드는 수정하지 않고 `features/notices` 폴더 추가 + `Header`에 `noticeSlot` 하나를 열어 연결

### 8. 레이아웃 · 스타일

- **공통 컨테이너:** `container-page` 유틸리티 하나로 정의, 콘텐츠 최대 1400px, 좁은 화면에서는 좌우 여백 16px
- **Pretendard 폰트:** 가변 폰트 파일 하나를 `next/font/local`로 빌드에 포함, Tailwind `--font-sans`에 연결
- **색상:** `@theme` 토큰(`primary`, `accent`)으로만 관리

<br />

## 🗂 폴더 구조

```
src/
├─ app/
│  ├─ _components/      # 페이지 전용 UI, feature 간 조합 (HeroBanner, StoreBookList)
│  ├─ layout.tsx        # 폰트, Header·Footer, Toaster
│  └─ page.tsx
├─ components/
│  ├─ layout/           # Header, HeaderNav, MyPageButton, Footer
│  └─ ui/               # Dialog, Pagination, CountBadge
├─ features/
│  ├─ books/
│  │  ├─ api/           # Supabase 조회
│  │  ├─ components/    # BookList, BookGrid, BookCard, BookToolbar, BookDetailModal
│  │  ├─ hooks/         # useBooks
│  │  ├─ types/
│  │  └─ utils/         # 가격·할인 계산
│  ├─ cart/
│  │  ├─ components/    # CartButton, CartDrawer
│  │  ├─ hooks/         # useCart
│  │  ├─ store/         # localStorage 기반 장바구니 스토어
│  │  └─ types/
│  └─ notices/
│     ├─ api/           # Supabase 조회
│     ├─ components/    # NoticeButton, NoticeDrawer
│     ├─ hooks/         # useNotices
│     ├─ store/         # 읽은 공지 id 목록 (localStorage)
│     └─ types/
└─ lib/
   ├─ supabase/         # Supabase 클라이언트 (한 곳에서만 생성), bookSeed.sql, noticeSeed.sql
   └─ utils/            # 공통 포맷 함수
```

### 구조 설계 기준

**1. 기능(feature) 단위로 묶기**

- `books`, `cart`, `notices`처럼 기능별로 폴더 분리
- 기능 추가·삭제가 한 폴더 안에서 끝남
- 새 기능(주문, 챌린지 등)도 같은 형태의 폴더 하나만 추가하면 됨

**2. 역할별 하위 폴더**

- feature 루트에 파일을 쌓지 않고 `api / components / hooks / store / types / utils`로 분리
- 파일 위치만으로 역할 파악 가능

**3. 단방향 의존**

```
app  →  features  →  components/ui, lib
```

- feature끼리는 서로 import하지 않음
- 교재 목록과 장바구니는 `app/_components/StoreBookList.tsx`에서 연결
  - `books`는 장바구니 존재를 모르고 `onAddToCart` prop만 받음
- 공통 `Header`도 장바구니·공지를 모름
  - `layout.tsx`가 `CartButton`, `NoticeButton`을 slot(`cartSlot`, `noticeSlot`)으로 주입

**4. 변경 지점 한 곳으로**

- Supabase 클라이언트는 `lib/supabase/client.ts`에서만 생성
- 장바구니를 서버 저장으로 바꿀 때는 `cartStore`의 저장·불러오기만 교체하면 됨

<br />

## 🚀 로컬 실행

```bash
npm install
npm run dev
```

프로젝트 루트에 `.env` 파일 생성 후 Supabase 값 입력

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

<details>
<summary><b>Supabase 테이블 구조</b></summary>

<br />

**`books`**

| 컬럼            | 타입                   | 설명              |
| --------------- | ---------------------- | ----------------- |
| `id`            | number                 | 기본 키           |
| `title`         | string                 | 교재명            |
| `type`          | `"single"` \| `"pass"` | 단품 / 패스       |
| `price`         | number                 | 정가              |
| `sale_percent`  | number \| null         | 할인율(%)         |
| `thumbnail_url` | string \| null         | 썸네일 이미지 URL |
| `created_at`    | string (timestamptz)   | 생성 시각         |

**`notices`**

| 컬럼         | 타입                 | 설명      |
| ------------ | -------------------- | --------- |
| `id`         | number               | 기본 키   |
| `title`      | string               | 공지 제목 |
| `content`    | string               | 공지 내용 |
| `created_at` | string (timestamptz) | 작성 시각 |

- 두 테이블 모두 RLS 활성화 + SELECT만 허용하는 정책 적용
- 브라우저에 노출되는 publishable key로는 조회만 가능

</details>

<details>
<summary><b>Supabase 초기 설정 SQL</b></summary>

<br />

Supabase 대시보드의 **SQL Editor**에서 아래 두 파일을 실행해 테이블, 권한, 더미 데이터를 구성

**[`bookSeed.sql`](src/lib/supabase/bookSeed.sql): `books` 테이블**

- **테이블:** DB 단에서도 값 검증
  - `type`은 `single` / `pass`만 허용
  - `price`는 0 이상
  - `sale_percent`는 1~99 사이 또는 `null`
- **RLS:** 활성화 후 `anon`, `authenticated`에 SELECT 정책만 추가 → INSERT·UPDATE·DELETE는 모두 차단
- **권한:** 새 테이블이 Data API에 자동 노출되지 않도록 설정해 두었기 때문에, 조회 권한(`grant select`)을 직접 부여
- **더미 데이터:** 30개 생성, 타입은 50% 확률로 랜덤
  - `pass`: 76,000원, 5% 할인, 세트 썸네일
  - `single`: 40,000원, 할인 없음, 단품 썸네일

**[`noticeSeed.sql`](src/lib/supabase/noticeSeed.sql): `notices` 테이블**

- `books`와 같은 방식(RLS + SELECT 정책 + `grant select`)으로 구성
- 더미 공지 4개, 오래된 것부터 넣어 최신 공지일수록 id가 큼 (조회 시 id 내림차순)

</details>

<br />

## 🚧 구현 범위 밖 (임시 처리)

- 주문하기: 비활성 상태 ("준비 중")
- 헤더의 스토어 외 메뉴: 동작 없음
- 마이페이지: 로그인 미구현, 클릭 시 "준비 중" 안내 토스트
