import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  getDefaultTheme,
  isWindowDarkMode,
  SyncStorageKey,
  storageService,
  type ThemeValue,
} from "@/services/storage";

type ThemeSnapshot = {
  theme: ThemeValue;
  isDarkMode: boolean;
};

export type ThemeState = ThemeSnapshot & {
  setTheme: (value: ThemeValue) => void;
};

const listeners = new Set<() => void>();

const buildSnapshot = (theme: ThemeValue): ThemeSnapshot => ({
  theme,
  isDarkMode: theme === "system" ? isWindowDarkMode() : theme === "dark",
});

let snapshot: ThemeSnapshot = buildSnapshot(getDefaultTheme());

export const initialState: ThemeState = {
  ...snapshot,
  setTheme: () => {},
};

const notify = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

const updateSnapshot = (theme: ThemeValue) => {
  snapshot = buildSnapshot(theme);
  notify();
};

const subscribeExternalChanges = () =>
  storageService.subscribe(SyncStorageKey.Theme, (newTheme) => {
    if (newTheme) {
      updateSnapshot(newTheme);
    }
  });

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

const hydrateTheme = async () => {
  try {
    const storedTheme = await storageService.getTheme();
    updateSnapshot(storedTheme ?? getDefaultTheme());
  } catch (error) {
    console.error("Failed to hydrate theme", error);
    updateSnapshot(getDefaultTheme());
  }
};

void hydrateTheme();

export default function useTheme() {
  const { theme, isDarkMode } = useSyncExternalStore(
    (listener) => {
      const unsubscribeInternal = subscribe(listener);
      const unsubscribeExternal = subscribeExternalChanges();
      return () => {
        unsubscribeInternal();
        unsubscribeExternal();
      };
    },
    getSnapshot,
    getSnapshot,
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const setTheme = useCallback((value: ThemeValue) => {
    updateSnapshot(value);
    storageService.setTheme({ theme: value }).catch((error) => {
      console.error("Failed to persist theme", error);
    });
  }, []);

  return {
    theme,
    isDarkMode,
    setTheme,
  };
}
