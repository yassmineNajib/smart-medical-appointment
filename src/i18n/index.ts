import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const LANGUAGE_STORAGE_KEY = "maw3idai_language";

export const supportedLanguages = [
  { code: "fr", label: "FR", locale: "fr-FR", dir: "ltr" },
  { code: "en", label: "EN", locale: "en-GB", dir: "ltr" },
  { code: "ar", label: "العربية", locale: "ar-MA", dir: "rtl" },
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number]["code"];

function readInitialLanguage() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return supportedLanguages.some((language) => language.code === saved) ? saved ?? "fr" : "fr";
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: readInitialLanguage(),
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export function applyLanguageAttributes(languageCode: string) {
  const language = supportedLanguages.find((item) => item.code === languageCode) ?? supportedLanguages[0];
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.dir;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
}

applyLanguageAttributes(i18n.language);

i18n.on("languageChanged", applyLanguageAttributes);

export function getCurrentIntlLocale() {
  return supportedLanguages.find((language) => language.code === i18n.language)?.locale ?? "fr-FR";
}

export default i18n;
