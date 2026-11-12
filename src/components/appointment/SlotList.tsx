import { useTranslation } from "react-i18next";
import type { AppointmentSlot } from "../../types/appointment";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SlotCard } from "./SlotCard";

export function SlotList({
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
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("slots.title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {slots.map((slot) => (
          <SlotCard
            key={slot.slot_id}
            slot={slot}
            isSelected={selectedSlotId === slot.slot_id}
            isAlternative={matchType === "alternative" || Boolean(slot.difference)}
            onSelect={onSelectSlot}
          />
        ))}
      </CardContent>
    </Card>
  );
}
