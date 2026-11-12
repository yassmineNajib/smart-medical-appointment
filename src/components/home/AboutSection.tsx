import { Building2, CalendarClock, HeartHandshake } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../common/SectionHeader";

export function AboutSection() {
  const { t } = useTranslation();
  return (
    <section id="about" className="bg-[#FCFAF4] py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <SectionHeader
          eyebrow={t("sections.aboutEyebrow")}
          title={t("sections.aboutTitle")}
          description={t("sections.aboutCopy")}
        />
        <div className="grid gap-4">
          <AboutPoint
            icon={CalendarClock}
            title={t("sections.problem")}
            text={t("sections.problemText")}
          />
          <AboutPoint
            icon={HeartHandshake}
            title={t("sections.solution")}
            text={t("sections.solutionText")}
          />
          <AboutPoint
            icon={Building2}
            title={t("sections.impact")}
            text={t("sections.impactText")}
          />
        </div>
      </div>
    </section>
  );
}

function AboutPoint({ icon: Icon, title, text }: { icon: typeof Building2; title: string; text: string }) {
  return (
    <article className="lift-card rounded-2xl border border-[#DED8CD]/70 bg-[#F6F1E7]/80 p-5 shadow-sm">
      <div className="flex gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B8E8E2] text-[#123A3C]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-bold text-medical-navy">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{text}</p>
        </div>
      </div>
    </article>
  );
}
