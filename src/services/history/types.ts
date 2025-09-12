export interface History {
  type: "History";
  id: string;
  title: string;
  url: string;
  data: HistoryData;
}

export type HistoryData = {
  lastVisitTime?: number;
  typedCount?: number;
  visitCount?: number;
};

export interface NewHistory {
  data: chrome.history.HistoryItem & {
    favIconUrl?: string;
  };
}

export interface SearchHistoryRequest {
  query: string;
  startTime?: number;
  endTime?: number;
  count?: number;
}
