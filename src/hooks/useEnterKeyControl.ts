import useControlTab from "@/hooks/useControlTab";

import { Result, ResultType } from "@/types/result";
import { ActionType } from "@/types/action";

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
      const { id, windowId } = result;
      updateTab(id, windowId);
      return;
    }
  };

  return {
    onAction,
  };
}
