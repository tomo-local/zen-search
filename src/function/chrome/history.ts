import type { History, QueryHistoryMessage } from "@/types/chrome";
import { ResultType } from "@/types/result";

import { calcMatchRateResult } from "@/utils/match";

type InputQueryHistory = Omit<QueryHistoryMessage, "type">;

const defaultEndTime = Date.now();
const defaultStartTime = defaultEndTime - 1000 * 60 * 60 * 24 * 30;

const defaultCount = 20;

const queryHistory = async ({
  query,
  startTime = defaultStartTime,
  endTime = defaultEndTime,
  count = defaultCount,
}: InputQueryHistory): Promise<History[]> => {
  const response = await chrome.history.search({
    text: query,
    startTime,
    endTime,
    maxResults: count,
  });

  const history = response.map((item) => ({
    type: ResultType.History,
    id: createRandomId(),
    title: item.title,
    url: item.url,
    match: calcMatchRateResult(query, item.title, item.url),
  }));

  return history as History[];
};

export { queryHistory };

// 乱数を作成 10桁の乱数を作成
const createRandomId = () => {
  return Math.floor(Math.random() * 10000000000);
};
