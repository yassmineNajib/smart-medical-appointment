import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bot, CalendarPlus, Menu, MessageSquareText, X } from "lucide-react";
import maw3idLogo from "../../assets/branding/Maw3idAI.png";
import { navigationItems } from "../../data/navigation";
import { LanguageSelector } from "./LanguageSelector";

export function MainHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-[#DED8CD]/70 bg-[#FCFAF4]/88 shadow-[0_12px_40px_rgba(16,28,29,0.06)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8" aria-label="Navigation principale">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Maw3idAI">
          <img src={maw3idLogo} alt="Maw3idAI" className="h-12 w-12 shrink-0 rounded-2xl object-contain shadow-sm sm:h-14 sm:w-14" />
          <span className="min-w-0">
            <span className="block truncate text-base font-bold text-medical-navy sm:text-lg">{t("brand.name")}</span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">{t("brand.tagline")}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-sm font-semibold transition ${
                  (isActive && !item.href.includes("#")) || location.hash === item.href.split("#")[1]?.replace(/^/, "#")
                    ? "bg-medical-sky text-medical-navy"
                    : "text-slate-600 hover:bg-muted hover:text-medical-navy"
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSelector />
          <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#DED8CD] bg-[#FCFAF4] px-4 text-sm font-semibold text-medical-navy shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-champagne hover:bg-[#F6F1E7]" to="/appointment?tab=text">
            <MessageSquareText className="h-4 w-4" aria-hidden="true" />
            {t("navigation.describe")}
          </Link>
          <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,150,138,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-medical-navy" to="/appointment?tab=form">
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            {t("navigation.book")}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-medical-navy lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? t("navigation.closeMenu") : t("navigation.openMenu")}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {open ? (
        <div className="animate-fade-up border-t border-border bg-[#FCFAF4] px-4 py-4 shadow-premium lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            <div className="mb-2 flex items-center gap-3 rounded-lg bg-[#F6F1E7] p-3">
              <img src={maw3idLogo} alt="Maw3idAI" className="h-11 w-11 object-contain" />
              <div>
                <p className="font-bold text-medical-navy">{t("brand.name")}</p>
                <p className="text-xs text-muted-foreground">{t("navigation.menu")}</p>
              </div>
            </div>
            <LanguageSelector onSelect={() => setOpen(false)} />
            {navigationItems.map((item) => (
              <Link key={item.href} to={item.href} className="rounded-lg px-3 py-3 text-sm font-semibold text-medical-navy hover:bg-muted" onClick={() => setOpen(false)}>
                {t(item.labelKey)}
              </Link>
            ))}
            <div className="grid gap-2 pt-2 sm:grid-cols-2">
              <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-medical-navy" to="/appointment?tab=text" onClick={() => setOpen(false)}>
                <Bot className="h-4 w-4" aria-hidden="true" />
                {t("navigation.describe")}
              </Link>
              <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white" to="/appointment?tab=form" onClick={() => setOpen(false)}>
                <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                {t("navigation.book")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
