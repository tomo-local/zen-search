import { useCallback } from "react";
import { runtimeService } from "@/services/runtime";

export default function useTabControl() {
  const createTab = useCallback(async (url: string) => {
    try {
      await runtimeService.createTab({ url });
    } catch (error) {
      console.error("Failed to create tab:", error);
    }
  }, []);

  const updateTab = useCallback(async (tabId: number, windowId?: number) => {
    try {
      await runtimeService.updateTab({ tabId, windowId });
    } catch (error) {
      console.error("Failed to update tab:", error);
    }
  }, []);

  const removeTab = useCallback(async (tabId: number) => {
    try {
      await runtimeService.removeTab({ tabId });
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
