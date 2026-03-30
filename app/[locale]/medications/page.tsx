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
  searchParams: Promise<{ edit?: string; new?: string }>;
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

  const { edit, new: isNew } = await searchParams;
  const messages = getMessages(locale);
  const [medications, selectedMedication] = await Promise.all([
    getMedicationsForPatient(patient.id),
    typeof edit === "string" ? getMedicationForUser(user.id, edit) : Promise.resolve(null),
  ]);
  const showForm = Boolean(selectedMedication) || isNew === "1";

  const initialValues: MedicationFormValues | undefined = selectedMedication
    ? {
        description: selectedMedication.description ?? "",
        name: selectedMedication.name,
        reminder_time: selectedMedication.reminder_time ?? "",
        tablets_per_day: String(selectedMedication.tablets_per_day),
      }
    : undefined;

  return (
    <AppShell
      locale={locale}
      title={translate(messages, "medications.title")}
      description={patient.full_name}
      themeGender={patient.gender}
    >
      <section className="card-surface rounded-[28px] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">
              {translate(messages, "medications.listTitle")}
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--color-text-soft)]">
              {translate(messages, "medications.pageDescription")}
            </p>
          </div>

          {!showForm ? (
            <a
              href={`${getLocalizedPath(locale, "/medications")}?new=1`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-4 text-sm font-semibold !text-white"
            >
              {translate(messages, "medications.addButton")}
            </a>
          ) : null}
        </div>
      </section>

      {showForm ? (
        <section className="mt-5">
          <MedicationForm
            title={
              selectedMedication
                ? translate(messages, "medications.editTitle")
                : translate(messages, "medications.addTitle")
            }
            cancelHref={getLocalizedPath(locale, "/medications")}
            initialValues={initialValues}
            action={saveMedicationAction.bind(null, selectedMedication?.id ?? null)}
          />
        </section>
      ) : null}

      <section className="mt-5">
        <MedicationList locale={locale} medications={medications} messages={messages} />
      </section>
    </AppShell>
  );
}
