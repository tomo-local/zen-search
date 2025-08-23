import type { MessageType } from "@/types/result";

const actionRuntimeContent = (
  message: MessageType.OPEN_POPUP | MessageType.CLOSE_POPUP,
) =>
  chrome.runtime.sendMessage({ type: message }).catch((e) => {
    console.log(e);
    actionPopupContent();
  });

const actionTabsContent = async (
  message: MessageType.OPEN_POPUP | MessageType.CLOSE_POPUP,
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    if (tabId) {
      return chrome.tabs.sendMessage(tabId, { type: message }).catch((e) => {
        console.log(e);
        actionPopupContent();
      });
    }
  });
};

const actionPopupContent = async () => {
  await chrome.action.openPopup();
};

const actionBookmarkQuery = async (
  query: string,
): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
  const response = await chrome.bookmarks.search(query);

  return response;
};

const actionRecentBookmarks = async (
  count: number,
): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
  const response = await chrome.bookmarks.getRecent(count);

  return response;
};

export {
  actionRuntimeContent,
  actionTabsContent,
  actionPopupContent,
  actionBookmarkQuery,
  actionRecentBookmarks,
};
