-- 1) 테이블
create table public.books (
  id            bigint generated always as identity primary key,
  title         text    not null,
  type          text    not null check (type in ('single', 'pass')),
  price         integer not null check (price >= 0),
  sale_percent  integer check (sale_percent > 0 and sale_percent < 100),
  thumbnail_url text,
  created_at    timestamptz not null default now()
);

-- 2) RLS: 켜기 + 조회만 허용
alter table public.books enable row level security;

create policy "Anyone can read books"
  on public.books
  for select
  to anon, authenticated
  using (true);

-- 3) 권한: 자동 노출을 꺼두었으므로 직접 부여
grant select on public.books to anon, authenticated;

-- 4) 더미 데이터 30개
insert into public.books (title, type, price, sale_percent, thumbnail_url)
select
  '2026 Hidden Kice 시즌7',
  t.type,
  case when t.type = 'pass' then 76000 else 40000 end,
  case when t.type = 'pass' then 5 else null end,
  case when t.type = 'pass'
    then '/images/hidden_set.png'
    else '/images/hidden_single.png'
  end
from (
  select case when random() < 0.5 then 'pass' else 'single' end as type
  from generate_series(1, 30)
) t;