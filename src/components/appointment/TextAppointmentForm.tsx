import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function createSchema(t: (key: string) => string) {
  return z.object({
    message: z.string().min(15, t("textForm.error")),
  });
}

export function TextAppointmentForm({ onSubmit, isLoading }: { onSubmit: (message: string) => void; isLoading: boolean }) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ message: string }>({
    resolver: zodResolver(createSchema(t)),
    defaultValues: {
      message: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("textForm.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit((values) => onSubmit(values.message))} noValidate>
          <label className="grid gap-2 text-sm font-semibold text-medical-navy">
            {t("textForm.label")}
            <textarea className="input min-h-40 resize-y" placeholder={t("textForm.placeholder")} {...register("message")} />
            {errors.message ? <span className="text-sm font-medium text-red-700">{errors.message.message}</span> : null}
          </label>
          <p className="text-sm text-muted-foreground">{t("textForm.helper")}</p>
          <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {t("textForm.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
