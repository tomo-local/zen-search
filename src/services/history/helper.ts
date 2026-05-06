import { MS_IN_A_DAY } from "./constant";

export const getNow = (): Date => {
  return new Date();
};

export const get30DaysAgo = (date: Date): Date => {
  const result = new Date(date);
  result.setTime(result.getTime() - 30 * MS_IN_A_DAY);
  return result;
};

export const getFaviconUrl = (url: string): string | undefined => {
  const hostUrl = (() => {
    try {
      const u = new URL(url);
      return u.origin;
    } catch {
      return null;
    }
  })();
  if (hostUrl) {
    return `https://www.google.com/s2/favicons?domain=${hostUrl}`;
  }

  return undefined;
};
