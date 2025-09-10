/**
 * Result Service Helper - Resultサービスのヘルパー関数
 */

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
