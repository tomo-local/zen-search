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

storageService.subscribe(SyncStorageKey.ViewMode, (newViewMode) => {
  if (newViewMode) updateSnapshot(newViewMode);
});

void hydrateViewMode();

export default function useViewMode() {
  const viewMode = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setViewMode = useCallback((value: ViewModeValue) => {
    updateSnapshot(value);
    storageService.setViewMode(value).catch((error) => {
      console.error("Failed to persist viewMode", error);
    });
  }, []);

  return { viewMode, setViewMode };
}
