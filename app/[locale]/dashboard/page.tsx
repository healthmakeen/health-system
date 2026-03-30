import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { EntryList } from "@/components/entry-list";
import { StatusBadge } from "@/components/status-badge";
import {
  getAuthenticatedUser,
  getEntriesForPatient,
  getPatientForUser,
  getProfileByUserId,
} from "@/lib/data";
import {
  formatLongDate,
  getMessages,
  getLocalizedPath,
  isLocale,
  translate,
} from "@/lib/locales";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    redirect("/en");
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(getLocalizedPath(locale, "/login"));
  }

  const patient = await getPatientForUser(user.id);

  if (!patient) {
    redirect(getLocalizedPath(locale, "/setup"));
  }

  const [entries, profile] = await Promise.all([
    getEntriesForPatient(patient.id),
    getProfileByUserId(user.id),
  ]);

  const messages = getMessages(locale);

  return (
    <AppShell
      locale={locale}
      title={translate(messages, "common.dashboard")}
      description={formatLongDate(new Date(), locale)}
    >
      <section className="card-surface rounded-[28px] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
          {translate(messages, "dashboard.patientSummary")}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">
          {patient.full_name}
        </h2>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[var(--color-bg-accent)] px-4 py-3">
          <div>
            <p className="text-sm text-[var(--color-text-soft)]">
              {translate(messages, "dashboard.today")}
            </p>
            <p className="text-base font-semibold text-[var(--color-text)]">
              {formatLongDate(new Date(), locale)}
            </p>
          </div>
          <StatusBadge
            locale={locale}
            status={entries[0]?.overall_status ?? "stable"}
          />
        </div>

        {profile?.email ? (
          <p className="mt-4 text-sm text-[var(--color-text-soft)]">
            {profile.email}
          </p>
        ) : null}

        <Link
          href={getLocalizedPath(locale, "/dashboard/entries/new")}
          className="mt-5 flex min-h-13 w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 text-base font-semibold text-white"
        >
          {translate(messages, "common.addEntry")}
        </Link>
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--color-text)]">
            {translate(messages, "dashboard.latestEntries")}
          </h2>
        </div>

        {entries.length > 0 ? (
          <EntryList entries={entries} locale={locale} />
        ) : (
          <EmptyState locale={locale} />
        )}
      </section>
    </AppShell>
  );
}
