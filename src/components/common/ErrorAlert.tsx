import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export function ErrorAlert({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-red-200 bg-red-50/90 p-4 text-red-900 shadow-sm" role="alert">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-danger shadow-sm">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="font-semibold">{message}</p>
          {onRetry ? (
            <Button className="mt-3" variant="secondary" size="sm" onClick={onRetry}>
              {t("common.retry")}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
