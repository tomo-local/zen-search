/**
 * 履歴に関するユーティリティ関数
 */

/** 30日間のミリ秒数 */
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * デフォルトの終了時刻を取得（現在時刻）
 */
export function getDefaultEndTime(): number {
  return new Date().getTime();
}

/**
 * デフォルトの開始時刻を取得（指定した時刻の30日前）
 */
export function getDefaultStartTime(endTime?: number): number {
  const targetEndTime = endTime ?? getDefaultEndTime();
  return targetEndTime - THIRTY_DAYS_IN_MS; // 30日前
}

/**
 * 履歴検索のデフォルト設定
 */
export const HISTORY_DEFAULTS = {
  /** デフォルトの検索期間（30日前から現在まで） */
  getDefaultTimeRange: () => {
    return {
      startTime: getDefaultStartTime(),
      endTime: getDefaultEndTime()
    };
  },
  /** デフォルトの取得件数 */
  DEFAULT_COUNT: 20,
} as const;

/**
 * 履歴検索のパラメータを正規化する
 */
export function normalizeHistoryQueryParams(params: {
  query: string;
  startTime?: number;
  endTime?: number;
  count?: number;
}): Required<chrome.history.HistoryQuery> {
  const { startTime: defaultStartTime, endTime: defaultEndTime } =
    HISTORY_DEFAULTS.getDefaultTimeRange();

  return {
    text: params.query,
    startTime: params.startTime ?? defaultStartTime,
    endTime: params.endTime ?? defaultEndTime,
    maxResults: params.count ?? HISTORY_DEFAULTS.DEFAULT_COUNT,
  };
}

/**
 * 履歴データをバリデーションする
 */
export function validateHistoryItem(item: chrome.history.HistoryItem): boolean {
  return !!(item.title && item.url);
}

/**
 * 履歴データをフィルタリングする
 */
export function filterValidHistoryItems(
  items: chrome.history.HistoryItem[]
): chrome.history.HistoryItem[] {
  return items.filter(validateHistoryItem);
}
