import { runtimeService } from "@/services/runtime";
import type { UseSearchResultsParams, UseSearchResultsSnapshot } from "./types";

type Snapshot = UseSearchResultsSnapshot;
type Params = {
  query?: string;
  categories: UseSearchResultsParams["categories"];
  maxCount: number;
};

const ERROR_CODES = {
  NETWORK: 1,
  UNKNOWN: 999,
} as const;

const ERROR_MESSAGES = {
  NETWORK: "Network error occurred while fetching search results.",
  UNKNOWN: "An unknown error occurred while fetching search results.",
} as const;

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

const fetchResults = async (params: Params) => {
  const results = await runtimeService.queryResults({
    filters: {
      query: params.query,
      categories: params.categories,
      count: params.maxCount,
    },
  });
  return results;
};

export const createStore = () => {
  const state = {
    snapshot: {
      results: [],
      status: "loading",
      loading: true,
      error: null,
    } as Snapshot,
    requestId: 0,
    listeners: new Set<() => void>(),
  };

  const notify = () => {
    state.listeners.forEach((listener) => {
      listener();
    });
  };

  const updateSnapshot = (update: Partial<Snapshot>) => {
    state.snapshot = { ...state.snapshot, ...update };
    notify();
  };

  const subscribe = (listener: () => void) => {
    state.listeners.add(listener);
    return () => state.listeners.delete(listener);
  };

  const getSnapshot = () => state.snapshot;

  const setParams = async (params: Params) => {
    const currentRequestId = ++state.requestId;

    updateSnapshot({
      status: "loading",
      loading: true,
      error: null,
    });

    try {
      const results = await fetchResults(params);
      if (currentRequestId !== state.requestId) return;
      updateSnapshot({
        results,
        status: "success",
        loading: false,
        error: null,
      });
    } catch (err) {
      if (currentRequestId !== state.requestId) return;
      updateSnapshot({
        status: "error",
        loading: false,
        error: mapError(err),
      });
    }
  };

  return {
    subscribe,
    getSnapshot,
    setParams,
  };
};

export const isSameParams = (a: Params | null, b: Params): boolean => {
  return (
    a !== null &&
    a.query === b.query &&
    a.maxCount === b.maxCount &&
    a.categories.length === b.categories.length &&
    a.categories.every((cat, i) => cat === b.categories[i])
  );
};
