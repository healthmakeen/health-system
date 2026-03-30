import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { SettingsForm } from "@/components/settings-form";
import {
  getAuthenticatedUser,
  getPatientForUser,
  getProfileByUserId,
} from "@/lib/data";
import { getMessages, getLocalizedPath, isLocale, translate } from "@/lib/locales";

export default async function SettingsPage({
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

  const messages = getMessages(locale);
  const [patient, profile] = await Promise.all([
    getPatientForUser(user.id),
    getProfileByUserId(user.id),
  ]);

  return (
    <AppShell
      locale={locale}
      title={translate(messages, "settings.title")}
      description={translate(messages, "settings.description")}
      themeGender={patient?.gender ?? null}
    >
      <SettingsForm locale={locale} patient={patient} profile={profile} />
    </AppShell>
  );
}
