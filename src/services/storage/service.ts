/**
 * Storage Service - マイクロサービス形式のChrome storage管理サービス
 * 責任: Chrome storage sync APIの抽象化を担当
 */

import { convertAppQueryToString, convertStringToAppQuery } from "./converter";
import {
  getDefaultAppValue,
  getDefaultTheme,
  localStorageGet,
  localStorageSet,
  syncStorageGet,
  syncStorageSet,
} from "./helper";
import type * as Type from "./types";
import { LocalStorageKey, SyncStorageKey } from "./types";

// 型定義
export interface StorageService {
  getTheme: () => Promise<Type.ThemeValue>;
  setTheme: (request: Type.SetThemeRequest) => Promise<boolean>;
  getAppQuery: () => Promise<Type.AppQueryValue>;
  setAppQuery: (value: Type.AppQueryValue) => Promise<boolean>;
}

const getAppQuery = async (): Promise<Type.AppQueryValue> => {
  const appValue = await localStorageGet(LocalStorageKey.AppQuery);

  if (appValue === null) {
    const defaultAppValue = getDefaultAppValue();
    await localStorageSet(
      LocalStorageKey.AppQuery,
      JSON.stringify(defaultAppValue),
    );
    return defaultAppValue;
  }

  try {
    return convertStringToAppQuery(appValue);
  } catch (error) {
    console.error("Failed to get app query:", error);
    // エラー時はデフォルト値を返す
    return getDefaultAppValue();
  }
};

const setAppQuery = async (value: Type.AppQueryValue): Promise<boolean> => {
  try {
    const str = convertAppQueryToString(value);

    return await localStorageSet(LocalStorageKey.AppQuery, str);
  } catch (error) {
    console.error("Failed to set app query:", error);
    throw new Error("アプリクエリの保存に失敗しました");
  }
};

const getTheme = async (): Promise<Type.ThemeValue> => {
  try {
    const theme = await syncStorageGet(SyncStorageKey.Theme);
    return theme || getDefaultTheme();
  } catch (error) {
    console.error("Failed to get theme:", error);
    // エラー時はデフォルトテーマを返す
    return getDefaultTheme();
  }
};

const setTheme = async ({ theme }: Type.SetThemeRequest): Promise<boolean> => {
  try {
    return await syncStorageSet(SyncStorageKey.Theme, theme);
  } catch (error) {
    console.error("Failed to set theme:", error);
    throw new Error("テーマの保存に失敗しました");
  }
};

// サービスオブジェクトのエクスポート
export const storageService: StorageService = {
  getAppQuery,
  setAppQuery,
  getTheme,
  setTheme,
};

// デフォルトエクスポート
export default storageService;
