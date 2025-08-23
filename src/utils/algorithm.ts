function ngramSimilarity(
  str1: string,
  str2: string,
  n: number = 2,
  threshold: number = 0.2,
): boolean {
  const ngrams1 = getNgrams(str1, n);
  const ngrams2 = getNgrams(str2, n);
  const intersection = ngrams1.filter((ngram) => ngrams2.includes(ngram));
  const similarity =
    intersection.length / Math.max(ngrams1.length, ngrams2.length);
  return similarity >= threshold;
}

function getNgrams(str: string, n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= str.length - n; i++) {
    ngrams.push(str.slice(i, i + n));
  }
  return ngrams;
}

export { ngramSimilarity, getNgrams };
