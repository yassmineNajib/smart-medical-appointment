import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bot, CalendarDays, CheckCircle2, Clock, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import maw3idLogo from "../../assets/branding/Maw3idAI.png";

export function HeroSection() {
  const { t } = useTranslation();
  const capabilities = t("hero.capabilities", { returnObjects: true }) as string[];

  return (
    <section className="petrol-panel relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(#E1CCA0_1px,transparent_1px),linear-gradient(90deg,#E1CCA0_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute left-1/2 top-12 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-[#4AC4B8]/20 blur-3xl animate-slide-glow" />
      <div className="absolute right-[-8rem] top-28 -z-10 h-72 w-72 rounded-full border border-[#E1CCA0]/20" />
      <div className="absolute bottom-10 left-[-6rem] -z-10 h-80 w-80 rounded-full border border-[#B8E8E2]/10" />
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#E1CCA0]/25 bg-[#FCFAF4]/10 px-3 py-2 text-sm font-semibold text-[#FCFAF4] shadow-sm backdrop-blur">
            <img src={maw3idLogo} alt="Maw3idAI" className="h-8 w-8 rounded-full bg-[#FCFAF4] object-contain" />
            {t("brand.name")}
          </div>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-bold leading-tight text-[#FCFAF4] sm:text-5xl lg:text-6xl">
            {t("hero.headline")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#F6F1E7]/82">
            {t("hero.copy")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#15968A] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,150,138,0.28)] transition hover:-translate-y-0.5 hover:bg-[#147D75]" to="/appointment?tab=form">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {t("hero.book")}
            </Link>
            <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#E1CCA0]/45 bg-[#FCFAF4]/10 px-5 text-sm font-semibold text-[#FCFAF4] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#FCFAF4]/16" to="/appointment?tab=text">
              <Bot className="h-4 w-4" aria-hidden="true" />
              {t("hero.describe")}
            </Link>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {capabilities.map((item) => (
              <div key={item} className="rounded-lg border border-[#E1CCA0]/20 bg-[#FCFAF4]/8 p-3 text-center text-xs font-bold text-[#F6F1E7] shadow-sm backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up">
          <div className="relative rounded-[2rem] border border-[#E1CCA0]/25 bg-[#FCFAF4]/12 p-4 shadow-premium backdrop-blur-xl">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#E1CCA0]/80 to-transparent" />
            <div className="rounded-[1.5rem] border border-[#DED8CD]/70 bg-[#FCFAF4] p-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm font-semibold text-medical-teal">{t("hero.previewEyebrow")}</p>
                <p className="text-xl font-bold text-medical-navy">{t("hero.previewTitle")}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8E8E2] text-[#123A3C]">
                <Stethoscope className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                ["09:30", t("hero.rows.cardiology"), t("hero.rows.exact"), t("hero.rows.todayMorning"), "bg-emerald-50 text-emerald-800 border-emerald-100"],
                ["11:00", t("hero.rows.radiology"), t("hero.rows.recommended"), t("hero.rows.closest"), "bg-amber-50 text-amber-800 border-amber-100"],
                ["14:15", t("hero.rows.dermatology"), t("hero.rows.confirmed"), t("hero.rows.reminder"), "bg-[#E7F7F6] text-[#123A3C] border-[#B8E8E2]"],
              ].map(([time, service, status, meta, style]) => (
                <div key={`${time}-${service}`} className="group grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-[#DED8CD]/70 bg-white/70 p-3 transition duration-300 hover:-translate-y-1 hover:border-[#C5A76A]/60 hover:shadow-soft sm:grid-cols-[auto_1fr_auto]">
                  <span className="flex h-12 w-14 items-center justify-center rounded-xl bg-[#F6F1E7] text-sm font-bold text-medical-navy">{time}</span>
                  <span>
                    <span className="block font-semibold text-medical-navy">{service}</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {meta}
                    </span>
                  </span>
                  <span className={`w-fit rounded-full border px-2.5 py-1 text-xs font-bold ${style}`}>{status}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniCard icon={Bot} label={t("hero.mini.assistant")} />
              <MiniCard icon={ShieldCheck} label={t("hero.mini.secure")} />
              <MiniCard icon={CheckCircle2} label={t("hero.mini.attendance")} />
              <MiniCard icon={CalendarDays} label={t("hero.mini.reminder")} />
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniCard({ icon: Icon, label }: { icon: typeof Bot; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/75 p-3 text-sm font-semibold text-medical-navy transition hover:bg-medical-sky/70">
      <Icon className="h-4 w-4 text-medical-teal" aria-hidden="true" />
      {label}
    </div>
  );
}
