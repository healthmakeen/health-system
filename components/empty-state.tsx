import Link from "next/link";

import { getMessages, getLocalizedPath, translate } from "@/lib/locales";
import type { Locale } from "@/types/app";

type EmptyStateProps = {
  locale: Locale;
};

export function EmptyState({ locale }: EmptyStateProps) {
  const messages = getMessages(locale);

  return (
    <div className="card-surface rounded-[28px] p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xl text-[var(--color-primary)]">
        +
      </div>
      <h2 className="text-xl font-bold text-[var(--color-text)]">
        {translate(messages, "dashboard.emptyTitle")}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
        {translate(messages, "dashboard.emptyDescription")}
      </p>
      <Link
        href={getLocalizedPath(locale, "/dashboard/entries/new")}
        className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 font-semibold !text-white"
      >
        {translate(messages, "dashboard.addFirstEntry")}
      </Link>
    </div>
  );
}
