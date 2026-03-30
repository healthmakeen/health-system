"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useLocaleContext } from "@/components/locale-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type StatusState = {
  message?: string;
  status: "error" | "idle" | "success";
};

const initialState: StatusState = { status: "idle" };

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { locale, t } = useLocaleContext();
  const [status, setStatus] = useState<StatusState>(initialState);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSessionReady(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setSessionReady(Boolean(session));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 6) {
      setStatus({
        message: t("errors.passwordLength"),
        status: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        message: t("settings.passwordMismatch"),
        status: "error",
      });
      return;
    }

    setSubmitting(true);
    setStatus(initialState);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus({
        message: error.message,
        status: "error",
      });
      setSubmitting(false);
      return;
    }

    setStatus({
      message: t("auth.passwordResetSuccess"),
      status: "success",
    });
    setSubmitting(false);
    setTimeout(() => {
      router.push(`/${locale}/login`);
      router.refresh();
    }, 1200);
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface rounded-[32px] p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          {t("auth.resetPasswordTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
          {sessionReady
            ? t("auth.resetPasswordHelp")
            : t("auth.resetPasswordWaiting")}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
            {t("settings.newPassword")}
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
            {t("settings.confirmPassword")}
          </label>
          <div className="field-shell rounded-2xl px-4 py-3">
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {status.message ? (
        <p
          className={cn(
            "mt-4 rounded-2xl px-4 py-3 text-sm leading-6",
            status.status === "success"
              ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
              : "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
          )}
        >
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 min-h-13 w-full rounded-2xl bg-[var(--color-primary)] px-5 text-base font-semibold !text-white transition hover:bg-[var(--color-primary-strong)] disabled:opacity-60"
      >
        {submitting ? t("common.loading") : t("auth.saveNewPassword")}
      </button>

      <Link
        href={`/${locale}/login`}
        className="mt-4 inline-flex text-sm font-semibold text-[var(--color-primary)]"
      >
        {t("auth.backToLogin")}
      </Link>
    </form>
  );
}
