import { ResultType } from "@/types/result";
import { calcMatchRateResult } from "@/utils/match";
import * as Type from "./history.types";

/**
 * 履歴データの変換を担当するクラス
 */
export class HistoryConverter {
  /**
   * Chrome APIの履歴データを内部の履歴形式に変換する
   */
  static convertToHistories(
    chromeHistories: chrome.history.HistoryItem[],
    query: string
  ): Type.History[] {
    return chromeHistories.map((chromeHistory) => {
      const history: Type.History = {
        id: HistoryConverter.createRandomId(),
        title: chromeHistory.title || "",
        url: chromeHistory.url || "",
        match: calcMatchRateResult(query, chromeHistory.title, chromeHistory.url),
      };

      return history;
    });
  }

  /**
   * ランダムIDを生成する（UUIDを使用）
   * @private
   */
  private static createRandomId(): string {
    return crypto.randomUUID();
  }
}
