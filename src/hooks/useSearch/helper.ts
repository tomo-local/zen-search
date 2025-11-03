/**
 * useSearch関連のユーティリティ関数
 */

import { matchScore } from "@/utils/algorithm";
import type { ResultType } from "./types";

/**
 * クエリタイプのマッチング判定
 * @param query - 入力クエリ
 * @param threshold - 類似度閾値（デフォルト: 0.6）
 * @returns マッチしたタイプまたはnull
 */
export function matchType(query: string, threshold = 0.5): ResultType | null {
  const count = query.length;

  if (count < 1) {
    return null;
  }

  const lowerQuery = query.toLowerCase();
  const match = ["All", "Tab", "History", "Bookmark", "Google"].find((type) => {
    const lowerType = type.toLowerCase();

    if (lowerType.length < lowerQuery.length) {
      return false;
    }

    if (lowerType === lowerQuery) {
      return true;
    }

    const score = matchScore(lowerQuery, lowerType);

    return score >= threshold;
  });

  return match ? (match as ResultType) : null;
}
