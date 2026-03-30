import { notFound, redirect } from "next/navigation";

import { saveEntryAction } from "@/app/[locale]/actions";
import { AppShell } from "@/components/app-shell";
import { EntryForm } from "@/components/entry-form";
import { getAuthenticatedUser, getEntryForUser, getPatientForUser } from "@/lib/data";
import { getMessages, getLocalizedPath, isLocale, translate } from "@/lib/locales";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ entryId: string; locale: string }>;
}) {
  const { entryId, locale } = await params;

  if (!isLocale(locale)) {
    redirect("/en");
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(getLocalizedPath(locale, "/login"));
  }

  const [patient, entry] = await Promise.all([
    getPatientForUser(user.id),
    getEntryForUser(user.id, entryId),
  ]);

  if (!patient) {
    redirect(getLocalizedPath(locale, "/setup"));
  }

  if (!entry) {
    notFound();
  }

  const messages = getMessages(locale);

  return (
    <AppShell
      locale={locale}
      title={translate(messages, "entry.editTitle")}
      description={patient.full_name}
    >
      <EntryForm
        title={translate(messages, "entry.editTitle")}
        cancelHref={getLocalizedPath(locale, "/dashboard")}
        action={saveEntryAction.bind(null, entry.id)}
        initialValues={{
          abdomen_status: entry.abdomen_status,
          breathing_status: entry.breathing_status,
          diastolic: String(entry.diastolic),
          entry_date: entry.entry_date,
          leg_swelling: entry.leg_swelling,
          notes: entry.notes ?? "",
          pulse: String(entry.pulse),
          systolic: String(entry.systolic),
          weight: String(entry.weight),
        }}
      />
    </AppShell>
  );
}
