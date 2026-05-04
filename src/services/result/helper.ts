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

/** カタカナをひらがなに変換（ひらがな・カタカナ混在クエリの検索精度向上） */
const normalizeKana = (str: string): string =>
  str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  );

export const fuseSearch = (
  query: string,
  result: Result<Kind>[],
): Result<Kind>[] => {
  const fuse = new Fuse(result, {
    keys: ["title", "url"],
    threshold: 0.4,
    ignoreLocation: true,
    getFn: (obj, path) => {
      const val = Fuse.config.getFn(obj, path);
      if (typeof val === "string") return normalizeKana(val);
      if (Array.isArray(val))
        return val.map((v) => (typeof v === "string" ? normalizeKana(v) : v));
      return val;
    },
  });

  return fuse.search(normalizeKana(query)).map((res) => res.item);
};
