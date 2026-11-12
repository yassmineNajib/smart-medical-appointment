import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { toReadableApiError } from "../lib/apiErrors";
import { searchFromText, searchSlots } from "../services/appointmentApi";
import type { ApiDebugInfo, AppointmentPreferences, Patient, SearchResponse } from "../types/appointment";

export function useAppointmentSearch(onDebug: (debug: ApiDebugInfo) => void, onStatus: (available: boolean) => void) {
  const { t } = useTranslation();
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingSteps = useMemo(
    () => [t("loadingSteps.analysis"), t("loadingSteps.extraction"), t("loadingSteps.search"), t("loadingSteps.results")],
    [t],
  );
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);

  const runStructuredSearch = useCallback(
    async (patient: Patient, preferences: AppointmentPreferences) => {
      setIsLoading(true);
      setError(null);
      setValidationErrors([]);
      try {
        const response = await searchSlots({ source: "form", patient, preferences }, onDebug);
        setResult(response);
        onStatus(true);
        if (response.status === "validation_error") {
          setValidationErrors(response.errors ?? []);
          toast.error(t("toasts.fixFields"));
        } else {
          toast.success(t("toasts.searchDone"));
        }
        return response;
      } catch (err) {
        const readable = toReadableApiError(err);
        setError(readable.message);
        onStatus(false);
        toast.error(readable.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [onDebug, onStatus, t],
  );

  const runTextSearch = useCallback(
    async (message: string) => {
      setIsLoading(true);
      setError(null);
      setActiveStep(0);
      const interval = window.setInterval(() => {
        setActiveStep((current) => Math.min(current + 1, loadingSteps.length - 1));
      }, 1400);
      try {
        const response = await searchFromText(message, onDebug);
        setResult(response);
        onStatus(true);
        if (response.status === "additional_information_required") {
          toast.message(t("toasts.additionalInfo"));
        } else {
          toast.success(t("toasts.requestAnalyzed"));
        }
        return response;
      } catch (err) {
        const readable = toReadableApiError(err);
        setError(readable.message);
        onStatus(false);
        toast.error(readable.message);
        return null;
      } finally {
        window.clearInterval(interval);
        setActiveStep(loadingSteps.length - 1);
        setIsLoading(false);
      }
    },
    [loadingSteps.length, onDebug, onStatus, t],
  );

  return {
    result,
    setResult,
    isLoading,
    loadingSteps,
    activeStep,
    error,
    validationErrors,
    runStructuredSearch,
    runTextSearch,
  };
}
