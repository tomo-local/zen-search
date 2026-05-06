/**
 * useEscapeKey - Escape キーによるクローズ・クリアを管理するhook
 */

import { useCallback } from "react";

interface UseEscapeKeyParams {
  onEscape?: () => void;
}

interface UseEscapeKeyReturn {
  handleEscapeKey: (e: React.KeyboardEvent) => void;
}

export default function useEscapeKey(
  params: UseEscapeKeyParams,
): UseEscapeKeyReturn {
  const { onEscape } = params;

  const handleEscapeKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
      }
    },
    [onEscape],
  );

  return { handleEscapeKey };
}
