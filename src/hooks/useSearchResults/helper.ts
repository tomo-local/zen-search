/**
 * useSearchResults関連のユーティリティ関数
 */

import type { Kind } from "@/services/result";
import type { CacheEntry } from "./types";

/**
 * キャッシュキーを生成
 * @param query - 検索クエリ
 * @param categories - カテゴリ配列
 * @returns キャッシュキー
 */
export function generateCacheKey(
  query: string | undefined,
  categories: Kind[],
): string {
  const q = query || "";
  const c = categories.sort().join(",");
  return `${q}::${c}`;
}

/**
 * キャッシュが有効かチェック
 * @param entry - キャッシュエントリ
 * @param expireMs - 有効期限（ミリ秒）
 * @returns 有効ならtrue
 */
export function isCacheValid<T>(
  entry: CacheEntry<T> | null,
  expireMs: number,
): boolean {
  if (!entry) return false;
  const now = Date.now();
  return now - entry.timestamp < expireMs;
}

/**
 * 遅延処理
 * @param ms - 遅延時間（ミリ秒）
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * タイムアウト付きPromise
 * @param promise - 実行するPromise
 * @param timeoutMs - タイムアウト時間（ミリ秒）
 * @returns タイムアウト付きPromise
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs),
    ),
  ]);
}

/**
 * リトライ付き実行
 * @param fn - 実行する関数
 * @param maxRetries - 最大リトライ回数
 * @param delayMs - リトライ間の待機時間（ミリ秒）
 * @returns 実行結果
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  delayMs: number,
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}
