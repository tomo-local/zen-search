/**
 * Storage Service Types - Chrome storage関連の型定義
 */

export enum SyncStorageKey {
  Theme = "theme",
  ViewMode = "viewMode",
  SearchEngines = "searchEngines",
}

export type ThemeValue = "light" | "dark" | "system";
export type ViewModeValue = "popup" | "sidepanel";
export type SearchEngineValue =
  | "google"
  | "bing"
  | "duckduckgo"
  | "brave"
  | "ecosia"
  | "yahoo_japan"
  | "perplexity";

export interface SyncStorage {
  [SyncStorageKey.Theme]: ThemeValue;
  [SyncStorageKey.ViewMode]: ViewModeValue;
  [SyncStorageKey.SearchEngines]: SearchEngineValue[];
}

// リクエスト型定義
export interface GetStorageRequest<K extends SyncStorageKey> {
  key: K;
}

export interface SetStorageRequest<K extends SyncStorageKey> {
  key: K;
  value: SyncStorage[K];
}

export interface SetThemeRequest {
  theme: ThemeValue;
}
