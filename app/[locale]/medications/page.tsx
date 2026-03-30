import { redirect } from "next/navigation";

import { saveMedicationAction } from "@/app/[locale]/actions";
import { AppShell } from "@/components/app-shell";
import { MedicationForm } from "@/components/medication-form";
import { MedicationList } from "@/components/medication-list";
import {
  getAuthenticatedUser,
  getMedicationForUser,
  getMedicationsForPatient,
  getPatientForUser,
} from "@/lib/data";
import { getMessages, getLocalizedPath, isLocale, translate } from "@/lib/locales";
import type { MedicationFormValues } from "@/types/app";

export default async function MedicationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ edit?: string }>;
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

  const { edit } = await searchParams;
  const messages = getMessages(locale);
  const [medications, selectedMedication] = await Promise.all([
    getMedicationsForPatient(patient.id),
    typeof edit === "string" ? getMedicationForUser(user.id, edit) : Promise.resolve(null),
  ]);

  const initialValues: MedicationFormValues | undefined = selectedMedication
    ? {
        description: selectedMedication.description ?? "",
        name: selectedMedication.name,
        tablets_per_day: String(selectedMedication.tablets_per_day),
      }
    : undefined;

  return (
    <AppShell
      locale={locale}
      title={translate(messages, "medications.title")}
      description={patient.full_name}
    >
      <MedicationForm
        title={
          selectedMedication
            ? translate(messages, "medications.editTitle")
            : translate(messages, "medications.addTitle")
        }
        cancelHref={selectedMedication ? getLocalizedPath(locale, "/medications") : undefined}
        initialValues={initialValues}
        action={saveMedicationAction.bind(null, selectedMedication?.id ?? null)}
      />

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--color-text)]">
            {translate(messages, "medications.listTitle")}
          </h2>
        </div>

        <MedicationList locale={locale} medications={medications} messages={messages} />
      </section>
    </AppShell>
  );
}
