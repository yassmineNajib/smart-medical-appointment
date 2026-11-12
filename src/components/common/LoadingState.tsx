import { Loader2 } from "lucide-react";

export function LoadingState({ label, steps, activeStep }: { label: string; steps?: string[]; activeStep?: number }) {
  return (
    <div className="premium-surface p-5" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-medical-navy">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-medical-sky text-medical-teal">
          <span className="absolute inset-0 rounded-full bg-medical-teal/20 animate-ping" />
          <Loader2 className="relative h-5 w-5 animate-spin" aria-hidden="true" />
        </span>
        <span className="font-semibold">{label}</span>
      </div>
      {steps ? (
        <ol className="mt-4 grid gap-2 text-sm text-muted-foreground">
          {steps.map((step, index) => (
            <li key={step} className={index === activeStep ? "font-semibold text-medical-blue" : ""}>
              {step}
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
        </div>
      )}
    </div>
  );
}
