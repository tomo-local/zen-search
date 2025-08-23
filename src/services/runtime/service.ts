import type {
  Bookmark,
  QueryBookmarksRequest,
} from "@/services/bookmark/types";
import type { History, SearchHistoryRequest } from "@/services/history/types";
import type {
  CreateTabRequest,
  QueryTabsRequest,
  RemoveTabRequest,
  Tab,
  UpdateTabRequest,
} from "@/services/tab/types";
import { MessageType } from "@/types/result";
import { RuntimeServiceError } from "./error";
import type { RuntimeResponse } from "./types";

export interface RuntimeService {
  queryTabs: (request: QueryTabsRequest) => Promise<Tab[]>;
  createTab: (request: CreateTabRequest) => Promise<void>;
  updateTab: (request: UpdateTabRequest) => Promise<void>;
  removeTab: (request: RemoveTabRequest) => Promise<void>;
  searchHistory: (request: SearchHistoryRequest) => Promise<History[]>;
  searchBookmarks: (request: QueryBookmarksRequest) => Promise<Bookmark[]>;
}

// サービス実装
const queryTabs = async ({
  query,
  option,
}: QueryTabsRequest): Promise<Tab[]> => {
  try {
    const response = (await chrome.runtime.sendMessage({
      type: MessageType.QUERY_TAB,
      query,
      option,
    })) as RuntimeResponse<Tab[]>;

    return response.result;
  } catch (error) {
    if (error instanceof RuntimeServiceError) {
      throw error;
    }

    console.error("Failed to query tabs via runtime:", error);
    throw new RuntimeServiceError(
      "タブの検索に失敗しました",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
};

const createTab = async ({ url }: CreateTabRequest): Promise<void> => {
  try {
    await chrome.runtime.sendMessage({
      type: MessageType.CREATE_TAB,
      url,
    });
  } catch (error) {
    if (error instanceof RuntimeServiceError) {
      throw error;
    }

    console.error("Failed to create tab via runtime:", error);
    throw new RuntimeServiceError(
      "タブの作成に失敗しました",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
};

const updateTab = async ({
  tabId,
  windowId,
}: UpdateTabRequest): Promise<void> => {
  try {
    await chrome.runtime.sendMessage({
      type: MessageType.UPDATE_TAB,
      tabId,
      windowId,
    });
  } catch (error) {
    if (error instanceof RuntimeServiceError) {
      throw error;
    }

    console.error("Failed to update tab via runtime:", error);
    throw new RuntimeServiceError(
      "タブの更新に失敗しました",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
};

const removeTab = async ({ tabId }: RemoveTabRequest): Promise<void> => {
  try {
    await chrome.runtime.sendMessage({
      type: MessageType.REMOVE_TAB,
      tabId,
    });
  } catch (error) {
    if (error instanceof RuntimeServiceError) {
      throw error;
    }

    console.error("Failed to remove tab via runtime:", error);
    throw new RuntimeServiceError(
      "タブの削除に失敗しました",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
};

const searchHistory = async ({
  query,
}: SearchHistoryRequest): Promise<History[]> => {
  try {
    const response = (await chrome.runtime.sendMessage({
      type: MessageType.QUERY_HISTORY,
      query,
    })) as RuntimeResponse<History[]>;

    return response.result;
  } catch (error) {
    if (error instanceof RuntimeServiceError) {
      throw error;
    }

    console.error("Failed to search history via runtime:", error);
    throw new RuntimeServiceError(
      "履歴の検索に失敗しました",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
};

const searchBookmarks = async ({
  query,
}: QueryBookmarksRequest): Promise<Bookmark[]> => {
  try {
    const response = (await chrome.runtime.sendMessage({
      type: MessageType.QUERY_BOOKMARK,
      query,
    })) as RuntimeResponse<Bookmark[]>;

    return response.result;
  } catch (error) {
    if (error instanceof RuntimeServiceError) {
      throw error;
    }

    console.error("Failed to search bookmarks via runtime:", error);
    throw new RuntimeServiceError(
      "ブックマークの検索に失敗しました",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
};

export const createRuntimeService = (): RuntimeService => ({
  queryTabs,
  createTab,
  updateTab,
  removeTab,
  searchHistory,
  searchBookmarks,
});

export const runtimeService = createRuntimeService();

export { queryTabs };
