"use client";

import { StatusBadge } from "@/components/status-badge";
import { formatDate, getWeekdayKey } from "@/lib/locales";
import type { DailyEntry, Locale } from "@/types/app";

type EntryRowProps = {
  entry: DailyEntry;
  locale: Locale;
  onOpen: (entry: DailyEntry) => void;
  translate: (key: string) => string;
};

export function EntryRow({ entry, locale, onOpen, translate }: EntryRowProps) {
  const weekdayLabel = translate(`weekdays.${getWeekdayKey(entry.entry_date)}`);

  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="card-surface w-full rounded-[24px] p-4 text-left transition hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {formatDate(entry.entry_date, locale)}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-soft)]">
            {weekdayLabel}
          </p>
        </div>
        <StatusBadge locale={locale} status={entry.overall_status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[var(--color-text)]">
        <Metric label={translate("entry.pulse")} value={String(entry.pulse)} />
        <Metric
          label={translate("details.bloodPressure")}
          value={`${entry.systolic}/${entry.diastolic}`}
        />
        <Metric label={translate("entry.weight")} value={`${entry.weight}`} />
        <Metric
          label={translate("details.status")}
          value={
            entry.overall_status === "stable"
              ? translate("labels.statusStable")
              : translate("labels.statusNeedsAttention")
          }
        />
      </div>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-bg-accent)] px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}
