-- Supabase schema for web app (AsyncStorage yerine)
create table if not exists profiles (
  id uuid primary key,
  nickname text,
  app_language text,
  target_reading_days_per_week int,
  khatm_duration_days int,
  show_in_global_ranking boolean,
  country_code text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists reading_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date not null,
  weekday text not null,
  mode text not null, -- 'today' | 'makeup'
  completed boolean default false,
  points_earned int default 0,
  completed_at timestamptz,
  section_ids text[]
);

create table if not exists reading_settings (
  user_id uuid primary key references profiles(id) on delete cascade,
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

create table if not exists app_settings (
  user_id uuid primary key references profiles(id) on delete cascade,
  language text,
  notifications_enabled boolean,
  notification_time text,
  remind_missed_days boolean,
  theme_preference text,
  missed_reminder_day int,
  missed_reminder_hour int,
  missed_reminder_minute int
);

create table if not exists bookmarks (
  user_id uuid primary key references profiles(id) on delete cascade,
  date date,
  day_id text,
  offset int,
  updated_at timestamptz default now()
);

-- Optionally add updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
before update on profiles
for each row execute procedure set_updated_at();
