/**
 * useSearchKeyboard関連のヘルパー関数
 */

import type { KeyBinding, NavigationAction } from "./types";

/**
 * キーボードイベントがキーバインドにマッチするかチェック
 * @param event - キーボードイベント
 * @param binding - キーバインド
 * @returns マッチしたらtrue
 */
export function matchesKeyBinding(
  event: React.KeyboardEvent,
  binding: KeyBinding,
): boolean {
  if (event.key !== binding.key) return false;
  if (!!event.ctrlKey !== !!binding.ctrlKey) return false;
  if (!!event.altKey !== !!binding.altKey) return false;
  if (!!event.metaKey !== !!binding.metaKey) return false;
  if (!!event.shiftKey !== !!binding.shiftKey) return false;
  return true;
}

/**
 * キーバインドの配列からアクションを検索
 * @param event - キーボードイベント
 * @param bindings - キーバインドの配列
 * @returns マッチしたアクション、なければnull
 */
export function findAction(
  event: React.KeyboardEvent,
  bindings: KeyBinding[],
): NavigationAction | null {
  const binding = bindings.find((b) => matchesKeyBinding(event, b));
  return binding ? binding.action : null;
}

/**
 * インデックスを計算
 * @param action - ナビゲーションアクション
 * @param currentIndex - 現在のインデックス
 * @param totalCount - 総数
 * @param pageStep - ページステップ
 * @returns 新しいインデックス
 */
export function calculateNewIndex(
  action: NavigationAction,
  currentIndex: number,
  totalCount: number,
  pageStep: number,
): number {
  if (totalCount === 0) return 0;

  switch (action) {
    case "next":
      return currentIndex < totalCount - 1 ? currentIndex + 1 : 0;

    case "prev":
      return currentIndex > 0 ? currentIndex - 1 : totalCount - 1;

    case "first":
      return 0;

    case "last":
      return totalCount - 1;

    case "nextPage":
      return Math.min(currentIndex + pageStep, totalCount - 1);

    case "prevPage":
      return Math.max(currentIndex - pageStep, 0);

    default:
      return currentIndex;
  }
}

/**
 * スクロール位置を調整
 * @param listRef - リストのRef
 * @param index - インデックス
 * @param behavior - スクロール動作
 */
export function scrollToIndex(
  listRef: React.RefObject<HTMLUListElement | null>,
  index: number,
  behavior: ScrollBehavior = "smooth",
): void {
  if (!listRef.current || index < 0) return;

  const selectedItem = listRef.current.children[index] as HTMLElement;
  if (!selectedItem) return;

  selectedItem.scrollIntoView({
    block: "nearest",
    behavior,
  });
}

/**
 * デバウンス処理
 * @param fn - 実行する関数
 * @param delayMs - 遅延時間（ミリ秒）
 * @returns デバウンスされた関数
 */
// biome-ignore lint/suspicious/noExplicitAny: デバウンス関数の汎用性のため
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}
