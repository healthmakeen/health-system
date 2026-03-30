"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { deleteEntryAction } from "@/app/[locale]/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatDateTime, getLocalizedPath, getWeekdayKey } from "@/lib/locales";
import type { DailyEntry, Locale } from "@/types/app";

type EntryDetailsModalProps = {
  entry: DailyEntry;
  locale: Locale;
  onClose: () => void;
  translate: (key: string) => string;
};

export function EntryDetailsModal({
  entry,
  locale,
  onClose,
  translate,
}: EntryDetailsModalProps) {
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const weekdayLabel = translate(`weekdays.${getWeekdayKey(entry.entry_date)}`);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-3 sm:items-center">
        <div className="card-surface safe-pb w-full max-w-md rounded-[32px] p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[var(--color-text)]">
              {translate("common.details")}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-soft)]">
              {formatDate(entry.entry_date, locale)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[var(--color-bg-accent)] px-3 py-2 text-sm font-semibold text-[var(--color-text)]"
          >
            {translate("common.close")}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Detail label={translate("details.day")} value={weekdayLabel} />
          <Detail label={translate("details.pulse")} value={`${entry.pulse}`} />
          <Detail
            label={translate("details.bloodPressure")}
            value={`${entry.systolic}/${entry.diastolic}`}
          />
          <Detail label={translate("details.weight")} value={`${entry.weight}`} />
          <Detail
            label={translate("details.breathing")}
            value={translate(`options.breathing.${entry.breathing_status}`)}
          />
          <Detail
            label={translate("details.abdomen")}
            value={translate(`options.abdomen.${entry.abdomen_status}`)}
          />
          <Detail
            label={translate("details.legSwelling")}
            value={translate(`options.legSwelling.${entry.leg_swelling}`)}
          />
          <div className="rounded-2xl bg-[var(--color-bg-accent)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              {translate("details.status")}
            </p>
            <div className="mt-2">
              <StatusBadge locale={locale} status={entry.overall_status} />
            </div>
          </div>
        </div>

        {entry.notes ? (
          <div className="mt-3 rounded-2xl bg-[var(--color-bg-accent)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              {translate("common.notes")}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-text)]">
              {entry.notes}
            </p>
          </div>
        ) : null}

        <p className="mt-4 text-sm text-[var(--color-text-soft)]">
          {translate("common.createdAt")}: {formatDateTime(entry.created_at, locale)}
        </p>

          <div className="mt-5 flex gap-3">
            <Link
              href={getLocalizedPath(locale, `/dashboard/entries/${entry.id}/edit`)}
              className="flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white px-4 font-semibold text-[var(--color-text)]"
            >
              {translate("common.edit")}
            </Link>
            <form ref={deleteFormRef} action={deleteEntryAction} className="flex-1">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="entry_id" value={entry.id} />
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="min-h-12 w-full rounded-2xl bg-[var(--color-danger)] px-4 font-semibold text-white"
              >
                {translate("common.delete")}
              </button>
            </form>
          </div>
        </div>
      </div>
      {showDeleteConfirm ? (
        <ConfirmDialog
          cancelLabel={translate("common.cancel")}
          confirmLabel={translate("common.delete")}
          description={translate("entry.deleteHelp")}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => deleteFormRef.current?.requestSubmit()}
          title={translate("entry.deleteConfirm")}
        />
      ) : null}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-bg-accent)] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}
