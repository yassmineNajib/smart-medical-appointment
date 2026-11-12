import { Activity, HeartPulse, ScanLine, Stethoscope } from "lucide-react";
import type { Specialty } from "../types/appointment";

export const specialties: Array<{
  id: Specialty;
  label: string;
  description: string;
  icon: typeof Stethoscope;
}> = [
  {
    id: "general_medicine",
    label: "General Medicine",
    description: "Initial consultation and orientation toward the most appropriate care pathway.",
    icon: Stethoscope,
  },
  {
    id: "cardiology",
    label: "Cardiologie",
    description: "Specialized consultations for cardiovascular follow-up and care coordination.",
    icon: HeartPulse,
  },
  {
    id: "dermatology",
    label: "Dermatologie",
    description: "Appointments for skin concerns, dermatological follow-up and related conditions.",
    icon: Activity,
  },
  {
    id: "radiology",
    label: "Radiologie",
    description: "Streamlined scheduling for imaging exams and diagnostic appointments.",
    icon: ScanLine,
  },
];
