import { CalendarSearch, CheckCircle2, ClipboardPenLine, MessageSquareText } from "lucide-react";
import { useTranslation } from "react-i18next";

const stepIcons = [MessageSquareText, CalendarSearch, ClipboardPenLine, CheckCircle2];

export function HowItWorks() {
  const { t } = useTranslation();
  const steps = t("sections.steps", { returnObjects: true }) as string[];
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#FCFAF4] py-16">
      <div className="absolute right-0 top-12 h-64 w-64 rounded-full bg-medical-sky/50 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionIntro eyebrow={t("sections.howEyebrow")} title={t("sections.howTitle")} />
        <div className="relative mt-10 grid gap-4 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-border lg:block" />
          {steps.map((title, index) => {
            const Icon = stepIcons[index];
            return (
            <div key={title} className="relative rounded-2xl border border-[#DED8CD]/80 bg-[#F6F1E7]/85 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-premium">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8E8E2] text-[#123A3C]">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-5 text-sm font-bold text-medical-teal">{t("sections.step", { number: index + 1 })}</p>
              <h3 className="mt-2 text-lg font-bold text-medical-navy">{title}</h3>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-bold text-medical-navy sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-slate-700">{description}</p> : null}
    </div>
  );
}
