"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { useLocaleContext } from "@/components/locale-provider";
import { SubmitButton } from "@/components/submit-button";
import { getLocalizedPath, getWeekdayKey } from "@/lib/locales";
import { getTodayInputValue } from "@/lib/utils";
import type { EntryFormValues, FormState } from "@/types/app";

const initialState: FormState = { status: "idle" };

type EntryFormProps = {
  action: (
    previousState: FormState,
    formData: FormData,
  ) => Promise<FormState>;
  cancelHref: string;
  initialValues?: EntryFormValues;
  title: string;
};

const defaultValues: EntryFormValues = {
  abdomen_status: "normal",
  breathing_status: "normal",
  diastolic: "",
  entry_date: getTodayInputValue(),
  leg_swelling: "none",
  notes: "",
  pulse: "",
  systolic: "",
  weight: "",
};

export function EntryForm({
  action,
  cancelHref,
  initialValues = defaultValues,
  title,
}: EntryFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [entryDate, setEntryDate] = useState(initialValues.entry_date);
  const { locale, t } = useLocaleContext();

  const dayLabel = useMemo(() => {
    const weekdayKey = getWeekdayKey(entryDate);
    return t(`weekdays.${weekdayKey}`);
  }, [entryDate, t]);

  return (
    <form action={formAction} className="card-surface rounded-[28px] p-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
          {t("entry.saveDescription")}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            {t("entry.entryDate")}
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              required
              type="date"
              name="entry_date"
              defaultValue={initialValues.entry_date}
              onChange={(event) => setEntryDate(event.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
          {state.fieldErrors?.entry_date ? (
            <p className="form-error mt-2 text-sm">{state.fieldErrors.entry_date}</p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-[var(--color-bg-accent)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
            {t("entry.dayName")}
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">
            {dayLabel}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NumberField
            defaultValue={initialValues.pulse}
            error={state.fieldErrors?.pulse}
            inputMode="numeric"
            label={t("entry.pulse")}
            name="pulse"
          />
          <NumberField
            defaultValue={initialValues.weight}
            error={state.fieldErrors?.weight}
            inputMode="decimal"
            label={t("entry.weight")}
            name="weight"
            step="0.1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NumberField
            defaultValue={initialValues.systolic}
            error={state.fieldErrors?.systolic}
            inputMode="numeric"
            label={t("entry.systolic")}
            name="systolic"
          />
          <NumberField
            defaultValue={initialValues.diastolic}
            error={state.fieldErrors?.diastolic}
            inputMode="numeric"
            label={t("entry.diastolic")}
            name="diastolic"
          />
        </div>

        <SelectField
          defaultValue={initialValues.breathing_status}
          label={t("entry.breathingStatus")}
          name="breathing_status"
          options={[
            { label: t("options.breathing.normal"), value: "normal" },
            { label: t("options.breathing.difficult"), value: "difficult" },
          ]}
        />

        <SelectField
          defaultValue={initialValues.abdomen_status}
          label={t("entry.abdomenStatus")}
          name="abdomen_status"
          options={[
            { label: t("options.abdomen.normal"), value: "normal" },
            { label: t("options.abdomen.distended"), value: "distended" },
            { label: t("options.abdomen.tight"), value: "tight" },
          ]}
        />

        <SelectField
          defaultValue={initialValues.leg_swelling}
          label={t("entry.legSwelling")}
          name="leg_swelling"
          options={[
            { label: t("options.legSwelling.none"), value: "none" },
            { label: t("options.legSwelling.mild"), value: "mild" },
            { label: t("options.legSwelling.yes"), value: "yes" },
          ]}
        />

        <div>
          <label className="mb-2 block text-sm font-semibold">
            {t("common.notes")}{" "}
            <span className="text-[var(--color-text-soft)]">
              ({t("form.optional")})
            </span>
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <textarea
              name="notes"
              rows={4}
              defaultValue={initialValues.notes}
              placeholder={t("entry.notesPlaceholder")}
              className="w-full resize-none bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {state.message ? (
        <p className="form-error mt-4 text-sm">{state.message}</p>
      ) : null}

      <div className="mt-5 flex gap-3">
        <Link
          href={cancelHref || getLocalizedPath(locale, "/dashboard")}
          className="flex min-h-13 flex-1 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white px-4 font-semibold text-[var(--color-text)]"
        >
          {t("common.cancel")}
        </Link>
        <SubmitButton className="flex-1" pendingLabel={t("common.loading")}>
          {t("common.save")}
        </SubmitButton>
      </div>
    </form>
  );
}

function NumberField({
  defaultValue,
  error,
  inputMode,
  label,
  name,
  step,
}: {
  defaultValue: string;
  error?: string;
  inputMode: "decimal" | "numeric";
  label: string;
  name: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <div className="field-shell rounded-2xl px-4 py-3">
        <input
          required
          type="number"
          name={name}
          inputMode={inputMode}
          step={step}
          defaultValue={defaultValue}
          className="w-full bg-transparent outline-none"
        />
      </div>
      {error ? <p className="form-error mt-2 text-sm">{error}</p> : null}
    </div>
  );
}

function SelectField({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue: string;
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <div className="field-shell rounded-2xl px-4 py-3">
        <select
          name={name}
          defaultValue={defaultValue}
          className="w-full bg-transparent outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
