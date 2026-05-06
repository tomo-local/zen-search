import type {
  Kind,
  QueryResultsRequest,
  Result,
} from "@/services/result/types";
import type {
  SearchEngineValue,
  ThemeValue,
  ViewModeValue,
} from "@/services/storage/types";
import type {
  CreateTabRequest,
  RemoveTabRequest,
  UpdateTabRequest,
} from "@/services/tab/types";
import { KEEPALIVE_INTERVAL_MS } from "./constants";
import runtimeServiceDependencies from "./container";
import type { RuntimeService } from "./interface";
import { logger, RuntimeServiceError, toError } from "./internal";
import { isRuntimeResponse, MessageType } from "./types";

function connectPort(
  name: string,
  onMessage?: (message: unknown) => void,
  attemptCount = 0,
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
    const delay = Math.min(1000 * 2 ** attemptCount, 30000);
    setTimeout(() => connectPort(name, onMessage, attemptCount + 1), delay);
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
    const raw: unknown = await chrome.runtime.sendMessage({
      type: MessageType.QUERY_RESULT,
      filters,
    });

    if (!isRuntimeResponse<Result<Kind>[]>(raw)) {
      throw new RuntimeServiceError(
        "Unexpected response shape from QUERY_RESULT",
      );
    }

    return raw.result;
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

const getTheme = async (): Promise<ThemeValue> => {
  try {
    const raw: unknown = await chrome.runtime.sendMessage({
      type: MessageType.GET_THEME,
    });
    if (!isRuntimeResponse<ThemeValue>(raw)) {
      throw new RuntimeServiceError("Unexpected response shape from GET_THEME");
    }
    return raw.result;
  } catch (error) {
    if (error instanceof RuntimeServiceError) throw error;
    logger.error("Failed to get theme via runtime:", error);
    throw new RuntimeServiceError("Failed to get theme", toError(error));
  }
};

const setTheme = async (theme: ThemeValue): Promise<void> => {
  try {
    await chrome.runtime.sendMessage({ type: MessageType.SET_THEME, theme });
  } catch (error) {
    logger.error("Failed to set theme via runtime:", error);
    throw new RuntimeServiceError("Failed to set theme", toError(error));
  }
};

const getViewMode = async (): Promise<ViewModeValue> => {
  try {
    const raw: unknown = await chrome.runtime.sendMessage({
      type: MessageType.GET_VIEW_MODE,
    });
    if (!isRuntimeResponse<ViewModeValue>(raw)) {
      throw new RuntimeServiceError(
        "Unexpected response shape from GET_VIEW_MODE",
      );
    }
    return raw.result;
  } catch (error) {
    if (error instanceof RuntimeServiceError) throw error;
    logger.error("Failed to get viewMode via runtime:", error);
    throw new RuntimeServiceError("Failed to get viewMode", toError(error));
  }
};

const setViewMode = async (viewMode: ViewModeValue): Promise<void> => {
  try {
    await chrome.runtime.sendMessage({
      type: MessageType.SET_VIEW_MODE,
      viewMode,
    });
  } catch (error) {
    logger.error("Failed to set viewMode via runtime:", error);
    throw new RuntimeServiceError("Failed to set viewMode", toError(error));
  }
};

const getSearchEngines = async (): Promise<SearchEngineValue[]> => {
  try {
    const raw: unknown = await chrome.runtime.sendMessage({
      type: MessageType.GET_SEARCH_ENGINES,
    });
    if (!isRuntimeResponse<SearchEngineValue[]>(raw)) {
      throw new RuntimeServiceError(
        "Unexpected response shape from GET_SEARCH_ENGINES",
      );
    }
    return raw.result;
  } catch (error) {
    if (error instanceof RuntimeServiceError) throw error;
    logger.error("Failed to get searchEngines via runtime:", error);
    throw new RuntimeServiceError(
      "Failed to get searchEngines",
      toError(error),
    );
  }
};

const setSearchEngines = async (
  engines: SearchEngineValue[],
): Promise<void> => {
  try {
    await chrome.runtime.sendMessage({
      type: MessageType.SET_SEARCH_ENGINES,
      engines,
    });
  } catch (error) {
    logger.error("Failed to set searchEngines via runtime:", error);
    throw new RuntimeServiceError(
      "Failed to set searchEngines",
      toError(error),
    );
  }
};

const createRuntimeService = (): RuntimeService => ({
  createTab,
  updateTab,
  removeTab,
  queryResults,
  openContent,
  closeContent,
  connectPort,
  getTheme,
  setTheme,
  getViewMode,
  setViewMode,
  getSearchEngines,
  setSearchEngines,
});

export const runtimeService = createRuntimeService();
