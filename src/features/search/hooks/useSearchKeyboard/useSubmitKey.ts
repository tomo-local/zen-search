/**
 * useSubmitKey - Enter / Tab / Backspace キーによる選択・補完を管理するhook
 */

import { useCallback } from "react";
import type { Kind, Result } from "@/services/result";
import type { UseSearchKeyboardOptions } from "./types";

interface UseSubmitKeyParams {
  results: Result<Kind>[];
  selectedIndex: number;
  isComposing: boolean;
  onSelect: (result: Result<Kind>) => void;
  onTab?: () => void;
  onBackspace?: () => void;
}

interface UseSubmitKeyReturn {
  handleEnterKey: (e: React.KeyboardEvent) => void;
  handleTabKey: (e: React.KeyboardEvent) => void;
  handleBackspaceKey: (e: React.KeyboardEvent) => void;
}

/**
 * Enter / Tab / Backspace キーによる選択・補完を管理するhook
 * @param params パラメータ（結果リスト、選択インデックス、コールバック）
 * @param opts キーボードオプション
 * @returns Enter / Tab / Backspace キーハンドラー
 */
export default function useSubmitKey(
  params: UseSubmitKeyParams,
  opts: Pick<Required<UseSearchKeyboardOptions>, "disableOnComposing">,
): UseSubmitKeyReturn {
  const { results, selectedIndex, isComposing, onSelect, onTab, onBackspace } =
    params;

  const handleEnterKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (opts.disableOnComposing && isComposing) return;
      if (e.key === "Enter") {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) onSelect(selectedResult);
      }
    },
    [opts.disableOnComposing, isComposing, results, selectedIndex, onSelect],
  );

  const handleTabKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        if (opts.disableOnComposing && isComposing) return;
        onTab?.();
      }
    },
    [opts.disableOnComposing, isComposing, onTab],
  );

  const handleBackspaceKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Backspace") onBackspace?.();
    },
    [onBackspace],
  );

  return { handleEnterKey, handleTabKey, handleBackspaceKey };
}
