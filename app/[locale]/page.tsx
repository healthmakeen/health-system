import { redirect } from "next/navigation";

import { getAuthenticatedUser, getPatientForUser } from "@/lib/data";
import { getLocalizedPath, isLocale } from "@/lib/locales";

export default async function LocaleIndexPage({
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
  redirect(getLocalizedPath(locale, patient ? "/dashboard" : "/setup"));
}
