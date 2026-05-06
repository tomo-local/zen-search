import type * as Type from "./types";

/** Searches browser history. */
export interface HistoryService {
  /** Searches history entries by query with optional time range. */
  query(request: Type.SearchHistoryRequest): Promise<Type.History[]>;
}
