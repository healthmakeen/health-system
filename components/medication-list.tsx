"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { deleteMedicationAction } from "@/app/[locale]/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { SubmitButton } from "@/components/submit-button";
import { getLocalizedPath, translate, type Messages } from "@/lib/locales";
import type { Locale, Medication } from "@/types/app";

type MedicationListProps = {
  medications: Medication[];
  locale: Locale;
  messages: Messages;
};

export function MedicationList({
  locale,
  medications,
  messages,
}: MedicationListProps) {
  if (medications.length === 0) {
    return (
      <div className="card-surface rounded-[28px] p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xl text-[var(--color-primary)]">
          +
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">
          {translate(messages, "medications.emptyTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
          {translate(messages, "medications.emptyDescription")}
        </p>
        <Link
          href={`${getLocalizedPath(locale, "/medications")}?new=1`}
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 font-semibold !text-white"
        >
          {translate(messages, "medications.addButton")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {medications.map((medication) => (
        <MedicationCard
          key={medication.id}
          locale={locale}
          medication={medication}
          messages={messages}
        />
      ))}
    </div>
  );
}

function MedicationCard({
  locale,
  medication,
  messages,
}: {
  locale: Locale;
  medication: Medication;
  messages: Messages;
}) {
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <article className="card-surface rounded-[24px] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[var(--color-text)]">
              {medication.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
              {translate(messages, "medications.tabletsDailyLabel").replace(
                "{count}",
                String(medication.tablets_per_day),
              )}
            </p>
            {medication.reminder_time ? (
              <p className="mt-1 text-xs font-medium text-[var(--color-text-soft)]">
                {translate(messages, "medications.timeLabel").replace(
                  "{time}",
                  medication.reminder_time.slice(0, 5),
                )}
              </p>
            ) : null}
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-[var(--color-text-soft)]">
          {medication.description || translate(messages, "medications.noDescription")}
        </p>

        <div className="mt-4 flex gap-2">
          <Link
            href={`${getLocalizedPath(locale, "/medications")}?edit=${medication.id}`}
            className="inline-flex min-h-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--color-text)]"
          >
            {translate(messages, "common.edit")}
          </Link>

          <form ref={deleteFormRef} action={deleteMedicationAction}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="medication_id" value={medication.id} />
            <SubmitButton
              type="button"
              variant="secondary"
              className="min-h-9 px-3 text-sm !bg-[var(--color-danger-soft)] !text-[var(--color-danger)] ring-0 hover:!bg-[#f9d9dc]"
              pendingLabel={translate(messages, "common.loading")}
              onClick={() => setShowDeleteConfirm(true)}
            >
              {translate(messages, "common.delete")}
            </SubmitButton>
          </form>
        </div>
      </article>

      {showDeleteConfirm ? (
        <ConfirmDialog
          cancelLabel={translate(messages, "common.cancel")}
          confirmLabel={translate(messages, "common.delete")}
          description={translate(messages, "medications.deleteHelp")}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => deleteFormRef.current?.requestSubmit()}
          title={translate(messages, "medications.deleteConfirm")}
        />
      ) : null}
    </>
  );
}
