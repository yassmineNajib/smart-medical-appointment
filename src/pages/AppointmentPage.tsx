import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { AppointmentCalendar } from "../components/appointment/AppointmentCalendar";
import { AppointmentSummary } from "../components/appointment/AppointmentSummary";
import { AppointmentTabs } from "../components/appointment/AppointmentTabs";
import { ConfirmationDialog } from "../components/appointment/ConfirmationDialog";
import { ConfirmationSuccess } from "../components/appointment/ConfirmationSuccess";
import { EmptySlotsState } from "../components/appointment/EmptySlotsState";
import { MissingInformationPanel } from "../components/appointment/MissingInformationPanel";
import { SearchResultBanner } from "../components/appointment/SearchResultBanner";
import { SlotList } from "../components/appointment/SlotList";
import { ErrorAlert } from "../components/common/ErrorAlert";
import { LoadingState } from "../components/common/LoadingState";
import { RetryButton } from "../components/common/RetryButton";
import { Button } from "../components/ui/button";
import { MainFooter } from "../components/layout/MainFooter";
import { MainHeader } from "../components/layout/MainHeader";
import { appointmentEndpoints } from "../services/appointmentApi";
import { useAppointmentConfirmation } from "../hooks/useAppointmentConfirmation";
import { useAppointmentSearch } from "../hooks/useAppointmentSearch";
import type { ApiDebugInfo, AppointmentPreferences, AppointmentSlot, BackendStatus, Patient, Specialty } from "../types/appointment";

