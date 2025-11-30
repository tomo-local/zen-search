/**
 * Storage Helper - Chrome storage関連のヘルパー関数
 */

import type * as Type from "./types";

export const localStorageGet = <K extends Type.LocalStorageKey>(
  key: K,
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(result[key] || null);
    });
  });
};

export const localStorageSet = <K extends Type.LocalStorageKey>(
  key: K,
  value: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(true);
    });
  });
};

/**
 * Promise化されたchrome.storage.sync.get
 */
export const syncStorageGet = <K extends Type.SyncStorageKey>(
  key: K,
): Promise<Type.SyncStorage[K] | undefined> => {
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
export const syncStorageSet = <K extends Type.SyncStorageKey>(
  key: K,
  value: Type.SyncStorage[K],
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
export const getDefaultTheme = (): Type.ThemeValue => "system";

/**
 * テーマ値のバリデーション
 */
export const isValidTheme = (value: unknown): value is Type.ThemeValue => {
  return ["light", "dark", "system"].includes(value as string);
};

/**
 * ウィンドウのダークモード設定を取得
 */
export const isWindowDarkMode = (): boolean => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches;
};

export const isValidAppValue = (
  value: unknown,
): value is Type.AppQueryValue => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const query = (value as Type.AppQueryValue).query;
  if (typeof query !== "object" || query === null) {
    return false;
  }
  if (typeof query.string !== "string") {
    return false;
  }
  if (typeof query.lastTimestamp !== "number") {
    return false;
  }
  return true;
};

export const getDefaultAppValue = (): Type.AppQueryValue => {
  return {
    query: {
      string: "",
      lastTimestamp: 0,
    },
  };
};
