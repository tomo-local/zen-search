/**
 * Result Service Converter - Resultの変換ヘルパー
 */

import type { Kind, Result } from "./types";

/**
 * サンプル変換関数
 */
export const convertResultToResult = (data: Result<Kind>): Result<Kind> => {
  return {
    id: data.id,
    type: data.type,
    title: data.title,
    url: data.url,
    data: data.data,
  };
};
