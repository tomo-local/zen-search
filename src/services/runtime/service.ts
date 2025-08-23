import type { QueryRequest, Tab } from "@/services/tab/types";
import { MessageType } from "@/types/result";
import { RuntimeServiceError } from "./error";
import type { RuntimeResponse } from "./types";

export interface RuntimeService {
  queryTabs: (request: QueryRequest) => Promise<Tab[]>;
}

// サービス実装
const queryTabs = async ({ query, option }: QueryRequest): Promise<Tab[]> => {
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

export const createRuntimeService = (): RuntimeService => ({
  queryTabs,
});

export const runtimeService = createRuntimeService();

export { queryTabs };
