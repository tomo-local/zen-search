import { useCallback, useSyncExternalStore } from "react";
import {
  type SearchEngineValue,
  SyncStorageKey,
  storageService,
} from "@/services/storage";

const listeners = new Set<() => void>();

let snapshot: SearchEngineValue[] = [];

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
    updateSnapshot(stored);
  } catch (error) {
    console.error("Failed to hydrate searchEngines", error);
    updateSnapshot(["google"]);
  }
};

storageService.subscribe(SyncStorageKey.SearchEngines, (newEngines) => {
  if (newEngines) {
    updateSnapshot(newEngines);
  }
});

void hydrateSearchEngines();

/**
 * 有効な検索エンジン一覧を取得し、トグル操作を提供するフック。
 * Chrome Storage と同期し、変更は即座に UI へ反映される。
 */
export default function useSearchEngines() {
  const searchEngines = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  const setSearchEngines = useCallback((engines: SearchEngineValue[]) => {
    if (engines.length === 0) return;
    const previous = snapshot;
    updateSnapshot(engines);
    storageService.setSearchEngines(engines).catch((error) => {
      console.error("Failed to persist searchEngines", error);
      updateSnapshot(previous);
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
