import type { ReactNode } from "react";
import Link from "next/link";

import { signOutAction } from "@/app/[locale]/actions";
import { BottomNav } from "@/components/bottom-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { APP_VERSION } from "@/lib/app-config";
import { SubmitButton } from "@/components/submit-button";
import { getLocalizedPath, getMessages, translate } from "@/lib/locales";
import type { Locale } from "@/types/app";

type AppShellProps = {
  children: ReactNode;
  description?: string;
  locale: Locale;
  title: string;
};

export function AppShell({
  children,
  description,
  locale,
  title,
}: AppShellProps) {
  const messages = getMessages(locale);

  return (
    <main className="safe-px safe-pb mx-auto flex min-h-screen w-full max-w-md flex-col py-5">
      <header className="mb-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                Health System
              </p>
              <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-[var(--color-primary)]">
                {APP_VERSION}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)]">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
                {description}
              </p>
            ) : null}
          </div>

          <LanguageSwitcher currentLocale={locale} />
        </div>

        <form action={signOutAction} className="self-start">
          <div className="flex flex-wrap gap-3">
            <Link
              href={getLocalizedPath(locale, "/settings")}
              className="inline-flex min-h-11 items-center rounded-2xl bg-white px-4 text-sm font-semibold text-[var(--color-text)] ring-1 ring-[var(--color-border)]"
            >
              {translate(messages, "settings.title")}
            </Link>
            <input type="hidden" name="locale" value={locale} />
            <SubmitButton
              variant="secondary"
              className="min-h-11 px-4 text-sm"
              pendingLabel={translate(messages, "common.loading")}
            >
              {translate(messages, "auth.logout")}
            </SubmitButton>
          </div>
        </form>
      </header>

      {children}
      <div
        aria-hidden="true"
        className="shrink-0"
        style={{ height: "calc(9rem + env(safe-area-inset-bottom))" }}
      />
      <BottomNav />
    </main>
  );
}
