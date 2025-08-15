import { ServiceRegistry } from '@/services/registry';
import { MessageType } from '@/types/result';
import {
  QueryMessage,
  CreateMessage,
  UpdateMessage,
  RemoveMessage,
} from '@/types/chrome';

/**
 * バックグラウンドマイクロサービス
 * Chrome拡張機能のバックグラウンド処理を管理
 */
export class BackgroundMicroservices {
  private serviceRegistry: ServiceRegistry;

  constructor() {
    this.serviceRegistry = new ServiceRegistry();
  }

  /**
   * マイクロサービスを初期化
   */
  async initialize(): Promise<void> {
    try {
      await this.serviceRegistry.initialize();
    } catch (error) {
      console.error('Failed to initialize service registry:', error);
      throw error;
    }
  }

  /**
   * マイクロサービスを破棄
   */
  async dispose(): Promise<void> {
    try {
      await this.serviceRegistry.dispose();
    } catch (error) {
      console.error('Failed to dispose service registry:', error);
      throw error;
    }
  }

  /**
   * キーボードショートカットハンドラー
   */
  async handleCommand(command: string): Promise<void> {
    if (command === MessageType.OPEN_POPUP) {
      try {
        await this.serviceRegistry.popupService.openPopup();
      } catch (error) {
        console.error('Failed to handle command:', error);
        throw error;
      }
    }
  }

  /**
   * メッセージを処理する
   */
  async handleMessage(
    message: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): Promise<void> {
    try {
      // サービスレジストリが初期化されているかチェック
      if (!this.serviceRegistry.isReady()) {
        throw new Error('Service registry is not ready');
      }

      const { type } = message;
      let response: any;

      switch (type) {
        case MessageType.OPEN_POPUP:
        case MessageType.CLOSE_POPUP:
          await this.handlePopupMessage(message);
          response = { type, result: true };
          break;

        case MessageType.QUERY_TAB:
          response = await this.serviceRegistry.tabService.queryTabs(message as QueryMessage);
          break;

        case MessageType.CREATE_TAB:
          response = await this.serviceRegistry.tabService.createTab(message as CreateMessage);
          break;

        case MessageType.UPDATE_TAB:
          response = await this.serviceRegistry.tabService.updateTab(message as UpdateMessage);
          break;

        case MessageType.REMOVE_TAB:
          response = await this.serviceRegistry.tabService.removeTab(message as RemoveMessage);
          break;

        case MessageType.QUERY_HISTORY:
          response = await this.serviceRegistry.historyService.queryHistory(message as QueryMessage);
          break;

        case MessageType.QUERY_BOOKMARK:
          response = await this.serviceRegistry.bookmarkService.queryBookmarks(message as QueryMessage);
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
  private async handlePopupMessage(message: any): Promise<void> {
    const { type } = message;

    switch (type) {
      case MessageType.OPEN_POPUP:
        await this.serviceRegistry.popupService.openPopup();
        break;

      case MessageType.CLOSE_POPUP:
        await this.serviceRegistry.popupService.closePopup();
        break;

      default:
        throw new Error(`Unknown popup message type: ${type}`);
    }
  }
}
