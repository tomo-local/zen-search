import { BaseService } from "@/services/base";
import { storage } from "@wxt-dev/storage";
import * as Types from "./types";
import { getTheme } from "@/function/chrome/storage";

export class StorageService extends BaseService {
  private storage = storage;

  initialize(): Promise<void> | void {
    this.isInitialized = true;
  }

  dispose(): Promise<void> | void {
    this.isInitialized = false;
  }

  private async getItem<T>(key: Types.SyncStorageKey): Promise<T | null> {
    return this.storage.getItem(key);
  }

  private async setItem<T>(key: Types.SyncStorageKey, value: T): Promise<void> {
    return this.storage.setItem(key, value);
  }

  async getTheme(): Promise<Types.ThemeValue> {
    return (await this.getItem(Types.SyncStorageKey.Theme)) || "system";
  }

  async getLanguage(): Promise<Types.LanguageValue> {
    return (await this.getItem(Types.SyncStorageKey.Language)) || "en";
  }

  async setTheme(theme: Types.ThemeValue): Promise<void> {
    await this.setItem(Types.SyncStorageKey.Theme, theme);
  }

  async setLanguage(language: Types.LanguageValue): Promise<void> {
    await this.setItem(Types.SyncStorageKey.Language, language);
  }

}
