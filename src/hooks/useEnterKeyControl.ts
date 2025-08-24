import useControlTab from "@/hooks/useControlTab";
import { ActionType } from "@/services/action/types";
import { type Result, ResultType } from "@/types/result";

export default function useEnterKeyControl() {
  const { updateTab, createTab } = useControlTab();

  const onAction = (result: Result) => {
    if (
      [
        ResultType.Bookmark,
        ResultType.History,
        ResultType.Google,
        ActionType.Calculation,
      ].includes(result.type)
    ) {
      createTab(result.url);
      return;
    }

    if (result.type === ResultType.Tab) {
      const { id, data } = result;
      updateTab(id, data.windowId);
      return;
    }
  };

  return {
    onAction,
  };
}
