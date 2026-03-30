"use client";

import { useState } from "react";

import { EntryDetailsModal } from "@/components/entry-details-modal";
import { EntryRow } from "@/components/entry-row";
import { useLocaleContext } from "@/components/locale-provider";
import type { DailyEntry, Locale } from "@/types/app";

type EntryListProps = {
  entries: DailyEntry[];
  locale: Locale;
};

export function EntryList({ entries, locale }: EntryListProps) {
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const { t } = useLocaleContext();

  return (
    <>
      <div className="space-y-3">
        {entries.map((entry) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            locale={locale}
            onOpen={setSelectedEntry}
            translate={t}
          />
        ))}
      </div>

      {selectedEntry ? (
        <EntryDetailsModal
          entry={selectedEntry}
          locale={locale}
          onClose={() => setSelectedEntry(null)}
          translate={t}
        />
      ) : null}
    </>
  );
}
