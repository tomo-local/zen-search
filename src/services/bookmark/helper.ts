/**
 * Bookmark Helper - ブックマーク関連のヘルパー関数
 */

/**
 * URLが存在するブックマークのみフィルタ
 */
export const filterValidBookmarks = (
  bookmarks: chrome.bookmarks.BookmarkTreeNode[]
): chrome.bookmarks.BookmarkTreeNode[] => {
  return bookmarks.filter((bookmark) => bookmark.url);
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
