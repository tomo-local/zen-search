import type * as Type from "./types";

/** Persists and retrieves user preferences via chrome.storage.sync. */
export interface StorageService {
  /** Retrieves a value from storage by key. */
  get: <K extends Type.SyncStorageKey>(
    request: Type.GetStorageRequest<K>,
  ) => Promise<Type.SyncStorage[K] | undefined>;
  /** Saves a value to storage. */
  set: <K extends Type.SyncStorageKey>(
    request: Type.SetStorageRequest<K>,
  ) => Promise<boolean>;
  /** Subscribes to storage changes for a key. Returns an unsubscribe function. */
  subscribe: <K extends Type.SyncStorageKey>(
    key: K,
    callback: (value: Type.SyncStorage[K] | undefined) => void,
  ) => () => void;
  /** Returns the current theme value, falling back to the default. */
  getTheme: () => Promise<Type.ThemeValue>;
  /** Saves the theme value. */
  setTheme: (request: Type.SetThemeRequest) => Promise<boolean>;
  /** Returns the current view mode, falling back to the default. */
  getViewMode: () => Promise<Type.ViewModeValue>;
  /** Saves the view mode value. */
  setViewMode: (viewMode: Type.ViewModeValue) => Promise<boolean>;
  /** Returns the current search engines, falling back to the default. */
  getSearchEngines: () => Promise<Type.SearchEngineValue[]>;
  /** Saves the search engines list. */
  setSearchEngines: (engines: Type.SearchEngineValue[]) => Promise<boolean>;
}
