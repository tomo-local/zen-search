import { useCallback } from "react";
import type {
  CreateMessage,
  RemoveMessage,
  UpdateMessage,
} from "@/types/chrome";
import { MessageType } from "@/types/result";

const { CREATE_TAB, UPDATE_TAB, REMOVE_TAB } = MessageType;

export default function useTabControl() {
  const createTab = useCallback(async (url: string) => {
    try {
      const message: Omit<CreateMessage, "type"> = { url };
      await chrome.runtime.sendMessage({ type: CREATE_TAB, ...message });
    } catch (error) {
      console.error("Failed to create tab:", error);
    }
  }, []);

  const updateTab = useCallback(async (tabId: number, windowId?: number) => {
    try {
      const message: Omit<UpdateMessage, "type"> = { tabId, windowId };
      await chrome.runtime.sendMessage({ type: UPDATE_TAB, ...message });
    } catch (error) {
      console.error("Failed to update tab:", error);
    }
  }, []);

  const removeTab = useCallback(async (tabId: number) => {
    try {
      const message: Omit<RemoveMessage, "type"> = { tabId };
      await chrome.runtime.sendMessage({ type: REMOVE_TAB, ...message });
    } catch (error) {
      console.error("Failed to remove tab:", error);
    }
  }, []);

  return {
    createTab,
    updateTab,
    removeTab,
  };
}
