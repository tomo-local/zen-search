/**
 * useNavigationKey - Arrow / Vim / Emacs キーによるナビゲーションを管理するhook
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EMACS_KEYBINDINGS,
  STANDARD_KEYBINDINGS,
  VIM_KEYBINDINGS,
} from "./constants";
import { calculateNewIndex, findAction, scrollToIndex } from "./helper";
import type { KeyBinding, UseSearchKeyboardOptions } from "./types";

interface UseNavigationKeyParams {
  resultsLength: number;
  isComposing: boolean;
}

interface UseNavigationKeyReturn {
  selectedIndex: number;
  listRef: React.RefObject<HTMLUListElement | null>;
  setSelectedIndex: (index: number) => void;
  resetSelectedIndex: () => void;
  handleNavigationKey: (e: React.KeyboardEvent) => void;
}

/**
 * Arrow / Vim / Emacs キーによるナビゲーションを管理するhook
 * @param params パラメータ（結果件数、IME状態）
 * @param opts キーボードオプション
 * @returns selectedIndex、listRef、ナビゲーション操作関数
 */
export default function useNavigationKey(
  params: UseNavigationKeyParams,
  opts: Required<UseSearchKeyboardOptions>,
): UseNavigationKeyReturn {
  const { resultsLength, isComposing } = params;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const vimGStateRef = useRef<"idle" | "g_pending">("idle");
  const listRef = useRef<HTMLUListElement>(null);

  const keyBindings = useMemo<KeyBinding[]>(() => {
    const bindings = [...STANDARD_KEYBINDINGS];
    if (opts.enableVimBindings) bindings.push(...VIM_KEYBINDINGS);
    if (opts.enableEmacsBindings) bindings.push(...EMACS_KEYBINDINGS);
    return bindings;
  }, [opts.enableVimBindings, opts.enableEmacsBindings]);

  useEffect(() => {
    scrollToIndex(listRef, selectedIndex, opts.scrollBehavior);
  }, [selectedIndex, opts.scrollBehavior]);

  const resetSelectedIndex = useCallback(() => setSelectedIndex(0), []);

  const handleNavigationKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (opts.disableOnComposing && isComposing) return;

      // Vim風のgg（最初に移動）の処理
      if (
        opts.enableVimBindings &&
        e.key === "g" &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        if (vimGStateRef.current === "g_pending") {
          e.preventDefault();
          setSelectedIndex(0);
          vimGStateRef.current = "idle";
        } else {
          vimGStateRef.current = "g_pending";
        }
        return;
      }

      // g_pending 中に g 以外のキーが来たらリセット
      if (vimGStateRef.current === "g_pending") {
        vimGStateRef.current = "idle";
      }

      const action = findAction(e, keyBindings);
      if (action) {
        e.preventDefault();
        setSelectedIndex(
          calculateNewIndex(
            action,
            selectedIndex,
            resultsLength,
            opts.pageStep,
          ),
        );
      }
    },
    [
      opts.disableOnComposing,
      opts.enableVimBindings,
      opts.pageStep,
      isComposing,
      keyBindings,
      selectedIndex,
      resultsLength,
    ],
  );

  return {
    selectedIndex,
    listRef,
    setSelectedIndex,
    resetSelectedIndex,
    handleNavigationKey,
  };
}
