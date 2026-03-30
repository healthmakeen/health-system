import type { Database } from "@/types/database";

export type Locale = "ar" | "en" | "tr";
export type Direction = "ltr" | "rtl";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Patient = Database["public"]["Tables"]["patients"]["Row"];
export type DailyEntry = Database["public"]["Tables"]["daily_entries"]["Row"];
export type Medication = Database["public"]["Tables"]["medications"]["Row"];

export type Gender = NonNullable<Patient["gender"]>;
export type BreathingStatus = DailyEntry["breathing_status"];
export type AbdomenStatus = DailyEntry["abdomen_status"];
export type LegSwellingStatus = DailyEntry["leg_swelling"];
export type OverallStatus = DailyEntry["overall_status"];

export type EntryFormValues = {
  abdomen_status: AbdomenStatus;
  breathing_status: BreathingStatus;
  diastolic: string;
  entry_date: string;
  leg_swelling: LegSwellingStatus;
  notes: string;
  pulse: string;
  systolic: string;
  weight: string;
};

export type FormState = {
  status: "error" | "idle" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export type SettingsFormValues = {
  full_name: string;
  locale: Locale;
};

export type PatientSettingsFormValues = {
  birth_date: string;
  doctor_name: string;
  full_name: string;
  gender: "" | Gender;
  hospital_name: string;
};

export type MedicationFormValues = {
  description: string;
  name: string;
  reminder_time: string;
  tablets_per_day: string;
};
