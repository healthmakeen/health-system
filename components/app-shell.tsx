import type { ReactNode } from "react";

import { signOutAction } from "@/app/[locale]/actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SubmitButton } from "@/components/submit-button";
import { getMessages, translate } from "@/lib/locales";
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Health System
            </p>
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
          <input type="hidden" name="locale" value={locale} />
          <SubmitButton
            className="min-h-11 bg-white px-4 text-sm text-[var(--color-text)] ring-1 ring-[var(--color-border)]"
            pendingLabel={translate(messages, "common.loading")}
          >
            {translate(messages, "auth.logout")}
          </SubmitButton>
        </form>
      </header>

      {children}
    </main>
  );
}
