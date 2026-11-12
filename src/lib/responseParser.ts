import type { ConfirmationResponse, Patient, SearchResponse } from "../types/appointment";

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function safeResponseParser<T = unknown>(raw: unknown): T {
  if (typeof raw === "string") {
    const parsed = tryParseJson(raw);
    if (typeof parsed === "string") {
      return {
        success: false,
        status: "message",
        match_type: "none",
        count: 0,
        message: parsed,
        slots: [],
      } as T;
    }
    return safeResponseParser<T>(parsed);
  }

  if (raw && typeof raw === "object") {
    const candidate = raw as Record<string, unknown>;
    if ("data" in candidate) {
      return safeResponseParser<T>(candidate.data);
    }
    if ("body" in candidate) {
      return safeResponseParser<T>(candidate.body);
    }
    if ("response" in candidate) {
      return safeResponseParser<T>(candidate.response);
    }
    return candidate as T;
  }

  return {
    success: false,
    status: "empty_response",
    match_type: "none",
    count: 0,
    message: "Réponse indisponible.",
    slots: [],
  } as T;
}

function readString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function normalizePatient(raw: unknown): Patient | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  const source = raw as Record<string, unknown>;
  const fullName = readString(source, ["full_name", "fullName", "name", "patient_name", "nom", "nom_complet"]);
  const phone = readString(source, ["phone", "phone_number", "telephone", "tel", "mobile", "numero", "numéro"]);
  const email = readString(source, ["email", "mail"]);

  if (!fullName && !phone && !email) return undefined;

  return {
    full_name: fullName ?? "Patient non renseigné",
    phone: phone ?? "Non renseigné",
    email,
  };
}

function findPatient(parsed: Record<string, unknown>) {
  const directPatient = normalizePatient(parsed.patient);
  if (directPatient) return directPatient;

  const patientKeys = ["patient_info", "patientInfo", "extracted_patient", "extractedPatient"];
  for (const key of patientKeys) {
    const patient = normalizePatient(parsed[key]);
    if (patient) return patient;
  }

  const nestedKeys = ["extracted_data", "extractedData", "metadata"];
  for (const key of nestedKeys) {
    const nested = parsed[key];
    if (nested && typeof nested === "object") {
      const patient = normalizePatient((nested as Record<string, unknown>).patient);
      if (patient) return patient;
    }
  }

  return normalizePatient(parsed);
}

export function normalizeSearchResponse(raw: unknown): SearchResponse {
  const parsed = safeResponseParser<Partial<SearchResponse>>(raw);
  const parsedRecord = parsed as Record<string, unknown>;
  const slots = Array.isArray(parsed.slots) ? parsed.slots : [];
  const inferredMatch =
    parsed.match_type ??
    (parsed.status === "alternative_slots_available" ? "alternative" : slots.length > 0 ? "exact" : "none");

  return {
    success: Boolean(parsed.success ?? slots.length > 0),
    status: String(parsed.status ?? (slots.length > 0 ? "slots_available" : "no_slots_available")),
    match_type: inferredMatch,
    count: Number(parsed.count ?? slots.length),
    message: String(parsed.message ?? ""),
    slots,
    slots_found: parsed.slots_found,
    alternatives_found: parsed.alternatives_found,
    request_id: parsed.request_id,
    missing_fields: parsed.missing_fields,
    errors: parsed.errors,
    questions: parsed.questions,
    patient: findPatient(parsedRecord),
    preferences: parsed.preferences,
  };
}

export function normalizeConfirmationResponse(raw: unknown): ConfirmationResponse {
  const parsed = safeResponseParser<Partial<ConfirmationResponse>>(raw);

  return {
    success: Boolean(parsed.success),
    status: String(parsed.status ?? "unknown"),
    code: parsed.code,
    message: String(parsed.message ?? "Réponse reçue."),
    appointment: parsed.appointment,
    instructions: parsed.instructions,
    reminder_scheduled: parsed.reminder_scheduled,
    errors: parsed.errors,
  };
}
