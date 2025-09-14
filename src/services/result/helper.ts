/**
 * Result Service Helper - Resultサービスのヘルパー関数
 */
import Fuse from "fuse.js";
import type { Kind, Result } from "./types";

/**
 * 指定された表示件数とサービス数から、各サービスが返すべき件数を計算する
 * @param count
 * @param serviceCount
 * @returns {number}
 */
export const calSingleCount = (
  count: number = 50,
  serviceCount: number,
): number => {
  return Math.floor(count / serviceCount);
};

export const fuseSearch = (query: string, result: Result<Kind>[]) => {
  const fuse = new Fuse(result, {
    keys: ["title", "url"],
    threshold: 0.4,
  });
  return fuse.search(query).map((res) => res.item);
};
