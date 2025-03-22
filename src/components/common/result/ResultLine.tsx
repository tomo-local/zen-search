import TabItem from "@/components/common/result/TabItem";
import SuggestionItem from "@/components/common/result/SuggestionItem";
import HistoryItem from "@/components/common/result/HistoryItem";

import { Tab, History } from "@/types/chrome";
import { Suggestion } from "@/types/google";
import { ResultType, Result } from "@/types/result";

type LineProps = {
  key: number;
  item: Result;
  isSelected: boolean;
};

export default function ResultLine({ key, item, isSelected }: LineProps) {
  if (item.type === ResultType.Tab) {
    return <TabItem key={key} item={item as Tab} isSelected={isSelected} />;
  }

  if (item.type === ResultType.Google) {
    return (
      <SuggestionItem
        key={key}
        item={item as Suggestion}
        isSelected={isSelected}
      />
    );
  }

  if (item.type === ResultType.History) {
    return (
      <HistoryItem key={key} item={item as History} isSelected={isSelected} />
    );
  }

  return null;
}
