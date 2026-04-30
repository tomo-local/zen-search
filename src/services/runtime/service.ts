import { contentService } from "@/services/content";
import type {
  Kind,
  QueryResultsRequest,
  Result,
} from "@/services/result/types";
import type {
  CreateTabRequest,
  RemoveTabRequest,
  UpdateTabRequest,
} from "@/services/tab/types";
import { RuntimeServiceError } from "./error";
import { MessageType, type RuntimeResponse } from "./types";

/**
 * MV3 Service Worker が停止中に sendMessage すると
 * "Could not establish connection. Receiving end does not exist." が発生する。
 * この失敗自体が SW を起動するトリガーになるため、
 * 起動完了を待ってから 1 回だけリトライする。
 */
const SW_RESTART_DELAY_MS = 500;

function isConnectionError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("Could not establish connection") ||
      error.message.includes("Receiving end does not exist"))
  );
}

async function sendRuntimeMessage<T>(message: object): Promise<T> {
  try {
    return (await chrome.runtime.sendMessage(message)) as T;
  } catch (error) {
    if (isConnectionError(error)) {
      // SW が停止していた場合、上記の sendMessage が起動トリガーになる。
      // 初期化完了を待ってからリトライする。
      await new Promise<void>((resolve) =>
        setTimeout(resolve, SW_RESTART_DELAY_MS),
      );
      return (await chrome.runtime.sendMessage(message)) as T;
    }
    throw error;
  }
}

export interface RuntimeService {
  createTab: (request: CreateTabRequest) => Promise<void>;
  updateTab: (request: UpdateTabRequest) => Promise<void>;
  removeTab: (request: RemoveTabRequest) => Promise<void>;
  queryResults: (request: QueryResultsRequest) => Promise<Result<Kind>[]>;
  openContent: () => Promise<void>;
  closeContent: () => Promise<void>;
}

const createTab = async ({ url }: CreateTabRequest): Promise<void> => {
  try {
    await sendRuntimeMessage({
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
    await sendRuntimeMessage({
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
    await sendRuntimeMessage({
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

const queryResults = async ({
  filters,
}: QueryResultsRequest): Promise<Result<Kind>[]> => {
  try {
    const response = await sendRuntimeMessage<RuntimeResponse<Result<Kind>[]>>({
      type: MessageType.QUERY_RESULT,
      filters,
    });

    return response.result;
  } catch (error) {
    if (error instanceof RuntimeServiceError) {
      throw error;
    }

    console.error("Failed to query results via runtime:", error);
    throw new RuntimeServiceError(
      "結果の検索に失敗しました",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
};

const openContent = async (): Promise<void> => {
  try {
    await sendRuntimeMessage({ type: MessageType.OPEN_POPUP });
  } catch (error) {
    console.error(`Failed to open Content:`, error);
    // WARN: 処理が失敗した場合はPopup のサービスを表示する
    // Contentが表示できない場合はにPopupを表示する
    contentService.open({});
  }
};

const closeContent = async (): Promise<void> => {
  try {
    await sendRuntimeMessage({ type: MessageType.CLOSE_POPUP });
  } catch (error) {
    console.error(`Failed to close Content:`, error);
    // WARN: 処理が失敗した場合は Popup のサービスを表示する
    // Contentが表示できない場合はにPopupを表示する
    contentService.close();
  }
};

export const createRuntimeService = (): RuntimeService => ({
  createTab,
  updateTab,
  removeTab,
  queryResults,
  openContent,
  closeContent,
});

export const runtimeService = createRuntimeService();
