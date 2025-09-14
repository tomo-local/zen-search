export interface Tab {
  id: string;
  type: "Tab";
  title: string;
  url: string;
  data: chrome.tabs.Tab & { id: number; lastAccessed: number };
}

export interface QueryTabsRequest {
  query?: string;
  option?: QueryOption;
}

export type QueryOption = Pick<chrome.tabs.QueryInfo, "currentWindow"> & {
  count?: number;
};

export interface CreateTabRequest {
  url: string;
}

// TODO: RequestをNewTabに追加
export interface UpdateTabRequest {
  tabId: number;
  windowId: number;
}

// TODO: RequestをNewTabに追加
export interface RemoveTabRequest {
  tabId: number;
}
