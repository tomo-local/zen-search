import { useCallback, useSyncExternalStore } from "react";
import {
  SyncStorageKey,
  storageService,
  type ViewModeValue,
} from "@/services/storage";

const listeners = new Set<() => void>();

let snapshot: ViewModeValue = "popup";

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
    updateSnapshot(stored ?? "popup");
  } catch (error) {
    console.error("Failed to hydrate viewMode", error);
    updateSnapshot("popup");
  }
};

storageService.subscribe(SyncStorageKey.ViewMode, (newViewMode) => {
  updateSnapshot(newViewMode ?? "popup");
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
