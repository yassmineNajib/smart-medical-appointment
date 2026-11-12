import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatFrenchDate, periodLabel } from "../../lib/dateFormatting";
import type { AppointmentSlot, Patient } from "../../types/appointment";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function AppointmentSummary({ patient, selectedSlot }: { patient?: Patient; selectedSlot?: AppointmentSlot }) {
  const { t } = useTranslation();

  return (
    <Card className="sticky top-24 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-medical-blue" aria-hidden="true" />
          {t("summary.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {patient ? (
          <div className="grid gap-3 text-sm">
            <SummaryLine label={t("summary.patient")} value={patient.full_name || t("summary.notProvided")} />
            <SummaryLine label={t("summary.phone")} value={patient.phone || t("summary.notProvided")} />
            <SummaryLine label={t("summary.email")} value={patient.email || t("summary.notProvided")} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("summary.empty")}</p>
        )}
        {selectedSlot ? (
          <div className="mt-5 border-t border-border pt-5 text-sm">
            <SummaryLine label={t("summary.specialty")} value={selectedSlot.specialty_label} />
            <SummaryLine label={t("summary.doctor")} value={selectedSlot.doctor_name} />
            <SummaryLine label={t("summary.date")} value={formatFrenchDate(selectedSlot.date)} />
            <SummaryLine label={t("summary.time")} value={`${selectedSlot.start_time} - ${selectedSlot.end_time}`} />
            <SummaryLine label={t("summary.period")} value={periodLabel(selectedSlot.period)} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-medical-navy">{value}</span>
    </div>
  );
}
