import { ResultType } from "@/types/result";
import * as Type from "./types";

/**
 * ランダムIDを生成する（UUIDを使用）
 */
const createRandomId = (): string => {
  return crypto.randomUUID();
};

/**
 * Chrome APIの履歴データを内部の履歴形式に変換する
 */
export const convertToHistories = (
  chromeHistories: chrome.history.HistoryItem[],
  query: string
): Type.History[] => {
  return chromeHistories.map((chromeHistory) => {
    const history: Type.History = {
      id: createRandomId(),
      title: chromeHistory.title || "",
      url: chromeHistory.url || "",
      type: ResultType.History,
    };

    return history;
  });
};
