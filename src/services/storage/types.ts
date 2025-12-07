/**
 * Storage Service Types - Chrome storage関連の型定義
 */

export enum SyncStorageKey {
  Theme = "theme",
  Language = "i18n_language",
}

export type ThemeValue = "light" | "dark" | "system";
export type LanguageValue = "en" | "ja" | "system";

export interface SyncStorage {
  [SyncStorageKey.Theme]: ThemeValue;
  [SyncStorageKey.Language]: LanguageValue;
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
