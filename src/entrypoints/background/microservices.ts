import { ServiceRegistry } from '@/services/registry';
import { MessageType } from '@/types/result';
import {
  QueryMessage,
  CreateMessage,
  UpdateMessage,
  RemoveMessage,
} from '@/types/chrome';

// サービスレジストリのインスタンスを作成
const serviceRegistry = new ServiceRegistry();

export default defineBackground(() => {
  // サービスレジストリを初期化
  serviceRegistry.initialize().catch((error) => {
    console.error('Failed to initialize service registry:', error);
  });

  // キーボードショートカットハンドラー
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === MessageType.OPEN_POPUP) {
      try {
        await serviceRegistry.popupService.openPopup();
      } catch (error) {
        console.error('Failed to handle command:', error);
      }
    }
  });

  // メッセージハンドラー
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender, sendResponse);
    return true; // 非同期レスポンスを有効にする
  });

  /**
   * メッセージを処理する
   */
  async function handleMessage(
    message: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): Promise<void> {
    try {
      // サービスレジストリが初期化されているかチェック
      if (!serviceRegistry.isReady()) {
        throw new Error('Service registry is not ready');
      }

      const { type } = message;
      let response: any;

      switch (type) {
        case MessageType.OPEN_POPUP:
        case MessageType.CLOSE_POPUP:
          await handlePopupMessage(message);
          response = { type, result: true };
          break;

        case MessageType.QUERY_TAB:
          response = await serviceRegistry.tabService.queryTabs(message as QueryMessage);
          break;

        case MessageType.CREATE_TAB:
          response = await serviceRegistry.tabService.createTab(message as CreateMessage);
          break;

        case MessageType.UPDATE_TAB:
          response = await serviceRegistry.tabService.updateTab(message as UpdateMessage);
          break;

        case MessageType.REMOVE_TAB:
          response = await serviceRegistry.tabService.removeTab(message as RemoveMessage);
          break;

        case MessageType.QUERY_HISTORY:
          response = await serviceRegistry.historyService.queryHistory(message as QueryMessage);
          break;

        case MessageType.QUERY_BOOKMARK:
          response = await serviceRegistry.bookmarkService.queryBookmarks(message as QueryMessage);
          break;

        default:
          throw new Error(`Unknown message type: ${type}`);
      }

      sendResponse(response);
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({
        type: message.type,
        error: (error as Error).message,
        result: null,
      });
    }
  }

  /**
   * ポップアップ関連のメッセージを処理
   */
  async function handlePopupMessage(message: any): Promise<void> {
    const { type } = message;

    switch (type) {
      case MessageType.OPEN_POPUP:
        await serviceRegistry.popupService.openPopup();
        break;

      case MessageType.CLOSE_POPUP:
        await serviceRegistry.popupService.closePopup();
        break;

      default:
        throw new Error(`Unknown popup message type: ${type}`);
    }
  }

  // 拡張機能の停止時にサービスを清理
  chrome.runtime.onSuspend.addListener(() => {
    serviceRegistry.dispose().catch((error) => {
      console.error('Failed to dispose service registry:', error);
    });
  });
});
