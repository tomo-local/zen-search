import {
  type SyncStorage,
  SyncStorageKey,
  type ThemeValue,
} from "@/types/storage";

export const getSync = async (key: SyncStorageKey) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result[key]);
    });
  });
};

export const setSync = async ({
  key,
  value,
}: {
  key: SyncStorageKey;
  value: SyncStorage[SyncStorageKey];
}) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve(true);
    });
  });
};

export const getTheme = async (): Promise<ThemeValue> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(SyncStorageKey.Theme, (result) => {
      resolve(result[SyncStorageKey.Theme] || "system");
    });
  });
};

export const setTheme = async (theme: ThemeValue) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [SyncStorageKey.Theme]: theme }, () => {
      resolve(true);
    });
  });
};
