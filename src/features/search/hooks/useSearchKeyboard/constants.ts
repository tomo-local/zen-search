/**
 * useSearchKeyboard関連の定数
 */

import type { KeyBinding, UseSearchKeyboardOptions } from "./types";

/** デフォルトオプション */
export const DEFAULT_OPTIONS: Required<UseSearchKeyboardOptions> = {
  enableVimBindings: false,
  enableEmacsBindings: false,
  pageStep: 5,
  scrollBehavior: "smooth",
  disableOnComposing: true,
  keyDebounceMs: 0,
};

/** 標準キーバインド */
export const STANDARD_KEYBINDINGS: KeyBinding[] = [
  { key: "ArrowUp", action: "prev" },
  { key: "ArrowDown", action: "next" },
  { key: "ArrowUp", metaKey: true, action: "first" },
  { key: "ArrowDown", metaKey: true, action: "last" },
  { key: "Home", action: "first" },
  { key: "End", action: "last" },
  { key: "PageUp", action: "prevPage" },
  { key: "PageDown", action: "nextPage" },
];

/** Vimスタイルキーバインド */
export const VIM_KEYBINDINGS: KeyBinding[] = [
  { key: "j", action: "next" },
  { key: "k", action: "prev" },
  { key: "g", action: "first" }, // gg は別途実装
  { key: "G", action: "last" },
];

/** Emacsスタイルキーバインド */
export const EMACS_KEYBINDINGS: KeyBinding[] = [
  { key: "n", ctrlKey: true, action: "next" },
  { key: "p", ctrlKey: true, action: "prev" },
];
