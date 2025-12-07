/**
 * Storage Helper - Chrome storage関連のヘルパー関数
 */

import type {
  LanguageValue,
  SyncStorage,
  SyncStorageKey,
  ThemeValue,
} from "./types";

/**
 * Promise化されたchrome.storage.sync.get
 */
export const chromeStorageGet = <K extends SyncStorageKey>(
  key: K,
): Promise<SyncStorage[K] | undefined> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(result[key]);
    });
  });
};

/**
 * Promise化されたchrome.storage.sync.set
 */
export const chromeStorageSet = <K extends SyncStorageKey>(
  key: K,
  value: SyncStorage[K],
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(true);
    });
  });
};

/**
 * デフォルトテーマ値を取得
 */
export const getDefaultTheme = (): ThemeValue => "system";

/**
 * テーマ値のバリデーション
 */
export const isValidTheme = (value: unknown): value is ThemeValue => {
  return ["light", "dark", "system"].includes(value as string);
};

/**
 * ウィンドウのダークモード設定を取得
 */
export const isWindowDarkMode = (): boolean => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches;
};
/**
 * デフォルト言語値を取得
 */
export const getDefaultLanguage = (): LanguageValue => "system";

/**
 * 言語値のバリデーション
 */
export const isValidLanguage = (value: unknown): value is LanguageValue => {
  return ["en", "ja", "system"].includes(value as string);
};
