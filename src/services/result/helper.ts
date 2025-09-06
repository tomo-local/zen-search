/**
 * Result Service Helper - Resultサービスのヘルパー関数
 */

import type { Result } from "./types";

/**
 * サンプルヘルパー関数
 */
export const filterValidResults = (items: any[]): any[] => {
  return items.filter(item => item && item.id);
};
