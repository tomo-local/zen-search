/**
 * useSearchShortcut - ショートカット管理を行うhook
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageType } from "@/services/runtime/types";
import { CUSTOM_SHORTCUTS_STORAGE_KEY, DEFAULT_OPTIONS } from "./constants";
import {
  areKeysEqual,
  detectConflicts,
  detectPlatform,
  getKeysFromEvent,
  loadCustomShortcuts,
  normalizeChromeShortcut,
  saveCustomShortcuts,
} from "./helper";
import type {
  Platform,
  Shortcut,
  ShortcutConflict,
  UseSearchShortcutOptions,
  UseSearchShortcutReturn,
} from "./types";

/**
 * ショートカット管理を行うhook
 *
 * @description
 * このhookは以下の機能を提供します：
 * - Chrome拡張機能のショートカット取得
 * - カスタムショートカット登録・管理
 * - ショートカットのコンフリクト検出
 * - プラットフォーム別のキーマッピング
 * - ショートカットヘルプ表示
 * - ショートカット判定ロジックの簡略化
 *
 * @param options - オプション設定
 * @returns ショートカット情報と操作関数
 *
 * @example
 * ```tsx
 * const {
 *   openPopupShortcut,
 *   isShortcutPressed,
 *   showHelp,
 *   toggleHelp,
 * } = useSearchShortcut({
 *   enableCustomShortcuts: true,
 * });
 * ```
 */
export default function useSearchShortcut(
  options: UseSearchShortcutOptions = {},
): UseSearchShortcutReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const [rawShortcut, setRawShortcut] = useState<string | undefined>(undefined);
  const [openPopupShortcut, setOpenPopupShortcut] = useState<string[]>([]);
  const [customShortcuts, setCustomShortcuts] = useState<Shortcut[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // プラットフォーム検出
  const platform = useMemo<Platform>(() => detectPlatform(), []);

  // Chromeコマンドからショートカットを取得
  useEffect(() => {
    const fetchShortcut = async () => {
      try {
        const commands = await chrome.commands.getAll();
        const command = commands.find(
          (cmd) => cmd.name === MessageType.OPEN_POPUP,
        );

        if (command?.shortcut) {
          setRawShortcut(command.shortcut);
          const normalized = normalizeChromeShortcut(command.shortcut);
          setOpenPopupShortcut(normalized);
        }
      } catch (error) {
        console.error("Failed to fetch shortcut:", error);
      }
    };

    fetchShortcut();
  }, []);

  // カスタムショートカットを読み込み
  useEffect(() => {
    if (!opts.enableCustomShortcuts) return;

    const loadShortcuts = async () => {
      const shortcuts = await loadCustomShortcuts(CUSTOM_SHORTCUTS_STORAGE_KEY);
      setCustomShortcuts(shortcuts);
    };

    loadShortcuts();
  }, [opts.enableCustomShortcuts]);

  /**
   * ショートカットが押されたかチェック
   */
  const isShortcutPressed = useCallback(
    (e: React.KeyboardEvent): boolean => {
      if (openPopupShortcut.length === 0) return false;

      const pressedKeys = getKeysFromEvent(e);
      return areKeysEqual(pressedKeys, openPopupShortcut);
    },
    [openPopupShortcut],
  );

  /**
   * カスタムショートカットを追加
   */
  const addCustomShortcut = useCallback(
    async (shortcut: Shortcut) => {
      if (!opts.enableCustomShortcuts) {
        console.warn("Custom shortcuts are disabled");
        return;
      }

      setCustomShortcuts((prev) => {
        const newShortcuts = [...prev, shortcut];
        saveCustomShortcuts(CUSTOM_SHORTCUTS_STORAGE_KEY, newShortcuts);
        return newShortcuts;
      });
    },
    [opts.enableCustomShortcuts],
  );

  /**
   * カスタムショートカットを削除
   */
  const removeCustomShortcut = useCallback(
    async (action: string) => {
      if (!opts.enableCustomShortcuts) {
        console.warn("Custom shortcuts are disabled");
        return;
      }

      setCustomShortcuts((prev) => {
        const newShortcuts = prev.filter((s) => s.action !== action);
        saveCustomShortcuts(CUSTOM_SHORTCUTS_STORAGE_KEY, newShortcuts);
        return newShortcuts;
      });
    },
    [opts.enableCustomShortcuts],
  );

  /**
   * コンフリクト検出
   */
  const conflicts = useMemo<ShortcutConflict[]>(() => {
    if (!opts.enableConflictDetection) return [];

    // ポップアップショートカットをShortcut形式に変換
    const popupShortcut: Shortcut = {
      key:
        openPopupShortcut.find(
          (k) => !["control", "alt", "meta", "shift"].includes(k),
        ) || "",
      ctrl: openPopupShortcut.includes("control"),
      alt: openPopupShortcut.includes("alt"),
      meta: openPopupShortcut.includes("meta"),
      shift: openPopupShortcut.includes("shift"),
      action: "open_popup",
      description: "ポップアップを開く",
    };

    const allShortcuts = [popupShortcut, ...customShortcuts];
    return detectConflicts(allShortcuts);
  }, [opts.enableConflictDetection, openPopupShortcut, customShortcuts]);

  /**
   * ヘルプ表示をトグル
   */
  const toggleHelp = useCallback(() => {
    setShowHelp((prev) => !prev);
  }, []);

  // ヘルプキーの監視
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === opts.helpKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleHelp();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [opts.helpKey, toggleHelp]);

  return {
    openPopupShortcut,
    rawShortcut,
    platform,
    isShortcutPressed,
    addCustomShortcut,
    removeCustomShortcut,
    customShortcuts,
    conflicts,
    showHelp,
    toggleHelp,
  };
}
