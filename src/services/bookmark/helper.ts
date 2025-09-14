/**
 * Bookmark Helper - ブックマーク関連のヘルパー関数
 */

/**
 * URLが存在するブックマークのみフィルタ
 */
export const filterValidBookmarks = (
  bookmarks: chrome.bookmarks.BookmarkTreeNode[],
): chrome.bookmarks.BookmarkTreeNode[] => {
  const result: chrome.bookmarks.BookmarkTreeNode[] = [];
  const traverse = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
    for (const node of nodes) {
      if (node.url) {
        result.push(node);
      }
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };
  traverse(bookmarks);
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
