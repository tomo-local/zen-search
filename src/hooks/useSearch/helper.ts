/**
 * useSearch関連のユーティリティ関数
 */

import type { ResultType } from "./types";

/**
 * N-gramベースの類似度を計算
 * @param str1 - 比較元の文字列
 * @param str2 - 比較先の文字列
 * @param n - N-gramのN値（デフォルト: 2）
 * @returns 類似度（0-1）
 */
export function calculateNgramSimilarity(
  str1: string,
  str2: string,
  n = 2,
): number {
  const getNgrams = (str: string): string[] => {
    const ngrams: string[] = [];
    for (let i = 0; i <= str.length - n; i++) {
      ngrams.push(str.slice(i, i + n));
    }
    return ngrams;
  };

  const ngrams1 = getNgrams(str1);
  const ngrams2 = getNgrams(str2);
  const intersection = ngrams1.filter((ngram) => ngrams2.includes(ngram));
  const similarity =
    intersection.length / Math.max(ngrams1.length, ngrams2.length);
  return similarity;
}

/**
 * クエリタイプのマッチング判定
 * @param query - 入力クエリ
 * @param threshold - 類似度閾値（デフォルト: 0.6）
 * @returns マッチしたタイプまたはnull
 */
export function matchType(query: string, threshold = 0.6): ResultType | null {
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

    const similarity = calculateNgramSimilarity(lowerQuery, lowerType);

    return similarity >= threshold;
  });

  return match ? (match as ResultType) : null;
}
