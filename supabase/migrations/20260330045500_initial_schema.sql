create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, locale)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'locale', 'en')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    locale = excluded.locale;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'caregiver' check (role in ('caregiver')),
  locale text not null default 'en' check (locale in ('en', 'ar', 'tr')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text not null,
  birth_date date,
  gender text check (gender in ('male', 'female')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  entry_date date not null,
  day_name text not null check (
    day_name in (
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    )
  ),
  pulse integer not null check (pulse > 0),
  systolic integer not null check (systolic > 0),
  diastolic integer not null check (diastolic > 0 and diastolic < systolic),
  weight numeric(5,1) not null check (weight > 0),
  breathing_status text not null check (breathing_status in ('normal', 'difficult')),
  abdomen_status text not null check (abdomen_status in ('normal', 'distended', 'tight')),
  leg_swelling text not null check (leg_swelling in ('none', 'mild', 'yes')),
  notes text,
  overall_status text not null default 'stable' check (overall_status in ('stable', 'needs_attention')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (patient_id, entry_date)
);

create index if not exists patients_user_id_idx on public.patients (user_id);
create index if not exists daily_entries_patient_id_idx on public.daily_entries (patient_id);
create index if not exists daily_entries_entry_date_idx on public.daily_entries (entry_date desc);

drop trigger if exists patients_set_updated_at on public.patients;
create trigger patients_set_updated_at
before update on public.patients
for each row
execute function public.set_updated_at();

drop trigger if exists daily_entries_set_updated_at on public.daily_entries;
create trigger daily_entries_set_updated_at
before update on public.daily_entries
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.daily_entries enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
on public.profiles
for delete
using (auth.uid() = id);

drop policy if exists "Users can read own patient" on public.patients;
create policy "Users can read own patient"
on public.patients
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own patient" on public.patients;
create policy "Users can insert own patient"
on public.patients
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own patient" on public.patients;
create policy "Users can update own patient"
on public.patients
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own patient" on public.patients;
create policy "Users can delete own patient"
on public.patients
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own daily entries" on public.daily_entries;
create policy "Users can read own daily entries"
on public.daily_entries
for select
using (
  exists (
    select 1
    from public.patients
    where patients.id = daily_entries.patient_id
      and patients.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own daily entries" on public.daily_entries;
create policy "Users can insert own daily entries"
on public.daily_entries
for insert
with check (
  exists (
    select 1
    from public.patients
    where patients.id = daily_entries.patient_id
      and patients.user_id = auth.uid()
  )
);

drop policy if exists "Users can update own daily entries" on public.daily_entries;
create policy "Users can update own daily entries"
on public.daily_entries
for update
using (
  exists (
    select 1
    from public.patients
    where patients.id = daily_entries.patient_id
      and patients.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.patients
    where patients.id = daily_entries.patient_id
      and patients.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own daily entries" on public.daily_entries;
create policy "Users can delete own daily entries"
on public.daily_entries
for delete
using (
  exists (
    select 1
    from public.patients
    where patients.id = daily_entries.patient_id
      and patients.user_id = auth.uid()
  )
);
