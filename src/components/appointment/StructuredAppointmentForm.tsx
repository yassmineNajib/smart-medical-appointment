import type * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getTodayInputValue } from "../../lib/dateFormatting";
import type { AppointmentPreferences, Patient, PreferredPeriod, Specialty } from "../../types/appointment";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const specialtyValues = ["general_medicine", "cardiology", "dermatology", "radiology"] as const;
const periodValues = ["morning", "afternoon", "any"] as const;

function createSchema(t: (key: string) => string) {
  return z.object({
    full_name: z.string().min(3, t("form.errors.name")),
    phone: z
      .string()
      .min(8, t("form.errors.phoneMin"))
      .max(15, t("form.errors.phoneMax"))
      .regex(/^[+\d\s]+$/, t("form.errors.phoneInvalid")),
    email: z.string().email(t("form.errors.email")).optional().or(z.literal("")),
    specialty: z.enum(specialtyValues, { required_error: t("form.errors.specialty") }),
    preferred_date: z
      .string()
      .min(1, t("form.errors.date"))
      .refine((date) => date >= getTodayInputValue(), t("form.errors.pastDate")),
    preferred_period: z.enum(periodValues, { required_error: t("form.errors.date") }),
  });
}

export type StructuredFormValues = z.infer<ReturnType<typeof createSchema>>;

export function StructuredAppointmentForm({
  onSubmit,
  isLoading,
  validationErrors,
  initialSpecialty,
}: {
  onSubmit: (patient: Patient, preferences: AppointmentPreferences) => void;
  isLoading: boolean;
  validationErrors?: Array<{ field: string; message: string }>;
  initialSpecialty?: Specialty;
}) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StructuredFormValues>({
    resolver: zodResolver(createSchema(t)),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      specialty: initialSpecialty ?? "cardiology",
      preferred_date: getTodayInputValue(),
      preferred_period: "morning",
    },
  });

  const selectedPeriod = watch("preferred_period");
  const externalErrors = validationErrors ?? [];

  function submit(values: StructuredFormValues) {
    onSubmit(
      {
        full_name: values.full_name,
        phone: values.phone,
        email: values.email || undefined,
      },
      {
        specialty: values.specialty as Specialty,
        preferred_date: values.preferred_date,
        preferred_period: values.preferred_period as PreferredPeriod,
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t("form.name")} error={errors.full_name?.message || fieldError(externalErrors, "patient.full_name")}>
              <input className="input" placeholder={t("form.placeholders.name")} autoComplete="name" {...register("full_name")} />
            </Field>
            <Field label={t("form.phone")} error={errors.phone?.message || fieldError(externalErrors, "patient.phone")}>
              <input className="input" type="tel" placeholder={t("form.placeholders.phone")} autoComplete="tel" {...register("phone")} />
            </Field>
            <Field label={t("form.email")} error={errors.email?.message || fieldError(externalErrors, "patient.email")}>
              <input className="input" type="email" placeholder={t("form.placeholders.email")} autoComplete="email" {...register("email")} />
            </Field>
            <Field label={t("form.specialty")} error={errors.specialty?.message || fieldError(externalErrors, "preferences.specialty")}>
              <select className="input" {...register("specialty")}>
                <option value="general_medicine">{t("specialties.general_medicine.0")}</option>
                <option value="cardiology">{t("specialties.cardiology.0")}</option>
                <option value="dermatology">{t("specialties.dermatology.0")}</option>
                <option value="radiology">{t("specialties.radiology.0")}</option>
              </select>
            </Field>
            <Field label={t("form.date")} error={errors.preferred_date?.message || fieldError(externalErrors, "preferences.preferred_date")}>
              <input className="input" type="date" min={getTodayInputValue()} {...register("preferred_date")} />
            </Field>
            <Field label={t("form.period")} error={errors.preferred_period?.message || fieldError(externalErrors, "preferences.preferred_period")}>
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1" role="radiogroup" aria-label={t("form.period")}>
                {[
                  ["morning", t("form.morning")],
                  ["afternoon", t("form.afternoon")],
                  ["any", t("form.any")],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`rounded-md px-2 py-2 text-sm font-semibold transition ${
                      selectedPeriod === value ? "bg-[#FCFAF4] text-medical-navy shadow-sm" : "text-muted-foreground"
                    }`}
                    onClick={() => setValue("preferred_period", value as PreferredPeriod, { shouldValidate: true })}
                    aria-pressed={selectedPeriod === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <p className="rounded-lg bg-medical-sky p-3 text-sm text-medical-navy">{t("form.privacy")}</p>
          <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
            <Search className="h-4 w-4" aria-hidden="true" />
            {t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-medical-navy">
      {label}
      {children}
      {error ? <span className="text-sm font-medium text-red-700">{error}</span> : null}
    </label>
  );
}

function fieldError(errors: Array<{ field: string; message: string }>, field: string) {
  return errors.find((error) => error.field === field || error.field.endsWith(field.split(".").pop() ?? ""))?.message;
}
