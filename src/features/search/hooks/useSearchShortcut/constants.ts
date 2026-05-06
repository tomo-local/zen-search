/**
 * useSearchShortcut関連の定数
 */

import type { UseSearchShortcutOptions } from "./types";

/** デフォルトオプション */
export const DEFAULT_OPTIONS: Required<UseSearchShortcutOptions> = {
  enableCustomShortcuts: false,
  helpKey: "?",
  enableConflictDetection: true,
};

/** キーマップ（記号 → 正規化） */
export const KEY_MAP: Record<string, string> = {
  "⇧": "shift",
  "⌘": "meta",
  "⌃": "control",
  "⌥": "alt",
  "←": "arrowleft",
  "→": "arrowright",
  "↑": "arrowup",
  "↓": "arrowdown",
  " ": "space",
};

/** 修飾キーのリスト */
export const MODIFIER_KEYS = ["ctrl", "alt", "meta", "shift"] as const;

/** カスタムショートカットのストレージキー */
export const CUSTOM_SHORTCUTS_STORAGE_KEY = "zen-search:custom-shortcuts";

/** ショートカットヘルプの内容 */
export const SHORTCUT_HELP = {
  navigation: {
    title: "ナビゲーション",
    shortcuts: [
      { keys: "↑/↓", description: "上下移動" },
      { keys: "j/k", description: "上下移動 (Vim)" },
      { keys: "Ctrl+N/P", description: "上下移動 (Emacs)" },
      { keys: "Home/End", description: "最初/最後へ" },
      { keys: "PageUp/Down", description: "ページ移動" },
    ],
  },
  actions: {
    title: "アクション",
    shortcuts: [
      { keys: "Enter", description: "選択実行" },
      { keys: "Tab", description: "サジェスト適用" },
      { keys: "Backspace", description: "戻る" },
      { keys: "Esc", description: "閉じる" },
    ],
  },
  help: {
    title: "ヘルプ",
    shortcuts: [{ keys: "?", description: "このヘルプを表示" }],
  },
} as const;
