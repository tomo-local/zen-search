import { createContext, type ReactNode } from "react";
import {
  type i18nState,
  initialState,
  useTranslation,
} from "@/hooks/storage/useTranslation";
import type { LanguageValue } from "@/services/storage";

interface TranslationContextValue extends i18nState {
  setLanguage: (lang: LanguageValue) => void;
}

export const TranslationContext = createContext<TranslationContextValue>({
  ...initialState,
  setLanguage: () => {},
});

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { t, locale, setLanguage } = useTranslation();

  return (
    <TranslationContext.Provider
      value={{
        t,
        locale,
        setLanguage,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;
