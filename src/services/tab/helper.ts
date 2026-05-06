import Fuse from "fuse.js";
import type { Tab } from "./types";

export const limitResults =
  (count?: number) =>
  (items: Tab[]): Tab[] =>
    count ? items.slice(0, count) : items;

const normalizeKana = (str: string): string =>
  str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  );

export const fuseFilter = (tabs: Tab[], query?: string): Tab[] => {
  if (!query) return tabs;

  const fuse = new Fuse(tabs, {
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
