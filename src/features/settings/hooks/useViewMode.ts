import { useCallback, useSyncExternalStore } from "react";
import { runtimeService } from "@/services/runtime";
import { isStorageChangedMessage } from "@/services/runtime/types";
import {
  getDefaultViewMode,
  isValidViewMode,
  SyncStorageKey,
  type ViewModeValue,
} from "@/services/storage";

/**
 * useSyncExternalStore パターン用のモジュールレベル状態。
 * コンポーネントの再マウントをまたいでサブスクリプション状態を保持するために
 * 意図的にモジュールスコープに置く。
 */
const listeners = new Set<() => void>();

/** useSyncExternalStore パターン用のモジュールレベル状態（上記 listeners と同様）。 */
let snapshot: ViewModeValue = "popup";

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const updateSnapshot = (viewMode: ViewModeValue) => {
  if (snapshot === viewMode) return;
  snapshot = viewMode;
  notify();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

const hydrateViewMode = async () => {
  try {
    const stored = await runtimeService.getViewMode();
    updateSnapshot(stored);
  } catch (error) {
    console.error("Failed to hydrate viewMode", error);
    updateSnapshot(getDefaultViewMode());
  }
};

// バックグラウンドからの STORAGE_CHANGED 通知でスナップショットを更新
chrome.runtime.onMessage.addListener((message: unknown) => {
  if (
    isStorageChangedMessage(message) &&
    message.key === SyncStorageKey.ViewMode
  ) {
    updateSnapshot(
      isValidViewMode(message.value) ? message.value : getDefaultViewMode(),
    );
  }
});

void hydrateViewMode();

export default function useViewMode() {
  const viewMode = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setViewMode = useCallback((value: ViewModeValue) => {
    updateSnapshot(value);
    runtimeService.setViewMode(value).catch((error) => {
      console.error("Failed to persist viewMode", error);
    });
  }, []);

  return { viewMode, setViewMode };
}
