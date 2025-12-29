/**
 * Storage Service - マイクロサービス形式のChrome storage管理サービス
 * 責任: Chrome storage sync APIの抽象化を担当
 */

import { chromeStorageGet, chromeStorageSet, getDefaultTheme } from "./helper";
import type * as Type from "./types";
import { SyncStorageKey } from "./types";

// 型定義
export interface StorageService {
  get: <K extends Type.SyncStorageKey>(
    request: Type.GetStorageRequest<K>,
  ) => Promise<Type.SyncStorage[K] | undefined>;
  set: <K extends Type.SyncStorageKey>(
    request: Type.SetStorageRequest<K>,
  ) => Promise<boolean>;
  subscribe: <K extends Type.SyncStorageKey>(
    key: K,
    callback: (value: Type.SyncStorage[K] | undefined) => void,
  ) => () => void;
  getTheme: () => Promise<Type.ThemeValue>;
  setTheme: (request: Type.SetThemeRequest) => Promise<boolean>;
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

const subscribeStorage = <K extends Type.SyncStorageKey>(
  key: K,
  callback: (value: Type.SyncStorage[K] | undefined) => void,
): (() => void) => {
  const handler = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string,
  ) => {
    if (areaName !== "sync") return;
    const change = changes[key];
    if (!change) return;
    callback(change.newValue as Type.SyncStorage[K] | undefined);
  };
  chrome.storage.onChanged.addListener(handler);
  return () => chrome.storage.onChanged.removeListener(handler);
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

// サービスオブジェクトのエクスポート
export const storageService: StorageService = {
  get: getStorage,
  set: setStorage,
  subscribe: subscribeStorage,
  getTheme,
  setTheme,
};

// デフォルトエクスポート
export default storageService;
