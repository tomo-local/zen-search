import { useCallback, useRef, useSyncExternalStore } from "react";
import { createStore, isSameParams } from "./helper";
import type { UseSearchResultsParams, UseSearchResultsSnapshot } from "./types";

const MAX_COUNT = 5000;

type Snapshot = UseSearchResultsSnapshot;

type Params = {
  query?: string;
  categories: UseSearchResultsParams["categories"];
  maxCount: number;
};

const store = createStore();

export default function useSearchResultsV2({
  query,
  categories,
  maxCount = MAX_COUNT,
}: UseSearchResultsParams): Snapshot {
  const paramsRef = useRef<Params | null>(null);
  const nextParams: Params = { query, categories, maxCount };

  if (
    paramsRef.current === null ||
    !isSameParams(paramsRef.current, nextParams)
  ) {
    paramsRef.current = nextParams;
    store.setParams(nextParams);
  }

  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(listener),
    [],
  );

  const getSnapshot = useCallback(() => store.getSnapshot(), []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
