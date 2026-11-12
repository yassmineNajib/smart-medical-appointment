import { CheckCircle2, Printer, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatFrenchDate } from "../../lib/dateFormatting";
import type { ConfirmationResponse } from "../../types/appointment";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function ConfirmationSuccess({ response, onNewAppointment }: { response: ConfirmationResponse; onNewAppointment: () => void }) {
  const { t } = useTranslation();
  const appointment = response.appointment;

  return (
    <Card className="overflow-hidden print:shadow-none">
      <CardContent className="p-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-success shadow-[0_18px_44px_rgba(21,132,103,0.18)]">
            <CheckCircle2 className="h-12 w-12" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-medical-navy">{t("confirmation.successTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{response.message || t("confirmation.defaultSuccess")}</p>
        </div>
        {appointment ? (
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 rounded-lg bg-medical-sky p-5 text-sm">
            <Line label={t("confirmation.identifier")} value={appointment.appointment_id} />
            <Line label={t("summary.patient")} value={appointment.patient.full_name} />
            <Line label={t("confirmation.dateTime")} value={`${formatFrenchDate(appointment.date)} · ${appointment.start_time} - ${appointment.end_time}`} />
            <Line label={t("summary.doctor")} value={appointment.doctor_name} />
            <Line label={t("slots.service")} value={appointment.department} />
            <Line label={t("confirmation.reminder")} value={response.reminder_scheduled ? t("confirmation.scheduled") : appointment.reminder_status || t("confirmation.notScheduled")} />
          </div>
        ) : null}
        {response.instructions?.length ? (
          <div className="mx-auto mt-6 max-w-3xl">
            <h2 className="font-bold text-medical-navy">{t("confirmation.instructions")}</h2>
            <ul className="mt-3 grid gap-2 text-sm text-slate-700">
              {response.instructions.map((instruction) => (
                <li key={instruction} className="rounded-lg border border-border bg-white p-3">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={onNewAppointment}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t("confirmation.new")}
          </Button>
          <Button type="button" variant="secondary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            {t("confirmation.print")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/80 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-medical-navy">{value}</span>
    </div>
  );
}
