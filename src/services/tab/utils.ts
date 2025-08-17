/**
 * タブのフィルタリングに関するユーティリティ関数
 */

/**
 * クエリに基づいてタブをフィルタリングする
 * @param tabs フィルタリング対象のタブ配列
 * @param query 検索クエリ
 * @returns フィルタリングされたタブ配列
 */
export function filterTabsByQuery(tabs: chrome.tabs.Tab[], query: string): chrome.tabs.Tab[] {
  if (!query) {
    return tabs;
  }

  return tabs.filter((tab) => {
    const title = tab.title || "";
    const url = tab.url ? new URL(tab.url).hostname : "";

    const isTitleMatch = title.toLowerCase().includes(query.toLowerCase());
    const isUrlMatch = url.toLowerCase().includes(query.toLowerCase());

    return isTitleMatch || isUrlMatch;
  });
}

/**
 * タブのタイトルでマッチするかチェック
 * @param tab チェック対象のタブ
 * @param query 検索クエリ
 * @returns マッチするかどうか
 */
export function matchTabTitle(tab: chrome.tabs.Tab, query: string): boolean {
  const title = tab.title || "";
  return title.toLowerCase().includes(query.toLowerCase());
}

/**
 * タブのURLでマッチするかチェック
 * @param tab チェック対象のタブ
 * @param query 検索クエリ
 * @returns マッチするかどうか
 */
export function matchTabUrl(tab: chrome.tabs.Tab, query: string): boolean {
  const url = tab.url ? new URL(tab.url).hostname : "";
  return url.toLowerCase().includes(query.toLowerCase());
}

/**
 * タブがクエリにマッチするかチェック
 * @param tab チェック対象のタブ
 * @param query 検索クエリ
 * @returns マッチするかどうか
 */
export function matchTab(tab: chrome.tabs.Tab, query: string): boolean {
  return matchTabTitle(tab, query) || matchTabUrl(tab, query);
}
