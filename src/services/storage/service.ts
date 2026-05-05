/**
 * Storage Service - マイクロサービス形式のChrome storage管理サービス
 * 責任: Chrome storage sync APIの抽象化を担当
 */

import {
  chromeStorageGet,
  chromeStorageSet,
  getDefaultSearchEngines,
  getDefaultTheme,
  getDefaultViewMode,
  isValidSearchEngines,
  isValidViewMode,
} from "./helper";
import type { StorageService } from "./interface";
import { logger, StorageServiceError, toError } from "./internal";
import type * as Type from "./types";
import { SyncStorageKey } from "./types";

// サービス実装
const getStorage = async <K extends Type.SyncStorageKey>({
  key,
}: Type.GetStorageRequest<K>): Promise<Type.SyncStorage[K] | undefined> => {
  try {
    return await chromeStorageGet(key);
  } catch (error) {
    logger.warn(`get(${key}) failed`, { error });
    throw new StorageServiceError(
      `Failed to get storage: ${key}`,
      toError(error),
    );
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
    logger.warn(`set(${key}) failed`, { error });
    throw new StorageServiceError(
      `Failed to set storage: ${key}`,
      toError(error),
    );
  }
};

const getTheme = async (): Promise<Type.ThemeValue> => {
  try {
    const theme = await chromeStorageGet(SyncStorageKey.Theme);
    return theme || getDefaultTheme();
  } catch (error) {
    logger.warn("getTheme failed", { error });
    return getDefaultTheme();
  }
};

const setTheme = async ({ theme }: Type.SetThemeRequest): Promise<boolean> => {
  try {
    return await chromeStorageSet(SyncStorageKey.Theme, theme);
  } catch (error) {
    logger.warn("setTheme failed", { error });
    throw new StorageServiceError("Failed to save theme", toError(error));
  }
};

const getViewMode = async (): Promise<Type.ViewModeValue> => {
  try {
    const viewMode = await chromeStorageGet(SyncStorageKey.ViewMode);
    return isValidViewMode(viewMode) ? viewMode : getDefaultViewMode();
  } catch (error) {
    logger.warn("getViewMode failed", { error });
    return getDefaultViewMode();
  }
};

const setViewMode = async (viewMode: Type.ViewModeValue): Promise<boolean> => {
  try {
    return await chromeStorageSet(SyncStorageKey.ViewMode, viewMode);
  } catch (error) {
    logger.warn("setViewMode failed", { error });
    throw new StorageServiceError("Failed to save view mode", toError(error));
  }
};

const getSearchEngines = async (): Promise<Type.SearchEngineValue[]> => {
  try {
    const engines = await chromeStorageGet(SyncStorageKey.SearchEngines);
    return isValidSearchEngines(engines) ? engines : getDefaultSearchEngines();
  } catch (error) {
    logger.warn("getSearchEngines failed", { error });
    return getDefaultSearchEngines();
  }
};

const setSearchEngines = async (
  engines: Type.SearchEngineValue[],
): Promise<boolean> => {
  try {
    return await chromeStorageSet(SyncStorageKey.SearchEngines, engines);
  } catch (error) {
    logger.warn("setSearchEngines failed", { error });
    throw new StorageServiceError(
      "Failed to save search engines",
      toError(error),
    );
  }
};

// サービスオブジェクトのエクスポート
const createStorageService = (): StorageService => ({
  get: getStorage,
  set: setStorage,
  subscribe: subscribeStorage,
  getTheme,
  setTheme,
  getViewMode,
  setViewMode,
  getSearchEngines,
  setSearchEngines,
});

export const storageService = createStorageService();

// デフォルトエクスポート
export default storageService;
