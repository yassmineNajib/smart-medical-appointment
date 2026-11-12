import { ClipboardList, MessageSquareText } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AppointmentPreferences, Patient } from "../../types/appointment";
import type { Specialty } from "../../types/appointment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { StructuredAppointmentForm } from "./StructuredAppointmentForm";
import { TextAppointmentForm } from "./TextAppointmentForm";

export function AppointmentTabs({
  activeTab,
  onTabChange,
  onStructuredSubmit,
  onTextSubmit,
  isLoading,
  validationErrors,
  initialSpecialty,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onStructuredSubmit: (patient: Patient, preferences: AppointmentPreferences) => void;
  onTextSubmit: (message: string) => void;
  isLoading: boolean;
  validationErrors?: Array<{ field: string; message: string }>;
  initialSpecialty?: Specialty;
}) {
  const { t } = useTranslation();
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid-cols-2">
        <TabsTrigger value="form" className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          {t("appointment.tabs.form")}
        </TabsTrigger>
        <TabsTrigger value="text" className="flex items-center gap-2">
          <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          {t("appointment.tabs.text")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="form">
        <StructuredAppointmentForm
          onSubmit={onStructuredSubmit}
          isLoading={isLoading}
          validationErrors={validationErrors}
          initialSpecialty={initialSpecialty}
        />
      </TabsContent>
      <TabsContent value="text">
        <TextAppointmentForm onSubmit={onTextSubmit} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
}
