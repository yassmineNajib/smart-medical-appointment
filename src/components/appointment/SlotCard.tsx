import { CalendarCheck, Clock, MapPin, Stethoscope, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatFrenchDate, periodLabel } from "../../lib/dateFormatting";
import { cn } from "../../lib/utils";
import type { AppointmentSlot } from "../../types/appointment";
import { Button } from "../ui/button";

export function SlotCard({
  slot,
  isSelected,
  isAlternative,
  onSelect,
}: {
  slot: AppointmentSlot;
  isSelected: boolean;
  isAlternative: boolean;
  onSelect: (slot: AppointmentSlot) => void;
}) {
  const { t } = useTranslation();

  return (
    <article
      className={cn(
        "rounded-lg border bg-white/95 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-premium",
        isSelected ? "border-medical-teal ring-2 ring-medical-teal/30" : "border-border hover:border-medical-blue/30",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-medical-navy">{slot.specialty_label}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-semibold",
                isAlternative ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800",
              )}
            >
              {isAlternative ? t("slots.alternative") : t("slots.exact")}
            </span>
          </div>
          {slot.difference ? <p className="mt-2 text-sm font-medium text-amber-800">{slot.difference}</p> : null}
        </div>
        <Button type="button" size="sm" variant={isSelected ? "secondary" : "default"} onClick={() => onSelect(slot)}>
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          {t("slots.choose")}
        </Button>
      </div>
      <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <Info icon={Stethoscope} label={t("slots.service")} value={slot.department} />
        <Info icon={UserRound} label={t("slots.doctor")} value={slot.doctor_name} />
        <Info icon={MapPin} label={t("slots.date")} value={formatFrenchDate(slot.date)} />
        <Info icon={Clock} label={t("slots.time")} value={`${slot.start_time} - ${slot.end_time} · ${periodLabel(slot.period)}`} />
      </dl>
    </article>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex gap-2 rounded-lg bg-muted/60 p-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
      <div>
        <dt className="font-semibold text-medical-navy">{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );
}
