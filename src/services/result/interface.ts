import type * as Type from "./types";

/** Aggregates results from all source services and applies fuzzy search. */
export interface ResultService {
  /** Queries all enabled source services in parallel and returns a unified result list. */
  query: (
    request: Type.QueryResultsInternalRequest,
  ) => Promise<Type.Result<Type.Kind>[]>;
}
