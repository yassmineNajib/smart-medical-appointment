import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { specialties } from "../../data/specialties";
import { SectionIntro } from "./HowItWorks";

export function MedicalServices() {
  const { t } = useTranslation();
  return (
    <section id="services" className="bg-[#F6F1E7] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionIntro eyebrow={t("sections.servicesEyebrow")} title={t("sections.servicesTitle")} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map(({ id, icon: Icon }) => (
            <article key={id} className="lift-card group rounded-2xl border border-[#DED8CD]/80 bg-[#FCFAF4]/90 p-5 shadow-sm backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8E8E2] text-[#123A3C] transition group-hover:scale-105">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-medical-navy">{t(`specialties.${id}.0`)}</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-slate-700">{t(`specialties.${id}.1`)}</p>
              <Link className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-border bg-[#FCFAF4] px-3 text-sm font-semibold text-medical-navy transition hover:-translate-y-0.5 hover:border-champagne hover:bg-[#F6F1E7]" to={`/appointment?specialty=${id}`}>
                {t("sections.availability")}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
