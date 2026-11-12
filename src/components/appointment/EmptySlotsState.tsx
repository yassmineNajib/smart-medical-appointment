import { CalendarOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export function EmptySlotsState({ message, onModify }: { message?: string; onModify: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-border bg-white p-8 text-center shadow-soft">
      <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-bold text-medical-navy">{t("common.noSlots")}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{message || t("slots.emptyMessage")}</p>
      <Button type="button" className="mt-5" onClick={onModify}>
        {t("common.modify")}
      </Button>
    </div>
  );
}
