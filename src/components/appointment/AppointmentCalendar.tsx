import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import enGbLocale from "@fullcalendar/core/locales/en-gb";
import arMaLocale from "@fullcalendar/core/locales/ar-ma";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { combineDateTime } from "../../lib/dateFormatting";
import type { AppointmentSlot } from "../../types/appointment";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const slotColors = {
  exact: { backgroundColor: "hsl(var(--medical-blue))", borderColor: "hsl(var(--medical-blue))", textColor: "#fff" },
  alternative: { backgroundColor: "hsl(var(--warning))", borderColor: "hsl(var(--warning))", textColor: "#111827" },
  selected: { backgroundColor: "hsl(var(--medical-teal))", borderColor: "hsl(var(--medical-teal))", textColor: "#fff" },
};

export function AppointmentCalendar({
  slots,
  matchType,
  selectedSlotId,
  onSelectSlot,
}: {
  slots: AppointmentSlot[];
  matchType: "exact" | "alternative" | "none";
  selectedSlotId?: string;
  onSelectSlot: (slot: AppointmentSlot) => void;
}) {
  const { i18n, t } = useTranslation();
  const calendarRef = useRef<FullCalendar | null>(null);
  const firstDate = slots[0]?.date;
  const calendarLocale = i18n.language.startsWith("ar") ? arMaLocale : i18n.language.startsWith("en") ? enGbLocale : frLocale;
  const events = useMemo<EventInput[]>(
    () =>
      slots.map((slot) => {
        const isSelected = slot.slot_id === selectedSlotId;
        const isAlternative = matchType === "alternative" || Boolean(slot.difference);
        const colors = isSelected ? slotColors.selected : isAlternative ? slotColors.alternative : slotColors.exact;
        return {
          id: slot.slot_id,
          title: `${slot.specialty_label} - ${slot.doctor_name}`,
          start: combineDateTime(slot.date, slot.start_time),
          end: combineDateTime(slot.date, slot.end_time),
          extendedProps: { slot },
          ...colors,
        };
      }),
    [matchType, selectedSlotId, slots],
  );

  function handleEventClick(arg: EventClickArg) {
    onSelectSlot(arg.event.extendedProps.slot as AppointmentSlot);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>{t("slots.calendar")}</CardTitle>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
            <Legend color="bg-medical-blue" label={t("slots.legendExact")} />
            <Legend color="bg-warning" label={t("slots.legendAlternative")} />
            <Legend color="bg-medical-teal" label={t("slots.legendSelected")} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          locale={calendarLocale}
          direction={i18n.dir()}
          initialView="dayGridMonth"
          initialDate={firstDate}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          nowIndicator
          eventDisplay="block"
        />
      </CardContent>
    </Card>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} aria-hidden="true" />
      {label}
    </span>
  );
}
