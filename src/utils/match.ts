import { getNgrams } from "@/utils/algorithm";

const calculateMatchRate = (query: string, target: string): number => {
  const ngrams1 = getNgrams(query, 2);
  const ngrams2 = getNgrams(target, 2);
  // 下の処理の説明をして
  const intersection = ngrams1.filter((ngram) => ngrams2.includes(ngram));

  return intersection.length / ngrams1.length;
};

const calcMatchRateResult = (
  query: string,
  title?: string,
  url?: string
): number => {
  const titleMatch = title ? calculateMatchRate(query, title) : 0;
  const urlMatch = url ? calculateMatchRate(query, url) : 0;
  return titleMatch > urlMatch ? titleMatch : urlMatch;
};

export { calcMatchRateResult };
