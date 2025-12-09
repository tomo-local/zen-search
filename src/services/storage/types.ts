/**
 * Storage Service Types - Chrome storage関連の型定義
 */

export enum SyncStorageKey {
  Theme = "theme",
}

export type ThemeValue = "light" | "dark" | "system";

export interface SyncStorage {
  [SyncStorageKey.Theme]: ThemeValue;
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
