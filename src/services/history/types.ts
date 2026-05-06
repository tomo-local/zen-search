export interface History {
  id: string;
  type: "History";
  title: string;
  url: string;
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
