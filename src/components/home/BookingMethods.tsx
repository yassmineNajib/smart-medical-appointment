import { Link } from "react-router-dom";
import { ClipboardList, MessageSquareText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionIntro } from "./HowItWorks";

export function BookingMethods() {
  const { t } = useTranslation();
  return (
    <section className="bg-[#FCFAF4] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionIntro
          eyebrow={t("sections.bookingEyebrow")}
          title={t("sections.bookingTitle")}
          description={t("sections.bookingCopy")}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <MethodCard
            icon={ClipboardList}
            title={t("sections.guidedTitle")}
            description={t("sections.guidedCopy")}
            cta={t("sections.guidedCta")}
            href="/appointment?tab=form"
          />
          <MethodCard
            icon={MessageSquareText}
            title={t("sections.textTitle")}
            description={t("sections.textCopy")}
            cta={t("sections.textCta")}
            href="/appointment?tab=text"
          />
        </div>
      </div>
    </section>
  );
}

function MethodCard({ icon: Icon, title, description, cta, href }: { icon: typeof ClipboardList; title: string; description: string; cta: string; href: string }) {
  return (
    <article className="lift-card rounded-2xl border border-[#DED8CD]/70 bg-[#F6F1E7]/70 p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCFAF4] text-medical-blue shadow-sm">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-medical-navy">{title}</h3>
      <p className="mt-3 leading-7 text-slate-700">{description}</p>
      <Link className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,150,138,0.2)] transition hover:-translate-y-0.5 hover:bg-medical-navy" to={href}>
        {cta}
      </Link>
    </article>
  );
}
