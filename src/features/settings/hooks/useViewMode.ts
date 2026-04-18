import { useCallback, useSyncExternalStore } from "react";
import {
  getDefaultViewMode,
  SyncStorageKey,
  storageService,
  type ViewModeValue,
} from "@/services/storage";

const listeners = new Set<() => void>();

let snapshot: ViewModeValue = getDefaultViewMode();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const updateSnapshot = (viewMode: ViewModeValue) => {
  snapshot = viewMode;
  notify();
};

const subscribeExternalChanges = () =>
  storageService.subscribe(SyncStorageKey.ViewMode, (newViewMode) => {
    if (newViewMode) {
      updateSnapshot(newViewMode);
    }
  });

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

const hydrateViewMode = async () => {
  try {
    const stored = await storageService.getViewMode();
    updateSnapshot(stored ?? getDefaultViewMode());
  } catch (error) {
    console.error("Failed to hydrate viewMode", error);
    updateSnapshot(getDefaultViewMode());
  }
};

void hydrateViewMode();

export default function useViewMode() {
  const viewMode = useSyncExternalStore(
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

  const setViewMode = useCallback((value: ViewModeValue) => {
    updateSnapshot(value);
    storageService.setViewMode(value).catch((error) => {
      console.error("Failed to persist viewMode", error);
    });
  }, []);

  return { viewMode, setViewMode };
}
