import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { AppFooter } from "../components/layout/AppFooter";
import { AppHeader } from "../components/layout/AppHeader";
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
import { appointmentEndpoints } from "../services/appointmentApi";
import { useAppointmentConfirmation } from "../hooks/useAppointmentConfirmation";
import { useAppointmentSearch } from "../hooks/useAppointmentSearch";
import type { ApiDebugInfo, AppointmentPreferences, AppointmentSlot, BackendStatus, Patient } from "../types/appointment";

function inferPatientFromMessage(message: string): Patient {
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
      .trim() || "Patient non renseigné";
  const email = message.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0];

  return {
    full_name: fullName,
    phone: phone || "Non renseigné",
    email,
  };
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("form");
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
    handleTextSubmit(`${originalMessage}\n\nInformations complémentaires: ${answerText}`);
  }

  function handleSelectSlot(slot: AppointmentSlot) {
    setSelectedSlot(slot);
    setDialogOpen(true);
  }

  async function handleConfirm() {
    if (!selectedSlot) return;
    const confirmationPatient = patient ?? inferPatientFromMessage(originalMessage);
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
        <AppHeader backendStatus={backendStatus} />
        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <ConfirmationSuccess response={confirmation.confirmation} onNewAppointment={resetFlow} />
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader backendStatus={backendStatus} />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <section className="grid gap-6">
          <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-medical-teal" aria-hidden="true" />
              <p className="text-sm text-slate-700">
                Vos données sont envoyées uniquement aux webhooks Fusion AI configurés. Aucun diagnostic médical ni conseil de traitement n'est fourni par cette interface.
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
          />

          {search.isLoading ? (
            <LoadingState
              label={activeTab === "text" ? "Analyse en cours" : "Recherche des créneaux"}
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
            <div className="rounded-lg border border-border bg-white p-4 text-sm shadow-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between font-semibold text-medical-navy"
                onClick={() => setDebugOpen((open) => !open)}
              >
                Panneau de développement
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
              Confirmer
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
      <AppFooter />
    </div>
  );
}
