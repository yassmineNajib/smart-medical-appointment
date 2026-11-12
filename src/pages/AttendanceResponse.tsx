import { useMemo, useState } from "react";
import { CalendarX, CheckCircle2, CircleHelp, Loader2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../components/ui/dialog";
import { MainFooter } from "../components/layout/MainFooter";
import { MainHeader } from "../components/layout/MainHeader";
import maw3idLogo from "../assets/branding/Maw3idAI.png";
import { toReadableApiError } from "../lib/apiErrors";
import { cancelAppointment, confirmPresence } from "../services/attendanceApi";
import type { AttendanceActionPayload, AttendanceActionResponse, BackendStatus } from "../types/appointment";

type Action = "presence_confirmed" | "appointment_cancelled";

function readReminderParams() {
  const params = new URLSearchParams(window.location.search);
  const metadata: Record<string, string> = {};

  params.forEach((value, key) => {
    if (value.trim()) metadata[key] = value.trim();
  });

  return metadata;
}

function buildPayload(action: Action, metadata: Record<string, string>): AttendanceActionPayload {
  return {
    action,
    source: "reminder_link",
    appointment_id: metadata.appointment_id || metadata.appointmentId,
    request_id: metadata.request_id || metadata.requestId,
    slot_id: metadata.slot_id || metadata.slotId,
    patient_name: metadata.patient_name || metadata.patientName || metadata.name,
    patient_phone: metadata.patient_phone || metadata.patientPhone || metadata.phone,
    patient_email: metadata.patient_email || metadata.patientEmail || metadata.email,
    reminder_id: metadata.reminder_id || metadata.reminderId,
    token: metadata.token,
    submitted_at: new Date().toISOString(),
    metadata,
  };
}

export default function AttendanceResponse() {
  const { t } = useTranslation();
  const metadata = useMemo(readReminderParams, []);
  const appointmentReference = metadata.appointment_id || metadata.appointmentId;
  const reference = appointmentReference || t("presence.missing");
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("idle");
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [response, setResponse] = useState<AttendanceActionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const isSubmitting = backendStatus === "checking";
  const hasValidReference = Boolean(appointmentReference);
  const isCancelled = selectedAction === "appointment_cancelled" && response;
  const isConfirmed = selectedAction === "presence_confirmed" && response;

  async function submit(action: Action) {
    setSelectedAction(action);
    setBackendStatus("checking");
    setError(null);

    try {
      const payload = buildPayload(action, metadata);
      const result = action === "presence_confirmed" ? await confirmPresence(payload) : await cancelAppointment(payload);
      setResponse(result);
      setBackendStatus("available");
      setCancelOpen(false);
      toast.success(result.message);
    } catch (err) {
      const readable = toReadableApiError(err);
      setError(readable.message);
      setBackendStatus("unavailable");
      toast.error(readable.message);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="relative mx-auto grid min-h-[calc(100vh-12rem)] max-w-5xl content-center px-4 py-10 lg:px-8">
        <div className="pointer-events-none absolute left-4 top-16 h-72 w-72 rounded-full bg-medical-sky/60 blur-3xl" />
        <section className="relative overflow-hidden rounded-[2rem] border border-[#C5A76A]/20 bg-[#FCFAF4]/90 p-5 shadow-premium sm:p-8">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A76A]/80 to-transparent" />
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <img src={maw3idLogo} alt={t("brand.name")} className="mb-5 h-16 w-16 rounded-2xl object-contain shadow-sm" />
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-medical-sky text-medical-blue shadow-[0_18px_40px_rgba(21,111,145,0.16)]">
                {isConfirmed ? <CheckCircle2 className="h-9 w-9" /> : isCancelled ? <CalendarX className="h-9 w-9" /> : <CircleHelp className="h-9 w-9" />}
              </div>
              <p className="mt-5 text-sm font-semibold uppercase text-medical-teal">{t("presence.title")}</p>
              <h1 className="mt-3 text-3xl font-bold text-medical-navy sm:text-4xl">
                {isConfirmed ? t("presence.confirmedTitle") : isCancelled ? t("presence.cancelledTitle") : t("presence.title")}
              </h1>
              <p className="mt-4 leading-7 text-slate-700">
                {isConfirmed
                  ? t("presence.confirmedCopy")
                  : isCancelled
                    ? t("presence.cancelledCopy")
                    : hasValidReference
                      ? t("presence.copy")
                      : t("presence.invalidCopy")}
              </p>
              <div className="mt-6 grid gap-3 rounded-lg border border-white/70 bg-white/70 p-4 text-sm shadow-sm">
                <InfoLine label={t("presence.reference")} value={reference} />
                <InfoLine label={t("presence.state")} value={!hasValidReference ? t("presence.incomplete") : response ? response.status : t("presence.waiting")} />
              </div>
            </div>

            <div className="grid gap-4">
              {!hasValidReference ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">{t("presence.invalid")}</div>
              ) : null}

              {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">{error}</div> : null}

              {response ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{response.message}</div>
              ) : null}

              <ActionCard
                icon={CheckCircle2}
                title={t("presence.confirmTitle")}
                description={t("presence.confirmDesc")}
                buttonLabel={t("presence.confirmButton")}
                disabled={!hasValidReference || isSubmitting || Boolean(response)}
                loading={isSubmitting && selectedAction === "presence_confirmed"}
                onClick={() => submit("presence_confirmed")}
              />
              <ActionCard
                icon={CalendarX}
                title={t("presence.cancelTitle")}
                description={t("presence.cancelDesc")}
                buttonLabel={t("presence.cancelButton")}
                variant="danger"
                disabled={!hasValidReference || isSubmitting || Boolean(response)}
                loading={isSubmitting && selectedAction === "appointment_cancelled"}
                onClick={() => setCancelOpen(true)}
              />
            </div>
          </div>
        </section>
      </main>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogTitle className="text-xl font-bold text-medical-navy">{t("presence.modalTitle")}</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">{t("presence.modalDesc")}</DialogDescription>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setCancelOpen(false)} disabled={isSubmitting}>
              {t("presence.back")}
            </Button>
            <Button type="button" variant="danger" onClick={() => submit("appointment_cancelled")} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarX className="h-4 w-4" />}
              {t("presence.modalConfirm")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <MainFooter />
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-medical-navy">{value}</span>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  buttonLabel,
  variant,
  disabled,
  loading,
  onClick,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  buttonLabel: string;
  variant?: "danger";
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <article className="lift-card rounded-lg border border-white/70 bg-background/90 p-5">
      <div className="flex items-start gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${variant === "danger" ? "bg-red-50 text-danger" : "bg-emerald-50 text-success"}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-medical-navy">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p>
        </div>
      </div>
      <Button type="button" size="lg" variant={variant ?? "default"} onClick={onClick} disabled={disabled} className="mt-5 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
        {buttonLabel}
      </Button>
    </article>
  );
}
