import { LockKeyhole, ShieldCheck, Stethoscope, UserRoundCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionIntro } from "./HowItWorks";

const icons = [LockKeyhole, ShieldCheck, Stethoscope, UserRoundCheck];

export function PrivacySection() {
  const { t } = useTranslation();
  const items = t("security", { returnObjects: true }) as string[];
  return (
    <section className="bg-[#FCFAF4] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="rounded-[2rem] border border-[#DED8CD]/80 bg-[#F6F1E7]/75 p-6 shadow-sm sm:p-8">
          <SectionIntro
            eyebrow={t("sections.securityEyebrow")}
            title={t("sections.securityTitle")}
            description={t("sections.securityCopy")}
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((label, index) => {
              const Icon = icons[index];
              return (
              <div key={label} className="rounded-lg bg-[#FCFAF4]/80 p-4">
                <Icon className="h-5 w-5 text-medical-blue" aria-hidden="true" />
                <p className="mt-3 font-semibold text-medical-navy">{label}</p>
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
