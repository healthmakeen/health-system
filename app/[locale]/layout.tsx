import { notFound } from "next/navigation";

import { LocaleProvider } from "@/components/locale-provider";
import { getDirection, getMessages, isLocale, locales } from "@/lib/locales";
import type { Locale } from "@/types/app";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const messages = getMessages(typedLocale);
  const dir = getDirection(typedLocale);

  return (
    <LocaleProvider locale={typedLocale} messages={messages}>
      <div
        dir={dir}
        lang={typedLocale}
        className={typedLocale === "ar" ? "font-arabic" : undefined}
      >
        {children}
      </div>
    </LocaleProvider>
  );
}
