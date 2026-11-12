import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function MissingInformationPanel({
  questions,
  onSubmit,
}: {
  questions: Array<{ field: string; question: string }>;
  onSubmit: (answers: Record<string, string>) => void;
}) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="border-amber-200">
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
          {t("appointment.additionalInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {questions.map((question) => (
            <label key={question.field} className="grid gap-2 text-sm font-semibold text-amber-950">
              {question.question}
              <input
                className="input bg-white"
                value={answers[question.field] ?? ""}
                onChange={(event) => setAnswers((current) => ({ ...current, [question.field]: event.target.value }))}
              />
            </label>
          ))}
          <Button type="button" onClick={() => onSubmit(answers)}>
            {t("appointment.sendInfo")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
