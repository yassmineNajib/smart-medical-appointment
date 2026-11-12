import i18n, { getCurrentIntlLocale } from "../i18n";

export function formatFrenchDate(date: string) {
  try {
    return new Intl.DateTimeFormat(getCurrentIntlLocale(), {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  } catch {
    return date;
  }
}

export function formatShortFrenchDate(date: string) {
  try {
    return new Intl.DateTimeFormat(getCurrentIntlLocale(), {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  } catch {
    return date;
  }
}

export function combineDateTime(date: string, time: string) {
  const normalized = time.length === 5 ? `${time}:00` : time;
  return `${date}T${normalized}`;
}

export function getTodayInputValue() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function periodLabel(period: string) {
  const labels: Record<string, string> = {
    morning: i18n.t("form.morning"),
    afternoon: i18n.t("form.afternoon"),
    any: i18n.t("form.any"),
  };
  return labels[period] ?? period;
}
