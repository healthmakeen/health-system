import { redirect } from "next/navigation";

import { saveEntryAction } from "@/app/[locale]/actions";
import { AppShell } from "@/components/app-shell";
import { EntryForm } from "@/components/entry-form";
import { getAuthenticatedUser, getPatientForUser } from "@/lib/data";
import { getMessages, getLocalizedPath, isLocale, translate } from "@/lib/locales";

export default async function NewEntryPage({
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

  return (
    <AppShell
      locale={locale}
      title={translate(messages, "entry.addTitle")}
      description={patient.full_name}
      themeGender={patient.gender}
    >
      <EntryForm
        title={translate(messages, "entry.addTitle")}
        cancelHref={getLocalizedPath(locale, "/dashboard")}
        action={saveEntryAction.bind(null, null)}
      />
    </AppShell>
  );
}
