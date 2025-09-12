import "@/assets/global.css";
import MagnifyingGlassIcon from "@heroicons/react/16/solid/MagnifyingGlassIcon";
import clsx from "clsx";
import type React from "react";
import { useState } from "react";
import Badge from "@/components/modules/Badge/Badge";
import Layout, {
  commonClassName as layoutClassName,
} from "@/components/modules/Layout/Layout";
import SquareBadge from "@/components/modules/SquareBadge/SquareBadge";
import ResultFooter from "@/components/widgets/ResultFooter/ResultFooter";
import ResultList from "@/components/widgets/ResultList/ResultList";
import SearchInput, {
  commonClassName as searchInputClassName,
} from "@/components/widgets/SearchInput/SearchInput";
import useArrowKeyControl from "@/hooks/useArrowKeyControl";
import useEnterKeyControl from "@/hooks/useEnterKeyControl";
import usePopupShortcut from "@/hooks/usePopupShortcut";
import useQueryControl from "@/hooks/useQueryControl";
import useResult from "@/hooks/useResult";

export default function App() {
  const { query, type, suggestion, setQuery, setType, reset, categories } =
    useQueryControl();
  const [isComposing, setIsComposing] = useState(false);
  const { results, loading: resultsLoading } = useResult(query, categories);
  const { selectedIndex, listRef, handleArrowUpDownKey } =
    useArrowKeyControl(results);
  const { onAction } = useEnterKeyControl();
  const { shortcut } = usePopupShortcut();

  const handleClose = () => window.close();

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (isComposing) {
      return;
    }

    e.preventDefault();
    handleClose();
    onAction(results[selectedIndex]);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (!suggestion || isComposing) {
      return;
    }
    setType(suggestion);
  };

  const handleBackspaceKeyDown = (e: React.KeyboardEvent) => {
    if (query || (type !== "All" && query)) {
      return;
    }
    e.preventDefault();
    reset();
  };

  const handleCommandKeyDown = async (e: React.KeyboardEvent) => {
    if (!shortcut.length) {
      return;
    }

    const { key, altKey, ctrlKey, metaKey, shiftKey } = e;

    const pressedKeys = [
      key.toLowerCase(),
      altKey ? "alt" : "",
      ctrlKey ? "control" : "",
      metaKey ? "meta" : "",
      shiftKey ? "shift" : "",
    ]
      .filter(Boolean)
      .sort();

    if (
      shortcut.length === pressedKeys.length &&
      shortcut.every((key, index) => key === pressedKeys[index])
    ) {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <Layout className="min-w-[700px] max-w-min">
      <div
        className={clsx(
          layoutClassName.bg,
          layoutClassName.text,
          layoutClassName.border,
          layoutClassName.shadow,
          layoutClassName.p,
          layoutClassName.space
        )}
      >
        <SearchInput
          className={clsx(searchInputClassName.text, searchInputClassName.bg)}
          value={query}
          leftContent={
            type === "All" ? (
              <MagnifyingGlassIcon
                className={clsx(
                  searchInputClassName.icon.text,
                  searchInputClassName.icon.size
                )}
              />
            ) : (
              <Badge className={searchInputClassName.badge.text} label={type} />
            )
          }
          rightContent={
            suggestion ? (
              <div className="flex items-center space-x-1">
                <div>Change to</div>
                <div className={searchInputClassName.right.text}>
                  {suggestion}
                </div>
                <SquareBadge
                  className={clsx("ml-1", searchInputClassName.badge.bg)}
                >
                  Tab
                </SquareBadge>
              </div>
            ) : null
          }
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleCommandKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onArrowUpDownKeyDown={handleArrowUpDownKey}
          onEnterKeyDown={handleEnterKey}
          onTabKeyDown={handleTabKeyDown}
          onEscapeKeyDown={handleClose}
          onBackspaceKeyDown={handleBackspaceKeyDown}
        />
        <div className="border-t border-gray-700 border-solid" />
        <ResultList
          ref={listRef}
          items={results}
          selectedIndex={selectedIndex}
        />
        <div className="border-t border-gray-700 border-solid" />
        <ResultFooter count={results.length} loading={resultsLoading} />
      </div>
    </Layout>
  );
}
