import { z } from "zod";

import { isLocale } from "@/lib/locales";

const localeSchema = z.string().refine(isLocale);

export const authSchema = z.object({
  email: z.string().trim().email(),
  locale: localeSchema,
  mode: z.enum(["login", "signup"]),
  password: z.string().min(6),
});

export const profileSettingsSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  locale: localeSchema,
  profile_locale: localeSchema,
});

export const passwordSettingsSchema = z
  .object({
    confirm_password: z.string().min(6),
    locale: localeSchema,
    password: z.string().min(6),
  })
  .refine((values) => values.password === values.confirm_password, {
    message: "passwordMismatch",
    path: ["confirm_password"],
  });

export const patientSchema = z.object({
  birth_date: z.string().trim().optional(),
  full_name: z.string().trim().min(2).max(120),
  gender: z.enum(["female", "male"]).optional(),
  locale: localeSchema,
});

export const patientSettingsSchema = z.object({
  birth_date: z.string().trim().optional(),
  full_name: z.string().trim().min(2).max(120),
  gender: z.enum(["female", "male"]).or(z.literal("")).optional(),
  locale: localeSchema,
});

export const medicationSchema = z.object({
  description: z.string().trim().max(240).optional(),
  locale: localeSchema,
  name: z.string().trim().min(2).max(120),
  tablets_per_day: z.coerce.number().int().min(1).max(20),
});

export const entrySchema = z
  .object({
    abdomen_status: z.enum(["distended", "normal", "tight"]),
    breathing_status: z.enum(["difficult", "normal"]),
    diastolic: z.coerce.number().int().min(20).max(200),
    entry_date: z.string().min(1),
    leg_swelling: z.enum(["mild", "none", "yes"]),
    locale: localeSchema,
    notes: z.string().trim().max(500).optional(),
    pulse: z.coerce.number().int().min(20).max(220),
    systolic: z.coerce.number().int().min(40).max(280),
    weight: z.coerce.number().min(1).max(999.9),
  })
  .refine((values) => values.diastolic < values.systolic, {
    message: "bloodPressureRelation",
    path: ["diastolic"],
  });

export function emptyToNull(value?: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
