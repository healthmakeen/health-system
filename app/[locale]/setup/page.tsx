import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { PatientSetupForm } from "@/components/patient-setup-form";
import { getAuthenticatedUser, getPatientForUser } from "@/lib/data";
import { getMessages, getLocalizedPath, isLocale, translate } from "@/lib/locales";

export default async function SetupPage({
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

  if (patient) {
    redirect(getLocalizedPath(locale, "/dashboard"));
  }

  const messages = getMessages(locale);

  return (
    <AppShell
      locale={locale}
      title={translate(messages, "patientSetup.title")}
      description={translate(messages, "patientSetup.description")}
    >
      <PatientSetupForm />
    </AppShell>
  );
}
