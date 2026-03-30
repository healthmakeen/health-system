alter table public.patients
add column if not exists doctor_name text,
add column if not exists hospital_name text;
