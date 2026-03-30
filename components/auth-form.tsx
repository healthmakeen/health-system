"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { authAction } from "@/app/[locale]/actions";
import { useLocaleContext } from "@/components/locale-provider";
import { SubmitButton } from "@/components/submit-button";
import { cn } from "@/lib/utils";
import type { FormState } from "@/types/app";

const initialState: FormState = { status: "idle" };

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [state, formAction] = useActionState(authAction, initialState);
  const { locale, t } = useLocaleContext();

  return (
    <form action={formAction} className="card-surface rounded-[32px] p-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="mode" value={mode} />

      <div className="mb-5 inline-flex w-full rounded-full bg-[var(--color-bg-accent)] p-1">
        {(["login", "signup"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            className={cn(
              "min-h-12 flex-1 rounded-full px-4 text-sm font-semibold transition",
              mode === option
                ? "bg-white text-[var(--color-text)] shadow-sm"
                : "text-[var(--color-text-soft)]",
            )}
          >
            {t(option === "login" ? "auth.login" : "auth.signup")}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
            {t("common.email")}
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className="w-full bg-transparent outline-none"
              placeholder="info@makeen.me"
            />
          </div>
          {state.fieldErrors?.email ? (
            <p className="form-error mt-2 text-sm">{state.fieldErrors.email}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
            {t("auth.password")}
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              required
              type="password"
              name="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full bg-transparent outline-none"
            />
          </div>
          {state.fieldErrors?.password ? (
            <p className="form-error mt-2 text-sm">
              {state.fieldErrors.password}
            </p>
          ) : null}
          {mode === "login" ? (
            <Link
              href={`/${locale}/forgot-password`}
              className="mt-3 inline-flex text-sm font-semibold text-[var(--color-primary)]"
            >
              {t("auth.forgotPassword")}
            </Link>
          ) : null}
        </div>
      </div>

      {state.message ? (
        <p
          className={cn(
            "mt-4 rounded-2xl px-4 py-3 text-sm leading-6",
            state.status === "success"
              ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
              : "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
          )}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton
        className="mt-5 w-full"
        pendingLabel={t("common.loading")}
      >
        {t(mode === "login" ? "auth.login" : "auth.signup")}
      </SubmitButton>
    </form>
  );
}
