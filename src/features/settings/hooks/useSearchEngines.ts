import { useCallback, useSyncExternalStore } from "react";
import { runtimeService } from "@/services/runtime";
import { isStorageChangedMessage } from "@/services/runtime/types";
import {
  getDefaultSearchEngines,
  isValidSearchEngines,
  type SearchEngineValue,
  SyncStorageKey,
} from "@/services/storage";

/**
 * useSyncExternalStore パターン用のモジュールレベル状態。
 * コンポーネントの再マウントをまたいでサブスクリプション状態を保持するために
 * 意図的にモジュールスコープに置く。
 */
const listeners = new Set<() => void>();

/** useSyncExternalStore パターン用のモジュールレベル状態（上記 listeners と同様）。 */
let snapshot: SearchEngineValue[] = [];

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const updateSnapshot = (engines: SearchEngineValue[]) => {
  if (
    snapshot === engines ||
    (snapshot.length === engines.length &&
      snapshot.every((e, i) => e === engines[i]))
  ) {
    return;
  }
  snapshot = [...engines];
  notify();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

const hydrateSearchEngines = async () => {
  try {
    const stored = await runtimeService.getSearchEngines();
    updateSnapshot(stored);
  } catch (error) {
    console.error("Failed to hydrate searchEngines", error);
    updateSnapshot(getDefaultSearchEngines());
  }
};

// バックグラウンドからの STORAGE_CHANGED 通知でスナップショットを更新
chrome.runtime.onMessage.addListener((message: unknown) => {
  if (
    isStorageChangedMessage(message) &&
    message.key === SyncStorageKey.SearchEngines
  ) {
    updateSnapshot(
      isValidSearchEngines(message.value)
        ? message.value
        : getDefaultSearchEngines(),
    );
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
    runtimeService.setSearchEngines(engines).catch((error) => {
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
