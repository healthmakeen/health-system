"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  defaultLocale,
  getLocalizedPath,
  getMessages,
  getWeekdayKey,
  isLocale,
  translate,
} from "@/lib/locales";
import { calculateOverallStatus } from "@/lib/health-status";
import { getPatientForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import {
  authSchema,
  emptyToNull,
  entrySchema,
  passwordSettingsSchema,
  patientSchema,
  profileSettingsSchema,
} from "@/lib/validators";
import type { Database } from "@/types/database";
import type { FormState, Locale } from "@/types/app";

const idleState: FormState = { status: "idle" };

function getLocaleFromValue(value: FormDataEntryValue | null): Locale {
  if (typeof value === "string" && isLocale(value)) {
    return value;
  }

  return defaultLocale;
}

function buildErrorState(locale: Locale, fieldErrors?: Record<string, string>) {
  const messages = getMessages(locale);

  return {
    status: "error" as const,
    message: translate(messages, "errors.generic"),
    fieldErrors,
  };
}

function getRedirectPath(locale: Locale, patientExists: boolean) {
  return patientExists
    ? getLocalizedPath(locale, "/dashboard")
    : getLocalizedPath(locale, "/setup");
}

export async function authAction(
  previousState: FormState = idleState,
  formData: FormData,
): Promise<FormState> {
  void previousState;
  const locale = getLocaleFromValue(formData.get("locale"));
  const messages = getMessages(locale);

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    locale,
    mode: formData.get("mode"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");

      if (field === "email") {
        fieldErrors.email = translate(messages, "errors.invalidEmail");
      } else if (field === "password") {
        fieldErrors.password = translate(messages, "errors.passwordLength");
      }
    }

    return buildErrorState(locale, fieldErrors);
  }

  const supabase = await createClient();
  const { email, mode, password } = parsed.data;

  if (mode === "login") {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return {
        fieldErrors: { email: translate(messages, "errors.invalidCredentials") },
        message: translate(messages, "errors.invalidCredentials"),
        status: "error",
      };
    }

    const patient = await getPatientForUser(data.user.id);
    redirect(getRedirectPath(locale, Boolean(patient)));
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        locale,
      },
    },
  });

  if (error) {
    return {
      message: error.message,
      status: "error",
    };
  }

  if (!data.session || !data.user) {
    return {
      message: translate(messages, "labels.accountCreated"),
      status: "success",
    };
  }

  redirect(getLocalizedPath(locale, "/setup"));
}

export async function signOutAction(formData: FormData) {
  const locale = getLocaleFromValue(formData.get("locale"));
  const supabase = await createClient();

  await supabase.auth.signOut();
  redirect(getLocalizedPath(locale, "/login"));
}

