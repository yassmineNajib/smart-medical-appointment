import { AppointmentApiError, SERVICE_UNAVAILABLE_MESSAGE, toReadableApiError } from "../lib/apiErrors";
import { normalizeConfirmationResponse, normalizeSearchResponse, safeResponseParser } from "../lib/responseParser";
import { normalizeWebhookUrl } from "../lib/webhookUrl";
import type {
  ApiDebugInfo,
  ConfirmationResponse,
  ConfirmAppointmentPayload,
  SearchResponse,
  SearchSlotsPayload,
} from "../types/appointment";

const ENDPOINTS = {
  search: import.meta.env.VITE_SEARCH_SLOTS_URL,
  confirm: import.meta.env.VITE_CONFIRM_APPOINTMENT_URL,
  text: import.meta.env.VITE_TEXT_APPOINTMENT_URL,
};

const TEXT_APPOINTMENT_PROXY_PATH = "/api/text-appointment";
const DEFAULT_REQUEST_TIMEOUT_MS = 600_000;
const DEFAULT_TEXT_REQUEST_TIMEOUT_MS = 0;

function readTimeoutMs(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

const REQUEST_TIMEOUTS = {
  default: readTimeoutMs(import.meta.env.VITE_API_TIMEOUT_MS, DEFAULT_REQUEST_TIMEOUT_MS),
  text: readTimeoutMs(import.meta.env.VITE_TEXT_APPOINTMENT_TIMEOUT_MS, DEFAULT_TEXT_REQUEST_TIMEOUT_MS),
};

function resolveEndpoint(url: string) {
  const normalized = normalizeWebhookUrl(url);

  if (import.meta.env.DEV && url === ENDPOINTS.text) {
    return TEXT_APPOINTMENT_PROXY_PATH;
  }

  if (import.meta.env.DEV) {
    try {
      return new URL(normalized).pathname;
    } catch {
      return normalized;
    }
  }

  return normalized;
}

type RequestOptions = {
  timeoutMs?: number;
  retryNetwork?: boolean;
  onDebug?: (debug: ApiDebugInfo) => void;
};

async function postJson<T>(endpoint: string, payload: unknown, options: RequestOptions): Promise<T> {
  const normalizedEndpoint = resolveEndpoint(endpoint);
  let attempt = 0;
  const maxAttempts = options.retryNetwork ? 2 : 1;

  while (attempt < maxAttempts) {
    attempt += 1;
    const shouldTimeout = typeof options.timeoutMs === "number" && options.timeoutMs > 0;
    const controller = shouldTimeout ? new AbortController() : undefined;
    const timeoutId = shouldTimeout ? window.setTimeout(() => controller?.abort(), options.timeoutMs) : undefined;

    try {
      const response = await fetch(normalizedEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller?.signal,
      });

      const contentType = response.headers.get("content-type") ?? "";
      const raw = contentType.includes("application/json") ? await response.json() : await response.text();
      const parsed = safeResponseParser<T>(raw);
      options.onDebug?.({
        endpoint,
        normalizedEndpoint,
        payload,
        responseStatus: response.status,
        parsedResponse: parsed,
      });

      if (!response.ok) {
        const maybeError = parsed as { message?: string; errors?: Array<{ field: string; message: string }> };
        throw new AppointmentApiError(maybeError.message || SERVICE_UNAVAILABLE_MESSAGE, {
          status: response.status,
          fieldErrors: maybeError.errors,
        });
      }

      return parsed;
    } catch (error) {
      if (attempt >= maxAttempts || error instanceof AppointmentApiError) {
        options.onDebug?.({
          endpoint,
          normalizedEndpoint,
          payload,
          responseStatus: error instanceof AppointmentApiError ? error.status : "network_error",
          parsedResponse: error instanceof Error ? error.message : error,
        });
        throw toReadableApiError(error);
      }
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
    }
  }

  throw new AppointmentApiError(SERVICE_UNAVAILABLE_MESSAGE);
}

export async function searchSlots(payload: SearchSlotsPayload, onDebug?: (debug: ApiDebugInfo) => void): Promise<SearchResponse> {
  const raw = await postJson<SearchResponse>(ENDPOINTS.search, payload, {
    timeoutMs: REQUEST_TIMEOUTS.default,
    retryNetwork: true,
    onDebug,
  });
  return normalizeSearchResponse(raw);
}

export async function searchFromText(message: string, onDebug?: (debug: ApiDebugInfo) => void): Promise<SearchResponse> {
  const raw = await postJson<SearchResponse>(
    ENDPOINTS.text,
    {
      source: "text",
      message,
    },
    {
      timeoutMs: REQUEST_TIMEOUTS.text,
      retryNetwork: false,
      onDebug,
    },
  );
  return normalizeSearchResponse(raw);
}

export async function confirmAppointment(
  payload: ConfirmAppointmentPayload,
  onDebug?: (debug: ApiDebugInfo) => void,
): Promise<ConfirmationResponse> {
  const raw = await postJson<ConfirmationResponse>(ENDPOINTS.confirm, payload, {
    timeoutMs: REQUEST_TIMEOUTS.default,
    retryNetwork: false,
    onDebug,
  });
  return normalizeConfirmationResponse(raw);
}

export const appointmentEndpoints = {
  search: ENDPOINTS.search,
  confirm: ENDPOINTS.confirm,
  text: ENDPOINTS.text,
  normalizedSearch: resolveEndpoint(ENDPOINTS.search),
  normalizedConfirm: resolveEndpoint(ENDPOINTS.confirm),
  normalizedText: resolveEndpoint(ENDPOINTS.text),
};
