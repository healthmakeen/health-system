import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import {
  getAuthenticatedUser,
  getEntriesForPatient,
  getPatientForUser,
} from "@/lib/data";
import {
  formatDate,
  getMessages,
  getLocalizedPath,
  isLocale,
  translate,
} from "@/lib/locales";

export default async function ReportsPage({
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

  const messages = getMessages(locale);
  const entries = await getEntriesForPatient(patient.id);
  const latestEntry = entries[0];
  const attentionCount = entries.filter(
    (entry) => entry.overall_status === "needs_attention",
  ).length;
  const stableCount = entries.length - attentionCount;
  const avgPulse = entries.length
    ? Math.round(
        entries.reduce((total, entry) => total + entry.pulse, 0) / entries.length,
      )
    : null;

  return (
    <AppShell
      locale={locale}
      title={translate(messages, "reports.title")}
      description={translate(messages, "reports.description")}
    >
      <section className="grid grid-cols-2 gap-3">
        <SummaryCard
          label={translate(messages, "reports.totalEntries")}
          value={String(entries.length)}
        />
        <SummaryCard
          label={translate(messages, "reports.averagePulse")}
          value={avgPulse ? String(avgPulse) : "—"}
        />
        <SummaryCard
          label={translate(messages, "reports.stableDays")}
          value={String(stableCount)}
        />
        <SummaryCard
          label={translate(messages, "reports.attentionDays")}
          value={String(attentionCount)}
          tone="danger"
        />
      </section>

      <section className="card-surface mt-5 rounded-[28px] p-5">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          {translate(messages, "reports.latestSummary")}
        </h2>

        {latestEntry ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--color-bg-accent)] px-4 py-3">
              <div>
                <p className="text-sm text-[var(--color-text-soft)]">
                  {formatDate(latestEntry.entry_date, locale)}
                </p>
                <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                  {latestEntry.systolic}/{latestEntry.diastolic} mmHg
                </p>
              </div>
              <StatusBadge locale={locale} status={latestEntry.overall_status} />
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <MetricItem
                label={translate(messages, "details.pulse")}
                value={`${latestEntry.pulse}`}
              />
              <MetricItem
                label={translate(messages, "details.weight")}
                value={`${latestEntry.weight}`}
              />
              <MetricItem
                label={translate(messages, "details.breathing")}
                value={translate(messages, `options.breathing.${latestEntry.breathing_status}`)}
              />
              <MetricItem
                label={translate(messages, "details.legSwelling")}
                value={translate(messages, `options.legSwelling.${latestEntry.leg_swelling}`)}
              />
            </dl>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-[var(--color-text-soft)]">
            {translate(messages, "reports.empty")}
          </p>
        )}
      </section>
    </AppShell>
  );
}

function SummaryCard({
  label,
  tone = "default",
  value,
}: {
  label: string;
  tone?: "danger" | "default";
  value: string;
}) {
  return (
    <div
      className={`card-surface rounded-[24px] p-4 ${
        tone === "danger" ? "border-[var(--color-danger)]/20 bg-[var(--color-danger-soft)]" : ""
      }`}
    >
      <p className="text-sm text-[var(--color-text-soft)]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">{value}</p>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface-strong)] px-4 py-3">
      <dt className="text-[var(--color-text-soft)]">{label}</dt>
      <dd className="mt-1 font-semibold text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
