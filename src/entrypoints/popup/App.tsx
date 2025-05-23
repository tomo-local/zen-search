import "@/assets/global.css";
import React, { useState } from "react";
import MagnifyingGlassIcon from "@heroicons/react/16/solid/MagnifyingGlassIcon";
import clsx from "clsx";

import useQueryResult from "@/hooks/useResults";
import useQueryControl from "@/hooks/query/useQueryControl";
import useArrowKeyControl from "@/hooks/useArrowKeyControl";
import useEnterKeyControl from "@/hooks/useEnterKeyControl";
import usePopupShortcut from "@/hooks/usePopupShortcut";

import Layout, {
  commonClassName as layoutClassName,
} from "@/components/widgets/common/Layout";
import SearchInput, {
  commonClassName as searchInputClassName,
} from "@/components/widgets/common/SearchInput";
import Badge from "@/components/modules/icon/Badge";
import SquareBadge from "@/components/modules/icon/SquareBadge";
import ResultFooter from "@/components/widgets/common/ResultFooter";
import ResultLine from "@/components/widgets/common/ResultLine/ResultLine";

import { ResultType } from "@/types/result";

export default function App() {
  const { query, type, suggestion, setQuery, setType, reset } =
    useQueryControl();
  const [isComposing, setIsComposing] = useState(false);
  const { result, loading } = useQueryResult(query, type);
  const { selectedIndex, listRef, handleArrowUpDownKey } =
    useArrowKeyControl(result);
  const { onAction } = useEnterKeyControl();
  const { shortcut } = usePopupShortcut();

  const handleClose = () => window.close();

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (isComposing) {
      return;
    }

    e.preventDefault();
    handleClose();
    onAction(result[selectedIndex]);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (!suggestion || isComposing) {
      return;
    }
    setType(suggestion);
  };

  const handleBackspaceKeyDown = (e: React.KeyboardEvent) => {
    if (query || (type! == ResultType.All && query)) {
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
            type === ResultType.All ? (
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
        {result?.length ? (
          <>
            <div className="border-t border-gray-700 border-solid" />
            <div className="pt-3 pb-2 dark:bg-gray-800">
              <ul
                className="space-y-1 overflow-x-hidden overflow-y-auto hidden-scrollbar max-h-56"
                ref={listRef}
              >
                {result.map((item, index) => (
                  <ResultLine
                    key={index}
                    onClick={() => onAction(item)}
                    item={item}
                    isSelected={index === selectedIndex}
                  />
                ))}
              </ul>
            </div>
          </>
        ) : null}
        <div className="border-t border-gray-700 border-solid" />
        <ResultFooter result={result} loading={loading} />
      </div>
    </Layout>
  );
}
