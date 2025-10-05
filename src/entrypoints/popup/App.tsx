import "@/assets/global.css";
import MagnifyingGlassIcon from "@heroicons/react/16/solid/MagnifyingGlassIcon";
import clsx from "clsx";
import type React from "react";
import { useCallback } from "react";
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
import useControlTab from "@/hooks/useControlTab";
import useSearch from "@/hooks/useSearch";
import useSearchKeyboard from "@/hooks/useSearchKeyboard";
import useSearchResults from "@/hooks/useSearchResults";
import useSearchShortcut from "@/hooks/useSearchShortcut";
import type { Kind, Result } from "@/services/result";

export default function App() {
  // 検索状態管理
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

  // 検索結果取得
  const { results, loading: resultsLoading } = useSearchResults({
    query: debouncedQuery,
    categories,
  });

  // タブ操作
  const { updateTab, createTab } = useControlTab();

  // 選択時のアクション
  const handleSelect = useCallback(
    (result: Result<Kind>) => {
      window.close();

      if (result.type === "Tab") {
        const tab = result as Result<"Tab">;
        const { id: tabId, windowId } = tab.data;
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
    [updateTab, createTab],
  );

  // Tab押下時のハンドラー
  const handleTab = useCallback(() => {
    if (!suggestion) return;
    updateType(suggestion);
    updateCategory(suggestion);
  }, [suggestion, updateType, updateCategory]);

  // Backspace押下時のハンドラー
  const handleBackspace = useCallback(() => {
    if (query || (type !== "All" && query)) {
      return;
    }
    reset();
  }, [query, type, reset]);

  // キーボードナビゲーション
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
      onEscape: () => window.close(),
    },
    {
      enableVimBindings: false,
      enableEmacsBindings: false,
    },
  );

  // ショートカット管理
  const { isShortcutPressed } = useSearchShortcut();

  // ショートカットキー押下時のハンドラー
  const handleShortcutKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (isShortcutPressed(e)) {
        e.preventDefault();
        window.close();
      }
    },
    [isShortcutPressed],
  );

  return (
    <Layout className="min-w-[700px] max-w-min">
      <div
        className={clsx(
          layoutClassName.bg,
          layoutClassName.text,
          layoutClassName.border,
          layoutClassName.shadow,
          layoutClassName.p,
          layoutClassName.space,
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
          selectedIndex={selectedIndex}
        />
        <div className="border-t border-gray-700 border-solid" />
        <ResultFooter count={results.length} loading={resultsLoading} />
      </div>
    </Layout>
  );
}
