"use client";

import { useActionState } from "react";

import { createPatientAction } from "@/app/[locale]/actions";
import { useLocaleContext } from "@/components/locale-provider";
import { SubmitButton } from "@/components/submit-button";
import type { FormState } from "@/types/app";

const initialState: FormState = { status: "idle" };

export function PatientSetupForm() {
  const [state, formAction] = useActionState(createPatientAction, initialState);
  const { locale, t } = useLocaleContext();

  return (
    <form action={formAction} className="card-surface rounded-[28px] p-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            {t("common.fullName")}
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              required
              type="text"
              name="full_name"
              className="w-full bg-transparent outline-none"
            />
          </div>
          {state.fieldErrors?.full_name ? (
            <p className="form-error mt-2 text-sm">{state.fieldErrors.full_name}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            {t("patientSetup.birthDate")}{" "}
            <span className="text-[var(--color-text-soft)]">
              ({t("form.optional")})
            </span>
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              type="date"
              name="birth_date"
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            {t("patientSetup.gender")}{" "}
            <span className="text-[var(--color-text-soft)]">
              ({t("form.optional")})
            </span>
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <select name="gender" className="w-full bg-transparent outline-none">
              <option value="">{t("form.optional")}</option>
              <option value="male">{t("gender.male")}</option>
              <option value="female">{t("gender.female")}</option>
            </select>
          </div>
        </div>
      </div>

      {state.message ? (
        <p className="form-error mt-4 text-sm">{state.message}</p>
      ) : null}

      <SubmitButton
        className="mt-5 w-full"
        pendingLabel={t("common.loading")}
      >
        {t("common.save")}
      </SubmitButton>
    </form>
  );
}
