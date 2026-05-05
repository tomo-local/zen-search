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
import { KEEPALIVE_INTERVAL_MS } from "./constants";
import runtimeServiceDependencies from "./container";
import { RuntimeServiceError, toError } from "./error";
import type { RuntimeService } from "./interface";
import { createRuntimeLogger } from "./logger";
import { MessageType, type RuntimeResponse } from "./types";

const logger = createRuntimeLogger();

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

    logger.error("Failed to create tab via runtime:", error);
    throw new RuntimeServiceError("Failed to create tab", toError(error));
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

    logger.error("Failed to update tab via runtime:", error);
    throw new RuntimeServiceError("Failed to update tab", toError(error));
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

    logger.error("Failed to remove tab via runtime:", error);
    throw new RuntimeServiceError("Failed to remove tab", toError(error));
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

    logger.error("Failed to query results via runtime:", error);
    throw new RuntimeServiceError("Failed to query results", toError(error));
  }
};

const openContent = async (): Promise<void> => {
  try {
    await chrome.runtime.sendMessage({ type: MessageType.OPEN_POPUP });
  } catch (error) {
    logger.error("Failed to open content:", error);
    // WARN: 処理が失敗した場合はPopup のサービスを表示する
    // Contentが表示できない場合はにPopupを表示する
    runtimeServiceDependencies.contentService.open({});
  }
};

const closeContent = (): void => {
  runtimeServiceDependencies.contentService.close();
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
