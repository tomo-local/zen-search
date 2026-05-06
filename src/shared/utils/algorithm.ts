/**
 * n-gramの類似度スコアを計算する
 * @param str1 - 比較対象の文字列1
 * @param str2 - 比較対象の文字列2
 * @param n - n-gramのnの値（デフォルト: 2）
 * @returns - 類似度スコア（0〜1の範囲）
 */
function matchScore(str1: string, str2: string, n = 2): number {
  const grams1 = getGrams(str1, n);
  const grams2 = getGrams(str2, n);

  let intersectionSize = 0;

  for (const gram of grams1) {
    if (grams2.has(gram)) {
      intersectionSize++;
    }
  }

  const similarity = intersectionSize / Math.max(grams1.size, grams2.size);
  return similarity;
}

function getGrams(str: string, n: number): Set<string> {
  const set = new Set<string>();

  let i = 0;
  while (i <= str.length - n) {
    set.add(str.slice(i, i + n));
    i++;
  }
  return set;
}

export { matchScore };
