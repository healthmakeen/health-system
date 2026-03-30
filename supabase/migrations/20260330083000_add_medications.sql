create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  name text not null,
  description text,
  tablets_per_day integer not null check (tablets_per_day > 0 and tablets_per_day <= 20),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists medications_patient_id_idx on public.medications (patient_id);
create index if not exists medications_name_idx on public.medications (name);

drop trigger if exists medications_set_updated_at on public.medications;
create trigger medications_set_updated_at
before update on public.medications
for each row
execute function public.set_updated_at();

alter table public.medications enable row level security;

drop policy if exists "Users can read own medications" on public.medications;
create policy "Users can read own medications"
on public.medications
for select
using (
  exists (
    select 1
    from public.patients
    where patients.id = medications.patient_id
      and patients.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own medications" on public.medications;
create policy "Users can insert own medications"
on public.medications
for insert
with check (
  exists (
    select 1
    from public.patients
    where patients.id = medications.patient_id
      and patients.user_id = auth.uid()
  )
);

drop policy if exists "Users can update own medications" on public.medications;
create policy "Users can update own medications"
on public.medications
for update
using (
  exists (
    select 1
    from public.patients
    where patients.id = medications.patient_id
      and patients.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.patients
    where patients.id = medications.patient_id
      and patients.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own medications" on public.medications;
create policy "Users can delete own medications"
on public.medications
for delete
using (
  exists (
    select 1
    from public.patients
    where patients.id = medications.patient_id
      and patients.user_id = auth.uid()
  )
);
