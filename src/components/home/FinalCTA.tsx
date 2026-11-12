import { Link } from "react-router-dom";
import { Bot, CalendarPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FinalCTA() {
  const { t } = useTranslation();
  return (
    <section className="bg-[#FCFAF4] py-16">
      <div className="petrol-panel mx-auto max-w-5xl rounded-[2rem] border border-[#C5A76A]/20 px-4 py-12 text-center shadow-premium lg:px-8">
        <h2 className="text-balance text-3xl font-bold text-[#FCFAF4] sm:text-4xl">{t("sections.finalTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#F6F1E7]/80">{t("sections.finalCopy")}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-[#147D75]" to="/appointment?tab=form">
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            {t("sections.start")}
          </Link>
          <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#E1CCA0]/45 bg-[#FCFAF4]/10 px-5 text-sm font-semibold text-[#FCFAF4] hover:bg-[#FCFAF4]/15" to="/appointment?tab=text">
            <Bot className="h-4 w-4" aria-hidden="true" />
            {t("sections.useAssistant")}
          </Link>
        </div>
      </div>
    </section>
  );
}
