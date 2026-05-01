import "@/assets/global.css";
import MagnifyingGlassIcon from "@heroicons/react/16/solid/MagnifyingGlassIcon";
import clsx from "clsx";
import type React from "react";
import { useCallback } from "react";
import Badge from "@/features/search/components/Badge/Badge";
import ResultFooter from "@/features/search/components/ResultFooter/ResultFooter";
import ResultList from "@/features/search/components/ResultList/ResultList";
import SearchInput, {
  commonClassName as searchInputClassName,
} from "@/features/search/components/SearchInput/SearchInput";
import SquareBadge from "@/features/search/components/SquareBadge/SquareBadge";
import useControlTab from "@/features/search/hooks/useControlTab";
import useSearch from "@/features/search/hooks/useSearch";
import useSearchKeyboard from "@/features/search/hooks/useSearchKeyboard";
import useSearchResults from "@/features/search/hooks/useSearchResults";
import useSearchShortcut from "@/features/search/hooks/useSearchShortcut";
import { isTabResult, type Kind, type Result } from "@/services/result";
import Layout, {
  commonClassName as layoutClassName,
} from "@/shared/components/Layout/Layout";
import { useTranslation } from "@/shared/hooks/useTranslation";

export type SearchAppProps = {
  onClose?: () => void;
  variant?: "popup" | "sidepanel";
};

export default function SearchApp({
  onClose = () => window.close(),
  variant = "popup",
}: SearchAppProps) {
  const { t } = useTranslation();

  const {
    state: { query, type, suggestion, categories },
    debouncedQuery,
    isComposing,
    setQuery,
    updateType,
    updateCategory,
    reset,
    setIsComposing,
  } = useSearch();

  const { results, loading: resultsLoading } = useSearchResults({
    query: debouncedQuery,
    categories,
  });

  const { updateTab, createTab } = useControlTab();

  const handleSelect = useCallback(
    (result: Result<Kind>) => {
      onClose();

      if (isTabResult(result)) {
        const { id: tabId, windowId } = result.data;
        updateTab(tabId, windowId);
        return;
      }

      if (
        ["Bookmark", "History", "Suggestion", "Action.Calculation"].includes(
          result.type,
        )
      ) {
        createTab(result.url);
        return;
      }
    },
    [onClose, updateTab, createTab],
  );

  const handleTab = useCallback(() => {
    if (!suggestion) return;
    updateType(suggestion);
    updateCategory(suggestion);
  }, [suggestion, updateType, updateCategory]);

  const handleBackspace = useCallback(() => {
    if (query || (type !== "All" && query)) {
      return;
    }
    reset();
  }, [query, type, reset]);

  const {
    selectedIndex,
    listRef,
    resetSelectedIndex,
    handleNavigationKey,
    handleEnterKey: handleEnter,
    handleTabKey: handleTab_,
    handleBackspaceKey: handleBackspace_,
    handleEscapeKey: handleEscape,
  } = useSearchKeyboard(
    {
      results,
      isComposing,
      onSelect: handleSelect,
      onTab: handleTab,
      onBackspace: handleBackspace,
      onEscape: onClose,
    },
    {
      enableVimBindings: false,
      enableEmacsBindings: false,
    },
  );

  const { isShortcutPressed } = useSearchShortcut();

  const handleShortcutKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (isShortcutPressed(e)) {
        e.preventDefault();
        onClose();
      }
    },
    [isShortcutPressed, onClose],
  );

  const isSidepanel = variant === "sidepanel";

  return (
    <Layout className={isSidepanel ? "w-full h-screen" : "w-[700px]"}>
      <div
        className={clsx(
          layoutClassName.bg,
          layoutClassName.text,
          layoutClassName.p,
          !isSidepanel && layoutClassName.space,
          !isSidepanel && layoutClassName.border,
          !isSidepanel && layoutClassName.shadow,
          isSidepanel && "flex flex-col h-full overflow-hidden gap-2",
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
                  searchInputClassName.icon.size,
                )}
              />
            ) : (
              <Badge className={searchInputClassName.badge.text} label={type} />
            )
          }
          rightContent={
            suggestion ? (
              <div className="flex items-center space-x-1">
                <div>{t("actions.changeTo")}</div>
                <div className={searchInputClassName.right.text}>
                  {suggestion}
                </div>
                <SquareBadge
                  className={clsx("ml-1", searchInputClassName.badge.bg)}
                >
                  {t("searchTypes.tab")}
                </SquareBadge>
              </div>
            ) : null
          }
          onChange={(e) => {
            setQuery(e.target.value);
            resetSelectedIndex();
          }}
          onKeyDown={handleShortcutKey}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onArrowUpDownKeyDown={handleNavigationKey}
          onEnterKeyDown={handleEnter}
          onTabKeyDown={handleTab_}
          onEscapeKeyDown={handleEscape}
          onBackspaceKeyDown={handleBackspace_}
        />
        <div className="border-t border-gray-700 border-solid" />
        <ResultList
          ref={listRef}
          items={results}
          onClick={handleSelect}
          selectedIndex={selectedIndex}
          className={isSidepanel ? "flex-1 min-h-0 flex flex-col" : undefined}
          listClassName={isSidepanel ? "flex-1 overflow-y-auto" : "max-h-56"}
        />
        <div className="border-t border-gray-700 border-solid" />
        <ResultFooter count={results.length} loading={resultsLoading} />
      </div>
    </Layout>
  );
}
