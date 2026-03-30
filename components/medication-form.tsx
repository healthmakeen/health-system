"use client";

import Link from "next/link";
import { useActionState } from "react";

import { useLocaleContext } from "@/components/locale-provider";
import { SubmitButton } from "@/components/submit-button";
import type { FormState, MedicationFormValues } from "@/types/app";

const initialState: FormState = { status: "idle" };

const defaultValues: MedicationFormValues = {
  description: "",
  name: "",
  reminder_time: "",
  tablets_per_day: "1",
};

type MedicationFormProps = {
  action: (
    previousState: FormState,
    formData: FormData,
  ) => Promise<FormState>;
  cancelHref?: string;
  initialValues?: MedicationFormValues;
  title: string;
};

export function MedicationForm({
  action,
  cancelHref,
  initialValues = defaultValues,
  title,
}: MedicationFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const { locale, t } = useLocaleContext();

  return (
    <form action={formAction} className="card-surface rounded-[28px] p-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
          {t("medications.formDescription")}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            {t("medications.name")}
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              required
              type="text"
              name="name"
              defaultValue={initialValues.name}
              className="w-full bg-transparent outline-none"
            />
          </div>
          {state.fieldErrors?.name ? (
            <p className="form-error mt-2 text-sm">{state.fieldErrors.name}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            {t("medications.description")}{" "}
            <span className="text-[var(--color-text-soft)]">
              ({t("form.optional")})
            </span>
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <textarea
              name="description"
              rows={3}
              defaultValue={initialValues.description}
              placeholder={t("medications.descriptionPlaceholder")}
              className="w-full resize-none bg-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            {t("medications.tabletsPerDay")}
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              required
              type="number"
              min="1"
              max="20"
              step="1"
              inputMode="numeric"
              name="tablets_per_day"
              defaultValue={initialValues.tablets_per_day}
              className="w-full bg-transparent outline-none"
            />
          </div>
          {state.fieldErrors?.tablets_per_day ? (
            <p className="form-error mt-2 text-sm">
              {state.fieldErrors.tablets_per_day}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            {t("medications.reminderTime")}{" "}
            <span className="text-[var(--color-text-soft)]">
              ({t("form.optional")})
            </span>
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              type="time"
              name="reminder_time"
              defaultValue={initialValues.reminder_time}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-soft)]">
            {t("medications.reminderHelp")}
          </p>
        </div>
      </div>

      {state.message ? (
        <p className="form-error mt-4 text-sm">{state.message}</p>
      ) : null}

      <div className="mt-5 flex gap-3">
        {cancelHref ? (
          <Link
            href={cancelHref}
            className="flex min-h-13 flex-1 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white px-4 font-semibold text-[var(--color-text)]"
          >
            {t("common.cancel")}
          </Link>
        ) : null}
        <SubmitButton className="flex-1" pendingLabel={t("common.loading")}>
          {t("common.save")}
        </SubmitButton>
      </div>
    </form>
  );
}
