import useControlTab from "@/hooks/useControlTab";

import { Result, ResultType } from "@/types/result";

export default function useEnterKeyControl() {
  const { updateTab, createTab } = useControlTab();

  const onAction = (result: Result) => {
    alert(`Enter key pressed ${JSON.stringify(result)}`);

    if (
      [ResultType.Bookmark, ResultType.History, ResultType.Google].includes(
        result.type
      )
    ) {
      alert("Enter key pressed");

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
