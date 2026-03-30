"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { locales, replaceLocaleInPath } from "@/lib/locales";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/app";

type LanguageSwitcherProps = {
  currentLocale: Locale;
};

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  return (
    <div
      className="inline-flex rounded-full border border-[var(--color-border)] bg-white p-1 shadow-sm"
      aria-label="Language switcher"
    >
      {locales.map((locale) => {
        const href = `${replaceLocaleInPath(pathname, locale)}${
          search ? `?${search}` : ""
        }`;

        return (
          <a
            key={locale}
            href={href}
            className={cn(
              "rounded-full px-3 py-2 text-sm font-semibold uppercase transition",
              currentLocale === locale
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-soft)]",
            )}
          >
            {locale}
          </a>
        );
      })}
    </div>
  );
}
