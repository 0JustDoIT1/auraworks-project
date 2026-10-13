-- 테이블
create table public.notices (
  id         bigint generated always as identity primary key,
  title      text not null,
  content    text not null,
  created_at timestamptz not null default now()
);

-- RLS: 켜기 + 조회만 허용
alter table public.notices enable row level security;

create policy "Anyone can read notices"
  on public.notices
  for select
  to anon, authenticated
  using (true);

-- 권한: 자동 노출을 꺼두었으므로 직접 부여
grant select on public.notices to anon, authenticated;

-- 더미 공지 (오래된 것부터 넣어서 최신 공지일수록 id가 크게)
insert into public.notices (title, content, created_at) values
  ('배송 안내', '평일 오후 2시 이전 주문 건은 당일 출고됩니다.', now() - interval '20 days'),
  ('2026 Hidden Kice 시즌7 출시', '실전과 가장 닮은 모의고사, 시즌7이 출시되었습니다.', now() - interval '7 days'),
  ('패스 상품 5% 할인 이벤트', '패스 상품 구매 시 5% 할인 혜택을 드립니다.', now() - interval '2 days'),
  ('AI OMR WORK 오픈 예정', 'OMR 한 장으로 취약 단원을 분석하는 AI 채점 서비스가 곧 오픈됩니다.', now() - interval '1 hour');