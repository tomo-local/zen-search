/**
 * Storage Service Types - Chrome storage関連の型定義
 */

export enum SyncStorageKey {
  Theme = "theme",
  Language = "language",
}

export type ThemeValue = "light" | "dark" | "system";
export type LanguageValue = "en" | "js";

export interface SyncStorage {
  [SyncStorageKey.Theme]: ThemeValue;
  [SyncStorageKey.Language]: LanguageValue;
}

export enum LocalStorageKey {
  AppQuery = "app_query",
}

export interface AppQueryValue {
  query: {
    string: string;
    lastTimestamp: number;
  };
}

export interface LocalStorage {
  [LocalStorageKey.AppQuery]: AppQueryValue;
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

export interface SetLanguageRequest {
  language: LanguageValue;
}

export interface GetLocalStorageRequest<K extends LocalStorageKey> {
  key: K;
}

export interface SetLocalStorageRequest<K extends LocalStorageKey> {
  key: K;
  value: LocalStorage[K];
}
