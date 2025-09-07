import type { Tab } from "./types";

export const sortByLastAccessed = (a: Tab, b: Tab): number =>
  b.data.lastAccessed - a.data.lastAccessed;

export const limitResults =
  (count?: number) =>
  <T>(items: T[]): T[] =>
    count ? items.slice(0, count) : items;

export const queryFiltered = (
  response: chrome.tabs.Tab[],
  query?: string,
): chrome.tabs.Tab[] => {
  if (!query) return response;

  return response.filter((tab) => {
    const title = tab.title || "";
    const url = tab.url ? new URL(tab.url).hostname : "";

    const isTitleMatch = title.toLowerCase().includes(query.toLowerCase());
    const isUrlMatch = url.toLowerCase().includes(query.toLowerCase());

    return isTitleMatch || isUrlMatch;
  }) as chrome.tabs.Tab[];
};
