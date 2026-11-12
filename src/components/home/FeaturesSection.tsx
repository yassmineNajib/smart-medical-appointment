import { BellRing, CalendarCheck, CheckCircle2, ClipboardCheck, RefreshCw, ShieldCheck, UsersRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../common/SectionHeader";

const features = [
  { key: "exact", icon: CalendarCheck },
  { key: "alternative", icon: ClipboardCheck },
  { key: "confirmation", icon: CheckCircle2 },
  { key: "reminder", icon: BellRing },
  { key: "attendance", icon: ShieldCheck },
  { key: "release", icon: RefreshCw },
  { key: "staff", icon: UsersRound },
];

export function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-[#101C1D] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="[&_.eyebrow]:text-[#E1CCA0] [&_h2]:text-[#FCFAF4] [&_p]:text-[#F6F1E7]/75">
          <SectionHeader
            eyebrow={t("sections.capabilitiesEyebrow")}
            title={t("sections.capabilitiesTitle")}
            description={t("sections.capabilitiesCopy")}
          />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ key, icon: Icon }) => (
            <div key={key} className="lift-card rounded-2xl border border-[#E1CCA0]/15 bg-[#FCFAF4]/8 p-5 backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCFAF4]/10 text-[#B8E8E2] shadow-sm">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-bold text-[#FCFAF4]">{t(`features.${key}.0`)}</h3>
              <p className="mt-2 text-sm leading-6 text-[#F6F1E7]/72">{t(`features.${key}.1`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
