-- 使用者狀態表：一個登入帳號對應一列，整包 state 存成 JSONB
create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 開啟 Row Level Security：沒有下面的規則，預設任何人什麼都讀不到、寫不到
alter table public.user_state enable row level security;

-- 使用者只能讀自己那一列
create policy "user can read own state"
  on public.user_state for select
  using (auth.uid() = user_id);

-- 使用者只能新增自己那一列
create policy "user can insert own state"
  on public.user_state for insert
  with check (auth.uid() = user_id);

-- 使用者只能更新自己那一列
create policy "user can update own state"
  on public.user_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 每次寫入自動更新 updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_state_set_updated_at
  before update on public.user_state
  for each row
  execute function public.set_updated_at();
