export interface History {
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
