/**
 * useSearchShortcut関連の型定義
 */

/** プラットフォーム */
export type Platform = "mac" | "windows" | "linux" | "unknown";

/** 修飾キー */
export interface ModifierKeys {
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
  shift?: boolean;
}

/** ショートカット定義 */
export interface Shortcut extends ModifierKeys {
  /** キー */
  key: string;
  /** 説明 */
  description?: string;
  /** アクション名 */
  action?: string;
}

/** ショートカットコンフリクト */
export interface ShortcutConflict {
  /** コンフリクトしているショートカット1 */
  shortcut1: Shortcut;
  /** コンフリクトしているショートカット2 */
  shortcut2: Shortcut;
}

/** useSearchShortcutのオプション */
export interface UseSearchShortcutOptions {
  /** カスタムショートカットを有効化。デフォルト: false */
  enableCustomShortcuts?: boolean;
  /** ショートカットヘルプを表示するキー。デフォルト: '?' */
  helpKey?: string;
  /** コンフリクト検出を有効化。デフォルト: true */
  enableConflictDetection?: boolean;
}

/** useSearchShortcutの戻り値 */
export interface UseSearchShortcutReturn {
  /** ポップアップを開くショートカット（正規化済み） */
  openPopupShortcut: string[];
  /** 生のショートカット文字列 */
  rawShortcut: string | undefined;
  /** 現在のプラットフォーム */
  platform: Platform;
  /** ショートカットが押されたかチェック */
  isShortcutPressed: (e: React.KeyboardEvent) => boolean;
  /** カスタムショートカットを追加 */
  addCustomShortcut: (shortcut: Shortcut) => void;
  /** カスタムショートカットを削除 */
  removeCustomShortcut: (action: string) => void;
  /** カスタムショートカット一覧 */
  customShortcuts: Shortcut[];
  /** ショートカットのコンフリクトを検出 */
  conflicts: ShortcutConflict[];
  /** ヘルプ表示状態 */
  showHelp: boolean;
  /** ヘルプ表示をトグル */
  toggleHelp: () => void;
}

/** ショートカットマッチング結果 */
export interface ShortcutMatch {
  /** マッチしたか */
  matched: boolean;
  /** マッチしたショートカット */
  shortcut?: Shortcut;
}
