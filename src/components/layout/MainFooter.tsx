import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import maw3idLogo from "../../assets/branding/Maw3idAI.png";
import { navigationItems } from "../../data/navigation";

export function MainFooter() {
  const { t } = useTranslation();
  return (
    <footer className="petrol-panel border-t border-[#C5A76A]/20">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-[1fr_auto] lg:px-8">
        <div className="flex items-start gap-3">
          <img src={maw3idLogo} alt="Maw3idAI" className="h-14 w-14 rounded-2xl bg-[#FCFAF4] object-contain p-1 shadow-sm" />
          <div>
            <p className="font-bold text-[#FCFAF4]">{t("brand.name")}</p>
            <p className="mt-1 max-w-md text-sm leading-6 text-[#E1CCA0]">{t("footer.summary")}</p>
            <p className="mt-1 text-sm font-semibold text-[#B8E8E2]">{t("footer.context")}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold text-[#FCFAF4]/80">
          {navigationItems.map((item) => (
            <Link key={item.href} to={item.href} className="hover:text-[#E1CCA0]">
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
        <p className="text-sm text-[#FCFAF4]/60 sm:col-span-2">© {new Date().getFullYear()} {t("brand.name")}. {t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
