import type {
  Bookmark,
  QueryBookmarksRequest,
} from "@/services/bookmark/types";
import type { History, SearchHistoryRequest } from "@/services/history/types";
import type { QueryTabsRequest, Tab } from "@/services/tab/types";
import { MessageType } from "@/types/result";
import { RuntimeServiceError } from "./error";
import type { RuntimeResponse } from "./types";

export interface RuntimeService {
  queryTabs: (request: QueryTabsRequest) => Promise<Tab[]>;
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
  searchHistory,
  searchBookmarks,
});

export const runtimeService = createRuntimeService();

export { queryTabs };
