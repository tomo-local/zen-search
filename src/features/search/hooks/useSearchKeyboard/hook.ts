/**
 * useSearchKeyboard - キーボードナビゲーションを管理するhook
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_OPTIONS,
  EMACS_KEYBINDINGS,
  STANDARD_KEYBINDINGS,
  VIM_KEYBINDINGS,
} from "./constants";
import {
  calculateNewIndex,
  debounce,
  findAction,
  scrollToIndex,
} from "./helper";
import type {
  KeyBinding,
  UseSearchKeyboardOptions,
  UseSearchKeyboardParams,
  UseSearchKeyboardReturn,
} from "./types";

/**
 * キーボードナビゲーションを管理するhook
 *
 * @description
 * このhookは以下の機能を提供します：
 * - Arrowキーによるナビゲーション
 * - Vim風キーバインド（j/k/g/G）
 * - Emacs風キーバインド（Ctrl+N/P）
 * - Home/End/PageUp/PageDownキー
 * - Enter/Tab/Backspace/Escapeキー
 * - IME入力中の誤動作防止
 * - スムーズスクロール
 * - キー操作のデバウンス（連打対策）
 *
 * @param params - パラメータ
 * @param options - オプション設定
 * @returns キーボード操作関数とstate
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
export default function useSearchKeyboard(
  params: UseSearchKeyboardParams,
  options: UseSearchKeyboardOptions = {},
): UseSearchKeyboardReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { results, isComposing, onSelect, onTab, onBackspace, onEscape } =
    params;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const lastKeyPressRef = useRef<string>("");
  const lastKeyTimeRef = useRef<number>(0);

  // キーバインドの統合
  const keyBindings = useMemo<KeyBinding[]>(() => {
    const bindings = [...STANDARD_KEYBINDINGS];

    if (opts.enableVimBindings) {
      bindings.push(...VIM_KEYBINDINGS);
    }

    if (opts.enableEmacsBindings) {
      bindings.push(...EMACS_KEYBINDINGS);
    }

    return bindings;
  }, [opts.enableVimBindings, opts.enableEmacsBindings]);

  // 選択項目が変更されたらスクロール
  useEffect(() => {
    scrollToIndex(listRef, selectedIndex, opts.scrollBehavior);
  }, [selectedIndex, opts.scrollBehavior]);

  /**
   * インデックスをリセット
   */
  const resetSelectedIndex = useCallback(() => {
    setSelectedIndex(0);
  }, []);

  /**
   * ナビゲーションキーのハンドラー
   */
  const handleNavigationKey = useCallback(
    (e: React.KeyboardEvent) => {
      // IME入力中は無効化
      if (opts.disableOnComposing && isComposing) {
        return;
      }

      // Vim風のgg（最初に移動）の処理
      if (opts.enableVimBindings && e.key === "g") {
        const now = Date.now();
        if (
          lastKeyPressRef.current === "g" &&
          now - lastKeyTimeRef.current < 500
        ) {
          e.preventDefault();
          setSelectedIndex(0);
          lastKeyPressRef.current = "";
          return;
        }
        lastKeyPressRef.current = "g";
        lastKeyTimeRef.current = now;
        return;
      }

      // キーバインドからアクションを検索
      const action = findAction(e, keyBindings);

      if (action) {
        e.preventDefault();

        const newIndex = calculateNewIndex(
          action,
          selectedIndex,
          results.length,
          opts.pageStep,
        );

        setSelectedIndex(newIndex);
        lastKeyPressRef.current = "";
      }
    },
    [
      opts.disableOnComposing,
      opts.enableVimBindings,
      opts.pageStep,
      isComposing,
      keyBindings,
      selectedIndex,
      results.length,
    ],
  );

  /**
   * Enterキーのハンドラー
   */
  const handleEnterKey = useCallback(
    (e: React.KeyboardEvent) => {
      // IME入力中は無効化
      if (opts.disableOnComposing && isComposing) {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) {
          onSelect(selectedResult);
        }
      }
    },
    [opts.disableOnComposing, isComposing, results, selectedIndex, onSelect],
  );

  /**
   * Tabキーのハンドラー
   */
  const handleTabKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        // IME入力中は無効化
        if (opts.disableOnComposing && isComposing) {
          return;
        }
        onTab?.();
      }
    },
    [opts.disableOnComposing, isComposing, onTab],
  );

  /**
   * Backspaceキーのハンドラー
   */
  const handleBackspaceKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Backspace") {
        onBackspace?.();
      }
    },
    [onBackspace],
  );

  /**
   * Escapeキーのハンドラー
   */
  const handleEscapeKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
      }
    },
    [onEscape],
  );

  /**
   * すべてのキーイベントを統合したハンドラー
   */
  const handleKeyDownRaw = useCallback(
    (e: React.KeyboardEvent) => {
      handleNavigationKey(e);
      handleEnterKey(e);
      handleTabKey(e);
      handleBackspaceKey(e);
      handleEscapeKey(e);
    },
    [
      handleNavigationKey,
      handleEnterKey,
      handleTabKey,
      handleBackspaceKey,
      handleEscapeKey,
    ],
  );

  // デバウンス処理
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
