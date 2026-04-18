/**
 * useSearchKeyboard関連の型定義
 */

import type { Kind, Result } from "@/services/result";

/** キーボードナビゲーションのオプション */
export interface UseSearchKeyboardOptions {
  /** Vim風キーバインドを有効化。デフォルト: false */
  enableVimBindings?: boolean;
  /** Emacs風キーバインド（Ctrl+N/P）を有効化。デフォルト: false */
  enableEmacsBindings?: boolean;
  /** ページ移動のステップ数。デフォルト: 5 */
  pageStep?: number;
  /** スクロール動作。デフォルト: 'smooth' */
  scrollBehavior?: ScrollBehavior;
  /** IME入力中にキー操作を無効化。デフォルト: true */
  disableOnComposing?: boolean;
  /** キー操作のデバウンス時間（ミリ秒）。デフォルト: 0 */
  keyDebounceMs?: number;
}

/** ナビゲーションアクション */
export type NavigationAction =
  | "next" // 次の項目
  | "prev" // 前の項目
  | "first" // 最初の項目
  | "last" // 最後の項目
  | "nextPage" // 次のページ
  | "prevPage" // 前のページ
  | "select"; // 選択

/** キーバインド設定 */
export interface KeyBinding {
  /** キー */
  key: string;
  /** Ctrl修飾キー */
  ctrlKey?: boolean;
  /** Alt修飾キー */
  altKey?: boolean;
  /** Meta修飾キー */
  metaKey?: boolean;
  /** Shift修飾キー */
  shiftKey?: boolean;
  /** アクション */
  action: NavigationAction;
}

/** キーボードイベントハンドラー */
export type KeyboardEventHandler = (e: React.KeyboardEvent) => void;

/** useSearchKeyboardの戻り値 */
export interface UseSearchKeyboardReturn {
  /** 選択中のインデックス */
  selectedIndex: number;
  /** リストのRef */
  listRef: React.RefObject<HTMLUListElement | null>;
  /** インデックスを設定 */
  setSelectedIndex: (index: number) => void;
  /** インデックスをリセット */
  resetSelectedIndex: () => void;
  /** ArrowキーとVim/Emacsバインドのハンドラー */
  handleNavigationKey: KeyboardEventHandler;
  /** Enterキーのハンドラー */
  handleEnterKey: KeyboardEventHandler;
  /** Tabキーのハンドラー */
  handleTabKey: KeyboardEventHandler;
  /** Backspaceキーのハンドラー */
  handleBackspaceKey: KeyboardEventHandler;
  /** Escapeキーのハンドラー */
  handleEscapeKey: KeyboardEventHandler;
  /** すべてのキーイベントを統合したハンドラー */
  handleKeyDown: KeyboardEventHandler;
}

/** useSearchKeyboardのパラメータ */
export interface UseSearchKeyboardParams {
  /** 検索結果のリスト */
  results: Result<Kind>[];
  /** IME入力中かどうか */
  isComposing: boolean;
  /** 選択時のコールバック */
  onSelect: (result: Result<Kind>) => void;
  /** Tabキー押下時のコールバック */
  onTab?: () => void;
  /** Backspaceキー押下時のコールバック */
  onBackspace?: () => void;
  /** Escapeキー押下時のコールバック */
  onEscape?: () => void;
}
