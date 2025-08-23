export enum SyncStorageKey {
  Theme = "local:theme",
  Language = "local:language",
}

export type ThemeValue = "light" | "dark" | "system";
export type LanguageValue = "en" | "js";

export interface SyncStorage {
  [SyncStorageKey.Theme]: ThemeValue;
  [SyncStorageKey.Language]: LanguageValue;
}