function inferPatientFromMessage(message: string, fallbackLabel: string): Patient {
  const phone = message.match(/(?:\+?\d[\d\s]{7,14}\d)/)?.[0]?.replace(/\s+/g, " ").trim();
  const namePatterns = [
    /(?:je m['’]appelle|mon nom est|nom\s*:)\s*([A-Za-zÀ-ÿ' -]{3,})/i,
    /(?:patient\s*:)\s*([A-Za-zÀ-ÿ' -]{3,})/i,
  ];
  const fullName =
    namePatterns
      .map((pattern) => message.match(pattern)?.[1]?.trim())
      .find(Boolean)
      ?.replace(/[.。,:;].*$/, "")
      .trim() || fallbackLabel;
  const email = message.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0];

  return {
    full_name: fullName,
    phone: phone || fallbackLabel,
    email,
  };
}

const specialtyValues: Specialty[] = ["general_medicine", "cardiology", "dermatology", "radiology"];

export default function AppointmentPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "text" ? "text" : "form";
  const specialtyParam = searchParams.get("specialty") as Specialty | null;
  const initialSpecialty = specialtyParam && specialtyValues.includes(specialtyParam) ? specialtyParam : undefined;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [patient, setPatient] = useState<Patient | undefined>();
  const [preferences, setPreferences] = useState<AppointmentPreferences | undefined>();
  const [originalMessage, setOriginalMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | undefined>();
  const [requestId, setRequestId] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("idle");
  const [debugInfo, setDebugInfo] = useState<ApiDebugInfo | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const setServiceStatus = useCallback((available: boolean) => {
    setBackendStatus(available ? "available" : "unavailable");
  }, []);

  const handleDebug = useCallback((debug: ApiDebugInfo) => {
    setDebugInfo(debug);
  }, []);

  const search = useAppointmentSearch(handleDebug, setServiceStatus);
  const confirmation = useAppointmentConfirmation(handleDebug, setServiceStatus);

  const result = search.result;
  const hasSlots = Boolean(result?.slots.length);
  const noSlots =
    result &&
    (result.status === "no_slots_available" || result.match_type === "none" || result.slots.length === 0) &&
    result.status !== "additional_information_required" &&
    result.status !== "validation_error";

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const filteredSlots = useMemo(() => result?.slots ?? [], [result]);

  async function handleStructuredSubmit(nextPatient: Patient, nextPreferences: AppointmentPreferences) {
    setBackendStatus("checking");
    setPatient(nextPatient);
    setPreferences(nextPreferences);
    setSelectedSlot(undefined);
    const response = await search.runStructuredSearch(nextPatient, nextPreferences);
    setRequestId(response?.request_id);
  }

  async function handleTextSubmit(message: string) {
    setBackendStatus("checking");
    setOriginalMessage(message);
    setSelectedSlot(undefined);
    const response = await search.runTextSearch(message);
    if (response?.patient) setPatient(response.patient);
    if (response?.preferences) setPreferences(response.preferences);
    setRequestId(response?.request_id);
  }

  function handleMissingAnswers(answers: Record<string, string>) {
    const answerText = Object.entries(answers)
      .filter(([, value]) => value.trim())
      .map(([field, value]) => `${field}: ${value}`)
      .join(". ");
    handleTextSubmit(`${originalMessage}\n\n${t("appointment.additionalInfo")}: ${answerText}`);
  }

  function handleSelectSlot(slot: AppointmentSlot) {
    setSelectedSlot(slot);
    setDialogOpen(true);
  }

  async function handleConfirm() {
    if (!selectedSlot) return;
    const confirmationPatient = patient ?? inferPatientFromMessage(originalMessage, t("summary.notProvided"));
    if (!patient) setPatient(confirmationPatient);
    const response = await confirmation.confirm({
      request_id: requestId || `REQ-FRONT-${Date.now()}`,
      slot_id: selectedSlot.slot_id,
      patient: confirmationPatient,
    });

    if (response?.success) {
      setDialogOpen(false);
    }

    if (
      response?.status === "slot_unavailable" ||
      response?.status === "slot_no_longer_available" ||
      response?.code === "SLOT_CONFLICT"
    ) {
      setDialogOpen(false);
      setSelectedSlot(undefined);
      if (result) {
        search.setResult({ ...result, slots: result.slots.filter((slot) => slot.slot_id !== selectedSlot.slot_id) });
      }
    }
  }

  function resetFlow() {
    confirmation.setConfirmation(null);
    confirmation.setError(null);
    search.setResult(null);
    setSelectedSlot(undefined);
    setRequestId(undefined);
    setPatient(undefined);
    setPreferences(undefined);
    setOriginalMessage("");
    setActiveTab("form");
  }

  function retryLastRequest() {
    if (activeTab === "text" && originalMessage) {
      handleTextSubmit(originalMessage);
    } else if (patient && preferences) {
      handleStructuredSubmit(patient, preferences);
    }
  }

  if (confirmation.confirmation) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <ConfirmationSuccess response={confirmation.confirmation} onNewAppointment={resetFlow} />
        </main>
        <MainFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="relative mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="pointer-events-none absolute right-10 top-10 h-72 w-72 rounded-full bg-[#B8E8E2]/50 blur-3xl" />
        <section className="grid gap-6">
          <div className="petrol-panel relative overflow-hidden rounded-[2rem] border border-[#C5A76A]/20 p-6 shadow-premium">
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#E1CCA0_1px,transparent_1px),linear-gradient(90deg,#E1CCA0_1px,transparent_1px)] [background-size:36px_36px]" />
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#E1CCA0]/70 to-transparent" />
            <p className="relative flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#E1CCA0]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t("appointment.eyebrow")}
            </p>
            <h1 className="relative mt-2 text-balance text-3xl font-bold text-[#FCFAF4] sm:text-4xl">{t("appointment.title")}</h1>
            <p className="relative mt-3 max-w-3xl text-sm leading-6 text-[#F6F1E7]/80">
              {t("appointment.intro")}
            </p>
            <div className="relative mt-5 grid gap-2 sm:grid-cols-4">
              {(t("appointment.steps", { returnObjects: true }) as string[]).map((step, index) => (
                <div key={step} className="flex items-center gap-2 rounded-lg border border-[#E1CCA0]/20 bg-[#FCFAF4]/8 p-3 text-sm font-semibold text-[#FCFAF4] shadow-sm backdrop-blur">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E1CCA0] text-xs text-[#101C1D] shadow-sm">{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#DED8CD]/70 bg-[#FCFAF4]/85 p-4 shadow-sm backdrop-blur">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-medical-teal" aria-hidden="true" />
              <p className="text-sm text-slate-700">
                {t("appointment.privacy")}
              </p>
            </div>
          </div>

          <AppointmentTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onStructuredSubmit={handleStructuredSubmit}
            onTextSubmit={handleTextSubmit}
            isLoading={search.isLoading}
            validationErrors={search.validationErrors}
            initialSpecialty={initialSpecialty}
          />

          {search.isLoading ? (
            <LoadingState
              label={activeTab === "text" ? t("appointment.loadingText") : t("appointment.loadingSlots")}
              steps={activeTab === "text" ? search.loadingSteps : undefined}
              activeStep={search.activeStep}
            />
          ) : null}

          {search.error ? <ErrorAlert message={search.error} onRetry={retryLastRequest} /> : null}
          {confirmation.error ? <ErrorAlert message={confirmation.error} /> : null}

          <div ref={resultsRef} className="grid gap-5">
            {result?.status === "additional_information_required" && result.questions?.length ? (
              <MissingInformationPanel questions={result.questions} onSubmit={handleMissingAnswers} />
            ) : null}

            {result && hasSlots ? (
              <>
                <SearchResultBanner result={result} />
                <AppointmentCalendar
                  slots={filteredSlots}
                  matchType={result.match_type}
                  selectedSlotId={selectedSlot?.slot_id}
                  onSelectSlot={handleSelectSlot}
                />
                <SlotList
                  slots={filteredSlots}
                  matchType={result.match_type}
                  selectedSlotId={selectedSlot?.slot_id}
                  onSelectSlot={handleSelectSlot}
                />
              </>
            ) : null}

            {noSlots ? <EmptySlotsState message={result.message} onModify={() => window.scrollTo({ top: 0, behavior: "smooth" })} /> : null}
          </div>

          {import.meta.env.DEV ? (
            <div className="rounded-lg border border-border bg-white/90 p-4 text-sm shadow-sm backdrop-blur">
              <button
                type="button"
                className="flex w-full items-center justify-between font-semibold text-medical-navy"
                onClick={() => setDebugOpen((open) => !open)}
              >
                {t("appointment.debug")}
                <ChevronDown className={`h-4 w-4 transition ${debugOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {debugOpen ? (
                <div className="mt-4 grid gap-3 overflow-x-auto">
                  <pre className="rounded-lg bg-slate-950 p-4 text-xs text-slate-50">
                    {JSON.stringify(
                      {
                        endpoints: appointmentEndpoints,
                        lastRequest: debugInfo,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <aside className="hidden lg:block">
          <AppointmentSummary patient={patient} selectedSlot={selectedSlot} />
        </aside>
      </main>

      {selectedSlot ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white p-3 shadow-soft lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="min-w-0 text-sm">
              <p className="truncate font-semibold text-medical-navy">{selectedSlot.specialty_label} · {selectedSlot.doctor_name}</p>
              <p className="text-muted-foreground">{selectedSlot.date} · {selectedSlot.start_time}</p>
            </div>
            <Button type="button" size="sm" onClick={() => setDialogOpen(true)}>
              {t("appointment.mobileConfirm")}
            </Button>
          </div>
        </div>
      ) : null}

      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patient={patient}
        slot={selectedSlot}
        isConfirming={confirmation.isConfirming}
        onConfirm={handleConfirm}
      />
      <MainFooter />
    </div>
  );
}
