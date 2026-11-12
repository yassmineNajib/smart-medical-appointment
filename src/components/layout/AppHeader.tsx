import type { BackendStatus } from "../../types/appointment";
import { useTranslation } from "react-i18next";
import maw3idLogo from "../../assets/branding/Maw3idAI.png";
import { StatusBadge } from "../common/StatusBadge";

export function AppHeader({ backendStatus }: { backendStatus: BackendStatus }) {
  const { t } = useTranslation();
  return (
    <header className="border-b border-border bg-[#FCFAF4]">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <img src={maw3idLogo} alt="Maw3idAI" className="h-12 w-12 rounded-xl object-contain" />
          <div>
            <p className="text-xl font-bold text-medical-navy">{t("brand.name")}</p>
            <p className="text-sm text-muted-foreground">{t("brand.tagline")}</p>
          </div>
        </div>
        <StatusBadge status={backendStatus} />
      </nav>
    </header>
  );
}
