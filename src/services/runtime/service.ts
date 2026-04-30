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

export interface RuntimeService {
  createTab: (request: CreateTabRequest) => Promise<void>;
  updateTab: (request: UpdateTabRequest) => Promise<void>;
  removeTab: (request: RemoveTabRequest) => Promise<void>;
  queryResults: (request: QueryResultsRequest) => Promise<Result<Kind>[]>;
  openContent: () => Promise<void>;
  closeContent: () => Promise<void>;
  /**
   * MV3 Service Worker のアイドル停止を防ぐための永続ポート接続を確立する。
   * 接続が切断された場合（SW 強制終了時）は自動的に再接続する。
   *
   * @param name - ポート名（background の onConnect で識別される）
   * @param onMessage - ポート経由で受信したメッセージのハンドラ（省略可）
   */
  connectPort: (name: string, onMessage?: (message: unknown) => void) => void;
}

// SW の30秒アイドルタイマーをリセットするための ping 間隔
const KEEPALIVE_INTERVAL_MS = 25000;

function connectPort(
  name: string,
  onMessage?: (message: unknown) => void,
): void {
  const port = chrome.runtime.connect({ name });
  const interval = setInterval(
    () => port.postMessage({ type: "PING" }),
    KEEPALIVE_INTERVAL_MS,
  );

  if (onMessage) {
    port.onMessage.addListener(onMessage);
  }

  port.onDisconnect.addListener(() => {
    clearInterval(interval);
    connectPort(name, onMessage);
  });
}

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

const queryResults = async ({
  filters,
}: QueryResultsRequest): Promise<Result<Kind>[]> => {
  try {
    const response = (await chrome.runtime.sendMessage({
      type: MessageType.QUERY_RESULT,
      filters,
    })) as RuntimeResponse<Result<Kind>[]>;

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
    await chrome.runtime.sendMessage({ type: MessageType.OPEN_POPUP });
  } catch (error) {
    console.error(`Failed to open Content:`, error);
    // WARN: 処理が失敗した場合はPopup のサービスを表示する
    // Contentが表示できない場合はにPopupを表示する
    contentService.open({});
  }
};

const closeContent = async (): Promise<void> => {
  try {
    await chrome.runtime.sendMessage({ type: MessageType.CLOSE_POPUP });
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
  connectPort,
});

export const runtimeService = createRuntimeService();
