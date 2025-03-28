import "@/assets/global.css";
import React, { useState } from "react";
import MagnifyingGlassIcon from "@heroicons/react/16/solid/MagnifyingGlassIcon";

import useQueryResult from "@/hooks/query/useQueryResult";
import useQueryControl from "@/hooks/query/useQueryControl";
import useArrowKeyControl from "@/hooks/useArrowKeyControl";
import useEnterKeyControl from "@/hooks/useEnterKeyControl";
import usePopupShortcut from "@/hooks/usePopupShortcut";

import Badge from "@/components/common/icon/Badge";
import SquareBadge from "@/components/common/icon/SquareBadge";
import SearchInput from "@/components/common/SearchInput";
import ResultFooter from "@/components/common/result/ResultFooter";
import ResultLine from "@/components/common/result/item/ResultLine";

import { ResultType } from "@/types/result";

export default function App() {
  const { query, type, suggestion, setQuery, setType, reset } =
    useQueryControl();
  const [isComposing, setIsComposing] = useState(false);

  const { result } = useQueryResult(query, type);
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
    <div className="min-w-[700px] max-w-min">
      <div className="px-6 py-2 space-y-2 text-gray-200 bg-gray-800 border-2 border-solid shadow-xl border-sky-500">
        <SearchInput
          className="text-gray-200 bg-gray-800 "
          value={query}
          leftContent={
            type === ResultType.All ? (
              <MagnifyingGlassIcon className="text-gray-400 size-6" />
            ) : (
              <Badge className="bg-sky-500" label={type} />
            )
          }
          rightContent={
            suggestion ? (
              <div className="flex space-x-1">
                <div>Change to</div>
                <div className="font-bold">{suggestion}</div>
                <SquareBadge className="ml-1 bg-gray-500">Tab</SquareBadge>
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
            <div className="pt-3 pb-2 bg-gray-800">
              <ul
                className="space-y-1 overflow-x-hidden overflow-y-auto hidden-scrollbar max-h-56"
                ref={listRef}
              >
                {result.map((item, index) => (
                  <ResultLine
                    key={index}
                    className="hover:bg-sky-700 hover:opacity-80 hover:cursor-pointer"
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
        <ResultFooter>
          {result.length ? (
            <p className="text-right text-gray-400">
              {result.length} Results Found
            </p>
          ) : (
            <p className="text-right text-gray-400">No Results Found</p>
          )}
        </ResultFooter>
      </div>
    </div>
  );
}
