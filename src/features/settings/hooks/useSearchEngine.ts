import { useCallback, useSyncExternalStore } from "react";
import {
  getDefaultSearchEngines,
  isValidSearchEngines,
  type SearchEngineValue,
  SyncStorageKey,
  storageService,
} from "@/services/storage";

const listeners = new Set<() => void>();

let snapshot: SearchEngineValue[] = getDefaultSearchEngines();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const updateSnapshot = (engines: SearchEngineValue[]) => {
  snapshot = engines;
  notify();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

const hydrateSearchEngines = async () => {
  try {
    const stored = await storageService.getSearchEngines();
    updateSnapshot(
      isValidSearchEngines(stored) ? stored : getDefaultSearchEngines(),
    );
  } catch (error) {
    console.error("Failed to hydrate searchEngines", error);
    updateSnapshot(getDefaultSearchEngines());
  }
};

storageService.subscribe(SyncStorageKey.SearchEngines, (newEngines) => {
  updateSnapshot(
    isValidSearchEngines(newEngines) ? newEngines : getDefaultSearchEngines(),
  );
});

void hydrateSearchEngines();

export default function useSearchEngines() {
  const searchEngines = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  const setSearchEngines = useCallback((engines: SearchEngineValue[]) => {
    if (engines.length === 0) return;
    updateSnapshot(engines);
    storageService.setSearchEngines(engines).catch((error) => {
      console.error("Failed to persist searchEngines", error);
    });
  }, []);

  const toggleSearchEngine = useCallback(
    (engine: SearchEngineValue) => {
      const next = searchEngines.includes(engine)
        ? searchEngines.filter((e) => e !== engine)
        : [...searchEngines, engine];
      if (next.length === 0) return; // 最低1つは有効
      setSearchEngines(next);
    },
    [searchEngines, setSearchEngines],
  );

  return { searchEngines, toggleSearchEngine };
}
