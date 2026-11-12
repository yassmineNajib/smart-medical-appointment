import { CheckCircle2, Loader2, WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BackendStatus } from "../../types/appointment";
import { cn } from "../../lib/utils";

const config = {
  idle: { labelKey: "backendStatus.connecting", icon: Loader2, className: "bg-slate-100 text-slate-700" },
  checking: { labelKey: "backendStatus.connecting", icon: Loader2, className: "bg-sky-100 text-sky-800" },
  available: { labelKey: "backendStatus.available", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-800" },
  unavailable: { labelKey: "backendStatus.unavailable", icon: WifiOff, className: "bg-red-100 text-red-800" },
};

export function StatusBadge({ status }: { status: BackendStatus }) {
  const { t } = useTranslation();
  const item = config[status];
  const Icon = item.icon;
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold", item.className)}>
      <Icon className={cn("h-4 w-4", status === "checking" || status === "idle" ? "animate-spin" : "")} aria-hidden="true" />
      {t(item.labelKey)}
    </span>
  );
}
