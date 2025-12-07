/**
 * Storage Service - マイクロサービス形式のChrome storage管理サービス
 * 責任: Chrome storage sync APIの抽象化を担当
 */

import {
  chromeStorageGet,
  chromeStorageSet,
  getDefaultLanguage,
  getDefaultTheme,
} from "./helper";
import type * as Type from "./types";
import { SyncStorageKey } from "./types";

// 型定義
export interface StorageService {
  get: <K extends Type.SyncStorageKey>(
    request: Type.GetStorageRequest<K>
  ) => Promise<Type.SyncStorage[K] | undefined>;
  set: <K extends Type.SyncStorageKey>(
    request: Type.SetStorageRequest<K>
  ) => Promise<boolean>;
  getTheme: () => Promise<Type.ThemeValue>;
  setTheme: (request: Type.SetThemeRequest) => Promise<boolean>;
  getLanguage: () => Promise<Type.LanguageValue>;
  setLanguage: (request: Type.SetLanguageRequest) => Promise<boolean>;
}

// サービス実装
const getStorage = async <K extends Type.SyncStorageKey>({
  key,
}: Type.GetStorageRequest<K>): Promise<Type.SyncStorage[K] | undefined> => {
  try {
    return await chromeStorageGet(key);
  } catch (error) {
    console.error(`Failed to get storage for key ${key}:`, error);
    throw new Error(`ストレージの取得に失敗しました: ${key}`);
  }
};

const setStorage = async <K extends Type.SyncStorageKey>({
  key,
  value,
}: Type.SetStorageRequest<K>): Promise<boolean> => {
  try {
    return await chromeStorageSet(key, value);
  } catch (error) {
    console.error(`Failed to set storage for key ${key}:`, error);
    throw new Error(`ストレージの保存に失敗しました: ${key}`);
  }
};

const getTheme = async (): Promise<Type.ThemeValue> => {
  try {
    const theme = await chromeStorageGet(SyncStorageKey.Theme);
    return theme || getDefaultTheme();
  } catch (error) {
    console.error("Failed to get theme:", error);
    // エラー時はデフォルトテーマを返す
    return getDefaultTheme();
  }
};

const setTheme = async ({ theme }: Type.SetThemeRequest): Promise<boolean> => {
  try {
    return await chromeStorageSet(SyncStorageKey.Theme, theme);
  } catch (error) {
    console.error("Failed to set theme:", error);
    throw new Error("テーマの保存に失敗しました");
  }
};

const getLanguage = async (): Promise<Type.LanguageValue> => {
  try {
    const language = await chromeStorageGet(SyncStorageKey.Language);
    return language || getDefaultLanguage();
  } catch (error) {
    console.error("Failed to get language:", error);
    // エラー時はデフォルト言語を返す
    return getDefaultLanguage();
  }
};

const setLanguage = async ({
  language,
}: Type.SetLanguageRequest): Promise<boolean> => {
  try {
    return await chromeStorageSet(SyncStorageKey.Language, language);
  } catch (error) {
    console.error("Failed to set language:", error);
    throw new Error("言語の保存に失敗しました");
  }
};

// サービスオブジェクトのエクスポート
export const storageService: StorageService = {
  get: getStorage,
  set: setStorage,
  getTheme,
  setTheme,
  getLanguage,
  setLanguage,
};

// デフォルトエクスポート
export default storageService;
