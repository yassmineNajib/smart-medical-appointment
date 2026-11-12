import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SearchResponse } from "../../types/appointment";

export function SearchResultBanner({ result }: { result: SearchResponse }) {
  const { t } = useTranslation();
  const isAlternative = result.status === "alternative_slots_available" || result.match_type === "alternative";
  const isExact = result.status === "slots_available" || result.match_type === "exact";

  if (isExact) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5" aria-hidden="true" />
          <div>
            <h2 className="font-bold">{t("slots.exactBanner")}</h2>
            <p className="text-sm">{t("slots.countAvailable", { count: result.count })}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAlternative) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5" aria-hidden="true" />
          <div>
            <h2 className="font-bold">{t("slots.alternativeBanner")}</h2>
            <p className="text-sm">{result.message || t("slots.alternativeCount", { count: result.count })}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
