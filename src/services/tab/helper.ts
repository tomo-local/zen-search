import type { Tab } from "./types";

// TODO:削除予定
export const sortByLastAccessed = (a: Tab, b: Tab): number =>
  b.data.lastAccessed - a.data.lastAccessed;

export const limitResults =
  (count?: number) =>
  <T>(items: T[]): T[] =>
    count ? items.slice(0, count) : items;

const parseQuery = (query: string): string[] => {
  return query.split(/\s+/).filter((k) => k.length > 0);
};

const isTextMatch = (text: string, keyword: string): boolean => {
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedKeyword, "i");
  return regex.test(text);
};

export const queryFiltered = (
  response: chrome.tabs.Tab[],
  query?: string,
): chrome.tabs.Tab[] => {
  if (!query) {
    return response;
  }

  const keywords = parseQuery(query);

  if (keywords.length === 0) {
    return response;
  }

  return response.filter((tab) => {
    const title = tab.title || "";
    const url = tab.url ? new URL(tab.url).href : "";

    return keywords.every(
      (keyword) => isTextMatch(title, keyword) || isTextMatch(url, keyword),
    );
  }) as chrome.tabs.Tab[];
};
