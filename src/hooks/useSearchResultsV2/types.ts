/**
 * useSearchResultsV2関連の型定義
 */

import type { Kind, Result } from "@/services/result";
import type { LoadingState, ResultError } from "../useSearchResults/types";

export interface UseSearchResultsParams {
  query?: string;
  categories: Kind[];
  maxCount?: number;
}

export interface UseSearchResultsSnapshot {
  results: Result<Kind>[];
  status: LoadingState;
  loading: boolean;
  error: ResultError | null;
}
