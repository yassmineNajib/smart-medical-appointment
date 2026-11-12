import { Bot, CalendarCheck, Clock3, BellRing } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TrustIndicators() {
  const { t } = useTranslation();
  const indicators = [
    { label: t("trust.intelligent"), icon: Bot },
    { label: t("trust.availability"), icon: Clock3 },
    { label: t("trust.secure"), icon: CalendarCheck },
    { label: t("trust.reminders"), icon: BellRing },
  ];
  return (
    <section className="border-y border-[#DED8CD]/70 bg-[#FCFAF4]">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {indicators.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg bg-[#F6F1E7] p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCFAF4] text-medical-blue shadow-sm">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-semibold text-medical-navy">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
