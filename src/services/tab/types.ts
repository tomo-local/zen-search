export interface Tab {
  type: "Tab";
  id: number;
  title: string;
  url: string;
  data: TabData;
}

export interface TabData {
  icon?: string;
  active: boolean;
  lastAccessed: number;
  windowId: number;
  currentWindow: boolean;
}

export interface NewTab {
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
