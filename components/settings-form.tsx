"use client";

import { useActionState } from "react";

import {
  updatePasswordAction,
  updatePatientProfileAction,
  updateProfileAction,
} from "@/app/[locale]/actions";
import { useLocaleContext } from "@/components/locale-provider";
import { SubmitButton } from "@/components/submit-button";
import type { FormState, Locale, Patient, Profile } from "@/types/app";

const initialState: FormState = { status: "idle" };

type SettingsFormProps = {
  locale: Locale;
  patient: Patient | null;
  profile: Profile | null;
};

export function SettingsForm({ locale, patient, profile }: SettingsFormProps) {
  const [profileState, profileAction] = useActionState(
    updateProfileAction,
    initialState,
  );
  const [patientState, patientAction] = useActionState(
    updatePatientProfileAction,
    initialState,
  );
  const [passwordState, passwordAction] = useActionState(
    updatePasswordAction,
    initialState,
  );
  const { t } = useLocaleContext();

  return (
    <div className="space-y-5">
      {patient ? (
        <form action={patientAction} className="card-surface rounded-[28px] p-5">
          <input type="hidden" name="locale" value={locale} />

          <div className="mb-5">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {t("settings.patientTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
              {t("settings.patientDescription")}
            </p>
          </div>

          <div className="space-y-4">
            <Field
              defaultValue={patient.full_name}
              error={patientState.fieldErrors?.full_name}
              label={t("common.fullName")}
              name="full_name"
              type="text"
            />

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
                  defaultValue={patient.birth_date ?? ""}
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
                <select
                  name="gender"
                  defaultValue={patient.gender ?? ""}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">{t("form.optional")}</option>
                  <option value="male">{t("gender.male")}</option>
                  <option value="female">{t("gender.female")}</option>
                </select>
              </div>
            </div>
          </div>

          <FormFeedback state={patientState} successKey="settings.patientSaved" />

          <SubmitButton className="mt-5 w-full" pendingLabel={t("common.loading")}>
            {t("settings.savePatient")}
          </SubmitButton>
        </form>
      ) : null}

      <form action={profileAction} className="card-surface rounded-[28px] p-5">
        <input type="hidden" name="locale" value={locale} />

        <div className="mb-5">
          <h2 className="text-xl font-bold text-[var(--color-text)]">
            {t("settings.profileTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
            {t("settings.profileDescription")}
          </p>
        </div>

        <div className="space-y-4">
          <Field
            defaultValue={profile?.full_name ?? ""}
            error={profileState.fieldErrors?.full_name}
            label={t("common.fullName")}
            name="full_name"
            type="text"
          />

          <div>
            <label className="mb-2 block text-sm font-semibold">
              {t("common.email")}
            </label>
            <div className="field-shell rounded-2xl px-4 py-3 opacity-70">
              <input
                readOnly
                value={profile?.email ?? ""}
                className="w-full bg-transparent outline-none"
              />
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-soft)]">
              {t("settings.emailHelp")}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              {t("labels.locale")}
            </label>
            <div className="field-shell rounded-2xl px-4 py-3">
              <select
                name="profile_locale"
                defaultValue={profile?.locale ?? locale}
                className="w-full bg-transparent outline-none"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="tr">Türkçe</option>
              </select>
            </div>
          </div>
        </div>

        <FormFeedback state={profileState} successKey="settings.profileSaved" />

        <SubmitButton className="mt-5 w-full" pendingLabel={t("common.loading")}>
          {t("settings.saveProfile")}
        </SubmitButton>
      </form>

      <form action={passwordAction} className="card-surface rounded-[28px] p-5">
        <input type="hidden" name="locale" value={locale} />

        <div className="mb-5">
          <h2 className="text-xl font-bold text-[var(--color-text)]">
            {t("settings.passwordTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
            {t("settings.passwordDescription")}
          </p>
        </div>

        <div className="space-y-4">
          <Field
            error={passwordState.fieldErrors?.password}
            label={t("settings.newPassword")}
            name="password"
            type="password"
          />
          <Field
            error={passwordState.fieldErrors?.confirm_password}
            label={t("settings.confirmPassword")}
            name="confirm_password"
            type="password"
          />
        </div>

        <FormFeedback
          state={passwordState}
          successKey="settings.passwordSaved"
        />

        <SubmitButton className="mt-5 w-full" pendingLabel={t("common.loading")}>
          {t("settings.savePassword")}
        </SubmitButton>
      </form>
    </div>
  );
}

function Field({
  defaultValue,
  error,
  label,
  name,
  type,
}: {
  defaultValue?: string;
  error?: string;
  label: string;
  name: string;
  type: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <div className="field-shell rounded-2xl px-4 py-3">
        <input
          required
          name={name}
          type={type}
          defaultValue={defaultValue}
          className="w-full bg-transparent outline-none"
        />
      </div>
      {error ? <p className="form-error mt-2 text-sm">{error}</p> : null}
    </div>
  );
}

function FormFeedback({
  state,
  successKey,
}: {
  state: FormState;
  successKey: string;
}) {
  const { t } = useLocaleContext();

  if (!state.message && state.status !== "success") {
    return null;
  }

  const text = state.status === "success" ? t(successKey) : state.message;

  return (
    <p
      className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-6 ${
        state.status === "success"
          ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
          : "bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
      }`}
    >
      {text}
    </p>
  );
}
