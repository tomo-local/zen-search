import useControlTab from "@/hooks/useControlTab";
import type { Kind, Result } from "@/services/result/types";

export default function useEnterKeyControl() {
  const { updateTab, createTab } = useControlTab();

  const onAction = (result: Result<Kind>) => {
    if (result.type === "Tab") {
      const tab = result as Result<"Tab">;
      const { id: tabId, windowId } = tab.data;
      updateTab(tabId, windowId);
      return;
    }

    if (
      ["Bookmark", "History", "Suggestion", "ActionCalculation"].includes(
        result.type,
      )
    ) {
      createTab(result.url);
      return;
    }
  };

  return {
    onAction,
  };
}
