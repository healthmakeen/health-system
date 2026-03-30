import Link from "next/link";

import { deleteMedicationAction } from "@/app/[locale]/actions";
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
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {medications.map((medication) => (
        <article key={medication.id} className="card-surface rounded-[24px] p-4">
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
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-[var(--color-text-soft)]">
            {medication.description || translate(messages, "medications.noDescription")}
          </p>

          <div className="mt-4 flex gap-3">
            <Link
              href={`${getLocalizedPath(locale, "/medications")}?edit=${medication.id}`}
              className="flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white px-4 font-semibold text-[var(--color-text)]"
            >
              {translate(messages, "common.edit")}
            </Link>

            <form action={deleteMedicationAction} className="flex-1">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="medication_id" value={medication.id} />
              <SubmitButton
                variant="secondary"
                className="min-h-11 w-full !bg-[var(--color-danger-soft)] !text-[var(--color-danger)] ring-0 hover:!bg-[#f9d9dc]"
                pendingLabel={translate(messages, "common.loading")}
              >
                {translate(messages, "common.delete")}
              </SubmitButton>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
