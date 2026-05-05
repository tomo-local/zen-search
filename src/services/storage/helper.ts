/**
 * Storage Helper - Chrome storage関連のヘルパー関数
 */

import type {
  SearchEngineValue,
  SyncStorage,
  SyncStorageKey,
  ThemeValue,
  ViewModeValue,
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
 * デフォルト表示モード値を取得
 */
export const getDefaultViewMode = (): ViewModeValue => "popup";

/**
 * 表示モード値のバリデーション
 */
export const isValidViewMode = (value: unknown): value is ViewModeValue => {
  return ["popup", "sidepanel"].includes(value as string);
};

const VALID_SEARCH_ENGINES: SearchEngineValue[] = [
  "google",
  "bing",
  "duckduckgo",
  "brave",
  "ecosia",
  "yahoo_japan",
  "perplexity",
];

/**
 * デフォルト有効検索エンジン一覧を取得
 */
export const getDefaultSearchEngines = (): SearchEngineValue[] => ["google"];

/**
 * 検索エンジン値のバリデーション（単体）
 */
export const isValidSearchEngine = (
  value: unknown,
): value is SearchEngineValue => {
  return VALID_SEARCH_ENGINES.includes(value as SearchEngineValue);
};

/**
 * 検索エンジン配列のバリデーション
 */
export const isValidSearchEngines = (
  value: unknown,
): value is SearchEngineValue[] => {
  return (
    Array.isArray(value) && value.length > 0 && value.every(isValidSearchEngine)
  );
};
