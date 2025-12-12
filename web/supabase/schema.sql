-- Supabase schema for Delailül Hayrat web
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key,
  nickname text,
  app_language text,
  target_reading_days_per_week int,
  khatm_duration_days int,
  show_in_global_ranking boolean default false,
  country_code text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.reading_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  date date,
  weekday text,
  mode text check (mode in ('today','makeup')),
  completed boolean default false,
  points_earned int default 0,
  completed_at timestamptz,
  section_ids text[]
);

-- Prevent duplicate logs per user+date
create unique index if not exists reading_logs_user_date_key on public.reading_logs(user_id, date);

create table if not exists public.reading_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  font_size int,
  line_height numeric,
  theme text,
  content_languages text[],
  show_arabic boolean,
  show_transliteration boolean,
  show_translation boolean,
  auto_scroll boolean,
  auto_scroll_speed int,
  screen_lock boolean,
  haptics_enabled boolean
);

create table if not exists public.app_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  language text,
  notifications_enabled boolean,
  notification_time text,
  remind_missed_days boolean,
  theme_preference text,
  missed_reminder_day int,
  missed_reminder_hour int,
  missed_reminder_minute int
);

create table if not exists public.bookmarks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  date date,
  day_id text,
  "offset" int,
  updated_at timestamptz default now()
);

-- Row Level Security (RLS)
-- Demo kullanıcı id'si: 00000000-0000-0000-0000-000000000000

alter table public.profiles enable row level security;
alter table public.reading_logs enable row level security;
alter table public.reading_settings enable row level security;
alter table public.app_settings enable row level security;
alter table public.bookmarks enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own_or_demo" on public.profiles;
create policy "profiles_select_own_or_demo"
  on public.profiles
  for select
  using (id = auth.uid() or id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "profiles_insert_own_or_demo" on public.profiles;
create policy "profiles_insert_own_or_demo"
  on public.profiles
  for insert
  with check (id = auth.uid() or id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "profiles_update_own_or_demo" on public.profiles;
create policy "profiles_update_own_or_demo"
  on public.profiles
  for update
  using (id = auth.uid() or id = '00000000-0000-0000-0000-000000000000')
  with check (id = auth.uid() or id = '00000000-0000-0000-0000-000000000000');

-- Reading logs policies
drop policy if exists "reading_logs_select_own_or_demo" on public.reading_logs;
create policy "reading_logs_select_own_or_demo"
  on public.reading_logs
  for select
  using (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "reading_logs_insert_own_or_demo" on public.reading_logs;
create policy "reading_logs_insert_own_or_demo"
  on public.reading_logs
  for insert
  with check (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "reading_logs_update_own_or_demo" on public.reading_logs;
create policy "reading_logs_update_own_or_demo"
  on public.reading_logs
  for update
  using (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000')
  with check (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

-- Reading settings policies
drop policy if exists "reading_settings_select_own_or_demo" on public.reading_settings;
create policy "reading_settings_select_own_or_demo"
  on public.reading_settings
  for select
  using (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "reading_settings_insert_own_or_demo" on public.reading_settings;
create policy "reading_settings_insert_own_or_demo"
  on public.reading_settings
  for insert
  with check (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "reading_settings_update_own_or_demo" on public.reading_settings;
create policy "reading_settings_update_own_or_demo"
  on public.reading_settings
  for update
  using (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000')
  with check (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

-- App settings policies
drop policy if exists "app_settings_select_own_or_demo" on public.app_settings;
create policy "app_settings_select_own_or_demo"
  on public.app_settings
  for select
  using (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "app_settings_insert_own_or_demo" on public.app_settings;
create policy "app_settings_insert_own_or_demo"
  on public.app_settings
  for insert
  with check (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "app_settings_update_own_or_demo" on public.app_settings;
create policy "app_settings_update_own_or_demo"
  on public.app_settings
  for update
  using (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000')
  with check (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

-- Bookmarks policies
drop policy if exists "bookmarks_select_own_or_demo" on public.bookmarks;
create policy "bookmarks_select_own_or_demo"
  on public.bookmarks
  for select
  using (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "bookmarks_insert_own_or_demo" on public.bookmarks;
create policy "bookmarks_insert_own_or_demo"
  on public.bookmarks
  for insert
  with check (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');

drop policy if exists "bookmarks_update_own_or_demo" on public.bookmarks;
create policy "bookmarks_update_own_or_demo"
  on public.bookmarks
  for update
  using (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000')
  with check (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');
