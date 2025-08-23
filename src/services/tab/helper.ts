import type { Tab } from "./types";

export const sortByLastAccessed = (a: Tab, b: Tab): number =>
  b.data.lastAccessed - a.data.lastAccessed;

export const limitResults =
  (count?: number) =>
  <T>(items: T[]): T[] =>
    count ? items.slice(0, count) : items;
