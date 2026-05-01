/**
 * Result Service - エクスポート用インデックス
 */

export * from "./helper";
export { type ResultService, resultService } from "./service";
export type * from "./types";
export {
  isActionResult,
  isBookmarkResult,
  isHistoryResult,
  isSuggestionResult,
  isTabResult,
} from "./types";
