alter table public.medications
add column if not exists reminder_time time;
