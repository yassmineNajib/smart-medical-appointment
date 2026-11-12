import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export function RetryButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();

  return (
    <Button type="button" variant="secondary" onClick={onClick}>
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      {t("common.retry")}
    </Button>
  );
}
