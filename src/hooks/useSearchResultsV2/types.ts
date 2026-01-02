/**
 * useSearchResultsV2関連の型定義
 */

import type { Kind, Result } from "@/services/result";

export type LoadingState = "idle" | "loading" | "succeeded" | "failed";

export interface ResultError {
  message: string;
  code?: number;
}

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
