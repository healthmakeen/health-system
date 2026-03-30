import { redirect } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { getMessages, isLocale, translate } from "@/lib/locales";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    redirect("/en");
  }

  const messages = getMessages(locale);

  return (
    <main className="safe-px safe-pb mx-auto flex min-h-screen w-full max-w-md flex-col justify-center py-8">
      <div className="mb-5 flex justify-end">
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <section className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Health System
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-text)]">
          {translate(messages, "auth.resetPasswordTitle")}
        </h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-text-soft)]">
          {translate(messages, "auth.resetPasswordHelp")}
        </p>
      </section>

      <ResetPasswordForm />
    </main>
  );
}
