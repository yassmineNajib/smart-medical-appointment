import { useTranslation } from "react-i18next";

export function AppFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-[#C5A76A]/20 bg-[#101C1D] py-6 text-center text-sm text-[#FCFAF4]/70">
      {t("brand.name")} - {t("footer.context")}
    </footer>
  );
}
