import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { toReadableApiError } from "../lib/apiErrors";
import { confirmAppointment } from "../services/appointmentApi";
import type { ApiDebugInfo, ConfirmationResponse, ConfirmAppointmentPayload } from "../types/appointment";

export function useAppointmentConfirmation(onDebug: (debug: ApiDebugInfo) => void, onStatus: (available: boolean) => void) {
  const { t } = useTranslation();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function confirm(payload: ConfirmAppointmentPayload) {
    setIsConfirming(true);
    setError(null);
    try {
      const response = await confirmAppointment(payload, onDebug);
      onStatus(true);
      if (response.status === "slot_unavailable" || response.status === "slot_no_longer_available" || response.code === "SLOT_CONFLICT") {
        setError(t("toasts.slotUnavailable"));
        toast.error(t("toasts.slotUnavailable"));
      } else if (response.success) {
        setConfirmation(response);
        toast.success(t("toasts.confirmed"));
      } else {
        setError(response.message);
        toast.error(response.message);
      }
      return response;
    } catch (err) {
      const readable = toReadableApiError(err);
      setError(readable.message);
      onStatus(false);
      toast.error(readable.message);
      return null;
    } finally {
      setIsConfirming(false);
    }
  }

  return { isConfirming, confirmation, setConfirmation, error, setError, confirm };
}
