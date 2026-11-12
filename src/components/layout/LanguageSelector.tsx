import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../../i18n";

export function LanguageSelector({ onSelect }: { onSelect?: () => void }) {
  const { i18n, t } = useTranslation();

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-[#DED8CD] bg-[#FCFAF4]/80 px-2 py-1 text-xs font-bold text-medical-navy shadow-sm">
      <span className="sr-only">{t("language.label")}</span>
      <select
        className="bg-transparent px-2 py-1 text-xs font-bold text-medical-navy outline-none focus-visible:ring-2 focus-visible:ring-medical-teal"
        value={i18n.language}
        onChange={(event) => {
          i18n.changeLanguage(event.target.value);
          onSelect?.();
        }}
        aria-label={t("language.label")}
      >
        {supportedLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
