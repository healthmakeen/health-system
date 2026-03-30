import { createClient } from "@/lib/supabase/server";
import type { DailyEntry, Patient, Profile } from "@/types/app";

function ignoreNotFoundError(error: { code?: string } | null) {
  return error?.code === "PGRST116";
}

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profilesTable = supabase.from("profiles") as any;
  const { data, error } = await profilesTable
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error && !ignoreNotFoundError(error)) {
    throw error;
  }

  return data;
}

export async function getPatientForUser(userId: string): Promise<Patient | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patientsTable = supabase.from("patients") as any;
  const { data, error } = await patientsTable
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && !ignoreNotFoundError(error)) {
    throw error;
  }

  return data;
}

export async function getEntriesForPatient(
  patientId: string,
): Promise<DailyEntry[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entriesTable = supabase.from("daily_entries") as any;
  const { data, error } = await entriesTable
    .select("*")
    .eq("patient_id", patientId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getEntryForUser(
  userId: string,
  entryId: string,
): Promise<DailyEntry | null> {
  const patient = await getPatientForUser(userId);

  if (!patient) {
    return null;
  }

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entriesTable = supabase.from("daily_entries") as any;
  const { data, error } = await entriesTable
    .select("*")
    .eq("patient_id", patient.id)
    .eq("id", entryId)
    .maybeSingle();

  if (error && !ignoreNotFoundError(error)) {
    throw error;
  }

  return data;
}
