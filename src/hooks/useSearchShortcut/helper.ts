/**
 * useSearchShortcut関連のヘルパー関数
 */

import { KEY_MAP } from "./constants";
import type { Platform, Shortcut, ShortcutConflict } from "./types";

/**
 * 現在のプラットフォームを検出
 * @returns プラットフォーム
 */
export function detectPlatform(): Platform {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("mac")) {
    return "mac";
  }
  if (userAgent.includes("win")) {
    return "windows";
  }
  if (userAgent.includes("linux")) {
    return "linux";
  }
  return "unknown";
}

/**
 * ショートカット文字列を正規化
 * @param shortcutString - ショートカット文字列（例: "Cmd+Shift+P"）
 * @returns 正規化されたキーの配列（ソート済み）
 */
export function normalizeShortcut(shortcutString: string): string[] {
  return shortcutString
    .split(/[+\s]/)
    .map((char) => {
      const mapped = KEY_MAP[char] || char;
      return mapped.toLowerCase().trim();
    })
    .filter(Boolean)
    .sort();
}

/**
 * Chrome記法のショートカット文字列を正規化
 * @param chromeShortcut - Chrome記法のショートカット（例: "⌘⇧P"）
 * @returns 正規化されたキーの配列（ソート済み）
 */
export function normalizeChromeShortcut(chromeShortcut: string): string[] {
  return chromeShortcut
    .split("")
    .map((char) => {
      const key = KEY_MAP[char] || char;
      return key.toLowerCase();
    })
    .filter(Boolean)
    .sort();
}

/**
 * キーボードイベントからショートカットキーの配列を生成
 * @param event - キーボードイベント
 * @returns 正規化されたキーの配列（ソート済み）
 */
export function getKeysFromEvent(event: React.KeyboardEvent): string[] {
  const keys: string[] = [];

  if (event.ctrlKey) keys.push("control");
  if (event.altKey) keys.push("alt");
  if (event.metaKey) keys.push("meta");
  if (event.shiftKey) keys.push("shift");

  const key = event.key.toLowerCase();
  if (key && !["control", "alt", "meta", "shift"].includes(key)) {
    keys.push(key);
  }

  return keys.sort();
}

/**
 * 2つのキー配列が一致するかチェック
 * @param keys1 - キー配列1
 * @param keys2 - キー配列2
 * @returns 一致すればtrue
 */
export function areKeysEqual(keys1: string[], keys2: string[]): boolean {
  if (keys1.length !== keys2.length) return false;
  return keys1.every((key, index) => key === keys2[index]);
}

/**
 * ショートカットオブジェクトからキー配列を生成
 * @param shortcut - ショートカット
 * @returns 正規化されたキーの配列（ソート済み）
 */
export function shortcutToKeys(shortcut: Shortcut): string[] {
  const keys: string[] = [];

  if (shortcut.ctrl) keys.push("control");
  if (shortcut.alt) keys.push("alt");
  if (shortcut.meta) keys.push("meta");
  if (shortcut.shift) keys.push("shift");
  if (shortcut.key) keys.push(shortcut.key.toLowerCase());

  return keys.sort();
}

/**
 * ショートカットのコンフリクトを検出
 * @param shortcuts - ショートカットの配列
 * @returns コンフリクトの配列
 */
export function detectConflicts(shortcuts: Shortcut[]): ShortcutConflict[] {
  const conflicts: ShortcutConflict[] = [];

  for (let i = 0; i < shortcuts.length; i++) {
    for (let j = i + 1; j < shortcuts.length; j++) {
      const keys1 = shortcutToKeys(shortcuts[i]);
      const keys2 = shortcutToKeys(shortcuts[j]);

      if (areKeysEqual(keys1, keys2)) {
        conflicts.push({
          shortcut1: shortcuts[i],
          shortcut2: shortcuts[j],
        });
      }
    }
  }

  return conflicts;
}

/**
 * ショートカットを人間が読みやすい形式に変換
 * @param shortcut - ショートカット
 * @param platform - プラットフォーム
 * @returns 表示用文字列
 */
export function formatShortcut(shortcut: Shortcut, platform: Platform): string {
  const parts: string[] = [];

  if (shortcut.ctrl) {
    parts.push(platform === "mac" ? "⌃" : "Ctrl");
  }
  if (shortcut.alt) {
    parts.push(platform === "mac" ? "⌥" : "Alt");
  }
  if (shortcut.meta) {
    parts.push(platform === "mac" ? "⌘" : "Win");
  }
  if (shortcut.shift) {
    parts.push(platform === "mac" ? "⇧" : "Shift");
  }
  if (shortcut.key) {
    parts.push(shortcut.key.toUpperCase());
  }

  return parts.join(platform === "mac" ? "" : "+");
}

/**
 * ストレージからカスタムショートカットを読み込み
 * @param storageKey - ストレージキー
 * @returns カスタムショートカットの配列
 */
export async function loadCustomShortcuts(
  storageKey: string,
): Promise<Shortcut[]> {
  try {
    const result = await browser.storage.local.get(storageKey);
    const stored = result[storageKey];
    if (stored && Array.isArray(stored)) {
      return stored;
    }
  } catch (error) {
    console.error("Failed to load custom shortcuts:", error);
  }
  return [];
}

/**
 * カスタムショートカットをストレージに保存
 * @param storageKey - ストレージキー
 * @param shortcuts - カスタムショートカットの配列
 */
export async function saveCustomShortcuts(
  storageKey: string,
  shortcuts: Shortcut[],
): Promise<void> {
  try {
    await browser.storage.local.set({ [storageKey]: shortcuts });
  } catch (error) {
    console.error("Failed to save custom shortcuts:", error);
  }
}
