/**
 * useSearchKeyboard - キーボードナビゲーションを管理するhook
 *
 * useNavigationKey / useSubmitKey / useEscapeKey を束ねるオーケストレーター。
 * 各サブhookは単独でテスト・拡張可能。
 *
 * @example
 * ```tsx
 * const {
 *   selectedIndex,
 *   listRef,
 *   handleKeyDown,
 * } = useSearchKeyboard(
 *   {
 *     results,
 *     isComposing,
 *     onSelect: (result) => console.log(result),
 *   },
 *   { enableVimBindings: true }
 * );
 * ```
 */

import { useCallback, useMemo } from "react";
import { DEFAULT_OPTIONS } from "./constants";
import { debounce } from "./helper";
import type {
  UseSearchKeyboardOptions,
  UseSearchKeyboardParams,
  UseSearchKeyboardReturn,
} from "./types";
import useEscapeKey from "./useEscapeKey";
import useNavigationKey from "./useNavigationKey";
import useSubmitKey from "./useSubmitKey";

export default function useSearchKeyboard(
  params: UseSearchKeyboardParams,
  options: UseSearchKeyboardOptions = {},
): UseSearchKeyboardReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { results, isComposing, onSelect, onTab, onBackspace, onEscape } =
    params;

  const navigation = useNavigationKey(
    { resultsLength: results.length, isComposing },
    opts,
  );

  const submit = useSubmitKey(
    {
      results,
      selectedIndex: navigation.selectedIndex,
      isComposing,
      onSelect,
      onTab,
      onBackspace,
    },
    opts,
  );

  const escapeKey = useEscapeKey({ onEscape });

  const {
    handleNavigationKey,
    setSelectedIndex,
    resetSelectedIndex,
    selectedIndex,
    listRef,
  } = navigation;
  const { handleEnterKey, handleTabKey, handleBackspaceKey } = submit;
  const { handleEscapeKey } = escapeKey;

  const handleKeyDownRaw = useCallback(
    (e: React.KeyboardEvent) => {
      handleNavigationKey(e);
      handleEscapeKey(e);
      handleEnterKey(e);
      handleTabKey(e);
      handleBackspaceKey(e);
    },
    [
      handleNavigationKey,
      handleEscapeKey,
      handleEnterKey,
      handleTabKey,
      handleBackspaceKey,
    ],
  );

  const handleKeyDown = useMemo(() => {
    if (opts.keyDebounceMs > 0) {
      return debounce(handleKeyDownRaw, opts.keyDebounceMs);
    }
    return handleKeyDownRaw;
  }, [handleKeyDownRaw, opts.keyDebounceMs]);

  return {
    selectedIndex,
    listRef,
    setSelectedIndex,
    resetSelectedIndex,
    handleNavigationKey,
    handleEnterKey,
    handleTabKey,
    handleBackspaceKey,
    handleEscapeKey,
    handleKeyDown,
  };
}
