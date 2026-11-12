import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatFrenchDate, periodLabel } from "../../lib/dateFormatting";
import type { AppointmentSlot, Patient } from "../../types/appointment";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";

export function ConfirmationDialog({
  open,
  onOpenChange,
  patient,
  slot,
  isConfirming,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient;
  slot?: AppointmentSlot;
  isConfirming: boolean;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="text-xl font-bold text-medical-navy">{t("confirmation.title")}</DialogTitle>
        <DialogDescription className="mt-2 text-sm text-muted-foreground">{t("confirmation.description")}</DialogDescription>
        {patient && slot ? (
          <div className="mt-5 grid gap-3 rounded-lg bg-muted p-4 text-sm">
            <Line label={t("summary.patient")} value={patient.full_name} />
            <Line label={t("summary.phone")} value={patient.phone} />
            <Line label={t("summary.email")} value={patient.email || t("summary.notProvided")} />
            <Line label={t("summary.specialty")} value={slot.specialty_label} />
            <Line label={t("summary.doctor")} value={slot.doctor_name} />
            <Line label={t("slots.service")} value={slot.department} />
            <Line label={t("summary.date")} value={formatFrenchDate(slot.date)} />
            <Line label={t("confirmation.start")} value={slot.start_time} />
            <Line label={t("confirmation.end")} value={slot.end_time} />
            <Line label={t("summary.period")} value={periodLabel(slot.period)} />
          </div>
        ) : slot ? (
          <div className="mt-5 grid gap-3 rounded-lg bg-muted p-4 text-sm">
            <Line label={t("summary.patient")} value={t("confirmation.textPatient")} />
            <Line label={t("summary.specialty")} value={slot.specialty_label} />
            <Line label={t("summary.doctor")} value={slot.doctor_name} />
            <Line label={t("slots.service")} value={slot.department} />
            <Line label={t("summary.date")} value={formatFrenchDate(slot.date)} />
            <Line label={t("confirmation.start")} value={slot.start_time} />
            <Line label={t("confirmation.end")} value={slot.end_time} />
            <Line label={t("summary.period")} value={periodLabel(slot.period)} />
          </div>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isConfirming}>
            {t("confirmation.back")}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isConfirming || !slot}>
            {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {t("confirmation.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-medical-navy">{value}</span>
    </div>
  );
}
