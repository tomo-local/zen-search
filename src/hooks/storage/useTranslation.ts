import { useEffect, useReducer } from "react";
import { i18n } from "@/lib/i18n";
import { type LanguageValue, storageService } from "@/services/storage";
import en from "../../locales/en.json";
import ja from "../../locales/ja.json";

export interface i18nState {
  t: (key: string) => string;
  locale: LanguageValue;
}

interface Action {
  type: "SET_LOCALE";
  payload: LanguageValue;
}

// 初期状態はブラウザーの言語設定に従う
export const initialState: i18nState = {
  t: i18n.t,
  locale: "system",
};

const translations = {
  ja,
  en,
} as const;

// ローカルトランスレーター作成
const createLocalTranslator = (locale: Exclude<LanguageValue, "system">) => {
  const messages = translations[locale];

  return (key: string): string => {
    const keys = key.split(".");
    let value: unknown = messages;

    for (const k of keys) {
      if (
        value &&
        typeof value === "object" &&
        k in (value as Record<string, unknown>)
      ) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };
};

function i18nReducer(state: i18nState, action: Action): i18nState {
  switch (action.type) {
    case "SET_LOCALE": {
      const locale = action.payload;

      storageService.setLanguage({ language: locale });

      if (locale === "system") {
        return {
          t: i18n.t,
          locale,
        };
      }

      return {
        t: createLocalTranslator(locale),
        locale,
      };
    }
    default:
      return state;
  }
}

export const useTranslation = () => {
  const [{ t, locale }, dispatch] = useReducer(i18nReducer, initialState);

  useEffect(() => {
    const fetchLocale = async () => {
      const storedLanguage = await storageService.getLanguage();
      dispatch({ type: "SET_LOCALE", payload: storedLanguage });
    };
    fetchLocale();
  }, []);

  return {
    t,
    locale,
    setLanguage: (language: LanguageValue) => {
      dispatch({ type: "SET_LOCALE", payload: language });
    },
  };
};
