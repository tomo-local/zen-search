import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  getDefaultTheme,
  isValidTheme,
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

/**
 * useSyncExternalStore パターン用のモジュールレベル状態。
 * コンポーネントの再マウントをまたいでサブスクリプション状態を保持するために
 * 意図的にモジュールスコープに置く。
 */
const listeners = new Set<() => void>();

const darkModeMediaQuery =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

/**
 * ウィンドウのダークモード設定を取得
 */
export const isWindowDarkMode = (): boolean => {
  return darkModeMediaQuery?.matches ?? false;
};

const buildSnapshot = (theme: ThemeValue): ThemeSnapshot => ({
  theme,
  isDarkMode: theme === "system" ? isWindowDarkMode() : theme === "dark",
});

/** useSyncExternalStore パターン用のモジュールレベル状態（上記 listeners と同様）。 */
let snapshot: ThemeSnapshot = buildSnapshot("system");

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
  const next = buildSnapshot(theme);
  // 値が変わっていない場合は通知をスキップし、不要な再レンダリングを防ぐ
  if (snapshot.theme === next.theme && snapshot.isDarkMode === next.isDarkMode)
    return;
  snapshot = next;
  notify();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

const hydrateTheme = async () => {
  try {
    const storedTheme = await storageService.getTheme();
    updateSnapshot(storedTheme ?? "system");
  } catch (error) {
    console.error("Failed to hydrate theme", error);
    updateSnapshot("system");
  }
};

storageService.subscribe(SyncStorageKey.Theme, (newTheme) => {
  updateSnapshot(isValidTheme(newTheme) ? newTheme : getDefaultTheme());
});

const handleColorSchemeChange = () => {
  if (snapshot.theme === "system") {
    updateSnapshot("system");
  }
};

darkModeMediaQuery?.addEventListener("change", handleColorSchemeChange);

// HMRでモジュールが再評価される際にリスナーを削除してリークを防ぐ
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    darkModeMediaQuery?.removeEventListener("change", handleColorSchemeChange);
  });
}

void hydrateTheme();

export default function useTheme() {
  const { theme, isDarkMode } = useSyncExternalStore(
    subscribe,
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
