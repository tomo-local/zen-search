import { useCallback, useRef, useSyncExternalStore } from "react";
import { runtimeService } from "@/services/runtime";
import type { UseSearchResultsParams, UseSearchResultsSnapshot } from "./types";

const MAX_COUNT = 5000;
const ERROR_CODES = {
  NETWORK: 1,
  UNKNOWN: 999,
} as const;

const ERROR_MESSAGES = {
  NETWORK: "Network error occurred while fetching search results.",
  UNKNOWN: "An unknown error occurred while fetching search results.",
} as const;

type Snapshot = UseSearchResultsSnapshot;

const mapError = (err: unknown) => {
  const message = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN;
  if (message.toLowerCase().includes("network")) {
    return {
      message: ERROR_MESSAGES.NETWORK,
      code: ERROR_CODES.NETWORK,
      originalError: err,
    } as const;
  }
  return {
    message: ERROR_MESSAGES.UNKNOWN,
    code: ERROR_CODES.UNKNOWN,
    originalError: err,
  } as const;
};

type Params = {
  query?: string;
  categories: UseSearchResultsParams["categories"];
  maxCount: number;
};

const createStore = () => {
  let snapshot: Snapshot = {
    results: [],
    status: "loading",
    loading: true,
    error: null,
  };
  let params: Params | null = null;
  let requestId = 0;
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => {
      listener();
    });
  };

  const isSameParams = (next: Params) => {
    if (!params) return false;
    if (params.query !== next.query) return false;
    if (params.maxCount !== next.maxCount) return false;
    if (params.categories.length !== next.categories.length) return false;
    for (let i = 0; i < params.categories.length; i++) {
      if (params.categories[i] !== next.categories[i]) return false;
    }
    return true;
  };

  const fetchResults = async (next: Params, currentRequestId: number) => {
    try {
      const results = await runtimeService.queryResults({
        filters: {
          query: next.query,
          categories: next.categories,
          count: next.maxCount,
        },
      });
      if (currentRequestId !== requestId) return;
      snapshot = {
        results,
        status: "success",
        loading: false,
        error: null,
      };
      notify();
    } catch (err) {
      if (currentRequestId !== requestId) return;
      snapshot = {
        ...snapshot,
        status: "error",
        loading: false,
        error: mapError(err),
      };
      notify();
    }
  };

  const setParams = (next: Params) => {
    const shouldSkip = isSameParams(next);
    params = next;
    if (shouldSkip) return;

    const currentRequestId = ++requestId;

    snapshot = {
      ...snapshot,
      status: "loading",
      loading: true,
      error: null,
    };
    notify();

    void fetchResults(next, currentRequestId);
  };

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    setParams,
    isSameParams,
  };
};

const store = createStore();

export default function useSearchResultsV2({
  query,
  categories,
  maxCount = MAX_COUNT,
}: UseSearchResultsParams): Snapshot {
  const paramsRef = useRef<Params | null>(null);
  const nextParams: Params = { query, categories, maxCount };

  if (!paramsRef.current || !store.isSameParams(nextParams)) {
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
