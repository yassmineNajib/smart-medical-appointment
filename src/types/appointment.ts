export type Specialty = "general_medicine" | "cardiology" | "dermatology" | "radiology";

export type PreferredPeriod = "morning" | "afternoon" | "any";

export type BackendStatus = "idle" | "checking" | "available" | "unavailable";

export interface Patient {
  full_name: string;
  phone: string;
  email?: string;
}

export interface AppointmentPreferences {
  specialty: Specialty;
  preferred_date: string;
  preferred_period: PreferredPeriod;
}

export interface AppointmentSlot {
  slot_id: string;
  specialty: string;
  specialty_label: string;
  department: string;
  doctor_name: string;
  date: string;
  start_time: string;
  end_time: string;
  period: string;
  status: string;
  difference?: string;
}

export interface SearchResponse {
  success: boolean;
  slots_found?: boolean;
  alternatives_found?: boolean;
  status: string;
  match_type: "exact" | "alternative" | "none";
  count: number;
  message: string;
  slots: AppointmentSlot[];
  request_id?: string;
  missing_fields?: string[];
  errors?: Array<{
    field: string;
    message: string;
  }>;
  questions?: Array<{
    field: string;
    question: string;
  }>;
  patient?: Patient;
  preferences?: AppointmentPreferences;
}

export interface SearchSlotsPayload {
  source: "form";
  patient: Patient;
  preferences: AppointmentPreferences;
}

export interface TextRequestPayload {
  source: "text";
  message: string;
}

export interface ConfirmAppointmentPayload {
  request_id: string;
  slot_id: string;
  patient: Patient;
}

export interface ConfirmedAppointment {
  appointment_id: string;
  request_id: string;
  slot_id: string;
  patient: Patient;
  specialty: string;
  specialty_label: string;
  department: string;
  doctor_name: string;
  date: string;
  start_time: string;
  end_time: string;
  period: string;
  status: string;
  reminder_status?: string;
}

export interface ConfirmationResponse {
  success: boolean;
  status: string;
  code?: string;
  message: string;
  appointment?: ConfirmedAppointment;
  instructions?: string[];
  reminder_scheduled?: boolean;
  errors?: Array<{ field: string; message: string }>;
}

export interface AttendanceActionPayload {
  action: "presence_confirmed" | "appointment_cancelled";
  source: "reminder_link";
  appointment_id?: string;
  request_id?: string;
  slot_id?: string;
  patient_name?: string;
  patient_phone?: string;
  patient_email?: string;
  reminder_id?: string;
  token?: string;
  submitted_at: string;
  metadata: Record<string, string>;
}

export interface AttendanceActionResponse {
  success: boolean;
  status: string;
  message: string;
  [key: string]: unknown;
}

export interface ApiDebugInfo {
  endpoint: string;
  normalizedEndpoint: string;
  payload: unknown;
  responseStatus?: number | string;
  parsedResponse?: unknown;
}

export interface MissingAnswer {
  field: string;
  value: string;
}
