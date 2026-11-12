export class AppointmentApiError extends Error {
  status?: number;
  code?: string;
  fieldErrors?: Array<{ field: string; message: string }>;

  constructor(message: string, options?: { status?: number; code?: string; fieldErrors?: Array<{ field: string; message: string }> }) {
    super(message);
    this.name = "AppointmentApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.fieldErrors = options?.fieldErrors;
  }
}

export const SERVICE_UNAVAILABLE_MESSAGE =
  "Le service de rendez-vous est temporairement indisponible. Veuillez reessayer.";

export const REQUEST_TIMEOUT_MESSAGE =
  "Le traitement prend plus de temps que prevu. Veuillez patienter puis reessayer si aucun resultat n'apparait.";

export function toReadableApiError(error: unknown) {
  if (error instanceof AppointmentApiError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return new AppointmentApiError(REQUEST_TIMEOUT_MESSAGE, { code: "TIMEOUT" });
  }

  if (error instanceof Error) {
    return new AppointmentApiError(SERVICE_UNAVAILABLE_MESSAGE, { code: error.name });
  }

  return new AppointmentApiError(SERVICE_UNAVAILABLE_MESSAGE);
}