export async function createPatientAction(
  previousState: FormState = idleState,
  formData: FormData,
): Promise<FormState> {
  void previousState;
  const locale = getLocaleFromValue(formData.get("locale"));
  const messages = getMessages(locale);
  const parsed = patientSchema.safeParse({
    birth_date: formData.get("birth_date"),
    full_name: formData.get("full_name"),
    gender: formData.get("gender") || undefined,
    locale,
  });

  if (!parsed.success) {
    return buildErrorState(locale, {
      full_name: translate(messages, "errors.required"),
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(getLocalizedPath(locale, "/login"));
  }

  const birthDate = emptyToNull(parsed.data.birth_date);
  const patientPayload: Database["public"]["Tables"]["patients"]["Insert"] = {
    birth_date: birthDate,
    full_name: parsed.data.full_name,
    gender: parsed.data.gender ?? null,
    user_id: user.id,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patientsTable = supabase.from("patients") as any;
  const { error } = await patientsTable.insert(patientPayload);

  if (error) {
    return {
      message: error.message,
      status: "error",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profilesTable = supabase.from("profiles") as any;
  await profilesTable.update({ locale }).eq("id", user.id);

  revalidatePath(getLocalizedPath(locale, "/dashboard"));
  redirect(getLocalizedPath(locale, "/dashboard"));
}

export async function updateProfileAction(
  previousState: FormState = idleState,
  formData: FormData,
): Promise<FormState> {
  void previousState;
  const locale = getLocaleFromValue(formData.get("locale"));
  const messages = getMessages(locale);

  const parsed = profileSettingsSchema.safeParse({
    full_name: formData.get("full_name"),
    locale,
    profile_locale: formData.get("profile_locale"),
  });

  if (!parsed.success) {
    return buildErrorState(locale, {
      full_name: translate(messages, "errors.required"),
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(getLocalizedPath(locale, "/login"));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profilesTable = supabase.from("profiles") as any;
  const { error } = await profilesTable
    .update({
      full_name: parsed.data.full_name,
      locale: parsed.data.profile_locale,
    })
    .eq("id", user.id);

  if (error) {
    return {
      message: error.message,
      status: "error",
    };
  }

  revalidatePath(getLocalizedPath(locale, "/dashboard"));
  revalidatePath(getLocalizedPath(locale, "/settings"));

  return {
    status: "success",
  };
}

export async function updatePasswordAction(
  previousState: FormState = idleState,
  formData: FormData,
): Promise<FormState> {
  void previousState;
  const locale = getLocaleFromValue(formData.get("locale"));
  const messages = getMessages(locale);

  const parsed = passwordSettingsSchema.safeParse({
    confirm_password: formData.get("confirm_password"),
    locale,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "password");
      fieldErrors[field] =
        issue.message === "passwordMismatch"
          ? translate(messages, "settings.passwordMismatch")
          : translate(messages, "errors.passwordLength");
    }

    return buildErrorState(locale, fieldErrors);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      message: error.message,
      status: "error",
    };
  }

  return {
    status: "success",
  };
}

export async function saveEntryAction(
  entryId: string | null,
  previousState: FormState = idleState,
  formData: FormData,
): Promise<FormState> {
  void previousState;
  const locale = getLocaleFromValue(formData.get("locale"));
  const messages = getMessages(locale);
  const parsed = entrySchema.safeParse({
    abdomen_status: formData.get("abdomen_status"),
    breathing_status: formData.get("breathing_status"),
    diastolic: formData.get("diastolic"),
    entry_date: formData.get("entry_date"),
    leg_swelling: formData.get("leg_swelling"),
    locale,
    notes: formData.get("notes"),
    pulse: formData.get("pulse"),
    systolic: formData.get("systolic"),
    weight: formData.get("weight"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] =
        issue.message === "bloodPressureRelation"
          ? translate(messages, "validations.bloodPressureRelation")
          : translate(messages, "validations.numberRange");
    }

    if (!fieldErrors.entry_date) {
      fieldErrors.entry_date = translate(messages, "validations.dateRequired");
    }

    return buildErrorState(locale, fieldErrors);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(getLocalizedPath(locale, "/login"));
  }

  const patient = await getPatientForUser(user.id);

  if (!patient) {
    redirect(getLocalizedPath(locale, "/setup"));
  }

  const overallStatus = calculateOverallStatus({
    abdomenStatus: parsed.data.abdomen_status,
    breathingStatus: parsed.data.breathing_status,
    legSwelling: parsed.data.leg_swelling,
    pulse: parsed.data.pulse,
    systolic: parsed.data.systolic,
  });

  const payload: Database["public"]["Tables"]["daily_entries"]["Update"] = {
    abdomen_status: parsed.data.abdomen_status,
    breathing_status: parsed.data.breathing_status,
    day_name: getWeekdayKey(parsed.data.entry_date),
    diastolic: parsed.data.diastolic,
    entry_date: parsed.data.entry_date,
    leg_swelling: parsed.data.leg_swelling,
    notes: emptyToNull(parsed.data.notes),
    overall_status: overallStatus,
    pulse: parsed.data.pulse,
    systolic: parsed.data.systolic,
    weight: parsed.data.weight,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entriesTable = supabase.from("daily_entries") as any;
  const error = entryId
    ? (await entriesTable.update(payload).eq("id", entryId).eq("patient_id", patient.id))
        .error
    : (
        await entriesTable.insert({
          ...payload,
          patient_id: patient.id,
        })
      ).error;

  if (error) {
    return {
      message: error.message,
      status: "error",
    };
  }

  revalidatePath(getLocalizedPath(locale, "/dashboard"));
  redirect(getLocalizedPath(locale, "/dashboard"));
}

export async function deleteEntryAction(formData: FormData) {
  const locale = getLocaleFromValue(formData.get("locale"));
  const entryId = formData.get("entry_id");

  if (typeof entryId !== "string") {
    redirect(getLocalizedPath(locale, "/dashboard"));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(getLocalizedPath(locale, "/login"));
  }

  const patient = await getPatientForUser(user.id);

  if (!patient) {
    redirect(getLocalizedPath(locale, "/setup"));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entriesTable = supabase.from("daily_entries") as any;
  await entriesTable.delete().eq("id", entryId).eq("patient_id", patient.id);

  revalidatePath(getLocalizedPath(locale, "/dashboard"));
  redirect(getLocalizedPath(locale, "/dashboard"));
}
