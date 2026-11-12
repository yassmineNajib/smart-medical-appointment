import { AppointmentApiError, SERVICE_UNAVAILABLE_MESSAGE, toReadableApiError } from "../lib/apiErrors";
import { safeResponseParser } from "../lib/responseParser";
import type { AttendanceActionPayload, AttendanceActionResponse } from "../types/appointment";

const ENDPOINTS = {
  confirmPresence: import.meta.env.VITE_CONFIRM_PRESENCE_URL,
  cancelAppointment: import.meta.env.VITE_CANCEL_APPOINTMENT_URL,
};

const DEV_PROXY_ENDPOINTS = {
  confirmPresence: "/api/confirm-presence",
  cancelAppointment: "/api/cancel-appointment",
};

function readBackendMessage(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.message === "string"
    ? candidate.message
    : typeof candidate.error === "string"
      ? candidate.error
      : undefined;
}

function resolveEndpoint(endpoint: string, devProxyEndpoint: string) {
  return import.meta.env.DEV ? devProxyEndpoint : endpoint;
}

async function postAttendanceAction(
  endpoint: string,
  devProxyEndpoint: string,
  payload: AttendanceActionPayload,
): Promise<AttendanceActionResponse> {
  try {
    const response = await fetch(resolveEndpoint(endpoint, devProxyEndpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type") ?? "";
    const raw = contentType.includes("application/json") ? await response.json() : await response.text();
    const parsed = safeResponseParser<AttendanceActionResponse>(raw);

    if (!response.ok) {
      const backendMessage = readBackendMessage(parsed);
      throw new AppointmentApiError(
        backendMessage ? `Webhook erreur ${response.status}: ${backendMessage}` : SERVICE_UNAVAILABLE_MESSAGE,
        { status: response.status },
      );
    }

    return {
      ...parsed,
      success: Boolean(parsed.success ?? true),
      status: String(parsed.status ?? "received"),
      message: String(parsed.message ?? "Votre réponse a bien été envoyée."),
    };
  } catch (error) {
    throw toReadableApiError(error);
  }
}

export function confirmPresence(payload: AttendanceActionPayload) {
  return postAttendanceAction(ENDPOINTS.confirmPresence, DEV_PROXY_ENDPOINTS.confirmPresence, payload);
}

export function cancelAppointment(payload: AttendanceActionPayload) {
  return postAttendanceAction(ENDPOINTS.cancelAppointment, DEV_PROXY_ENDPOINTS.cancelAppointment, payload);
}
