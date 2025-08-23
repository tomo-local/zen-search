import { BaseService } from '@/services/base';
import { MessageType } from '@/types/result';
import { ActionType } from './types';

/**
 * ポップアップ関連の操作を担当するサービス
 */
export class PopupService extends BaseService {
  async initialize(): Promise<void> {
    this.log('Popup service initialized');
    this.isInitialized = true;
  }

  async dispose(): Promise<void> {
    this.log('Popup service disposed');
    this.isInitialized = false;
  }

  /**
   * Runtime経由でポップアップメッセージを送信
   * @private
   */
  private async actionRuntimeContent(
    message: MessageType.OPEN_POPUP | MessageType.CLOSE_POPUP
  ): Promise<void> {
    try {
      await chrome.runtime.sendMessage({ type: message });
      this.log(`Runtime message sent: ${message}`);
    } catch (error) {
      this.log('Runtime message failed, falling back to popup action');
      await this.actionPopupContent();
    }
  }

  /**
   * タブ経由でポップアップメッセージを送信
   * @private
   */
  private async actionTabsContent(
    message: MessageType.OPEN_POPUP | MessageType.CLOSE_POPUP
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tabId = tabs[0]?.id;
        if (tabId) {
          try {
            await chrome.tabs.sendMessage(tabId, { type: message });
            this.log(`Tab message sent: ${message}`);
            resolve();
          } catch (error) {
            this.log('Tab message failed, falling back to popup action');
            await this.actionPopupContent();
            resolve();
          }
        } else {
          reject(new Error('No active tab found'));
        }
      });
    });
  }

  /**
   * ポップアップアクションを直接実行
   * @private
   */
  private async actionPopupContent(): Promise<void> {
    await chrome.action.openPopup();
    this.log('Popup opened via chrome.action.openPopup');
  }

  /**
   * 指定されたアクションタイプでポップアップを開く
   */
  async openContent(type: ActionType): Promise<void> {
    try {
      if (type === ActionType.runtime) {
        await this.actionRuntimeContent(MessageType.OPEN_POPUP);
      } else if (type === ActionType.tabs) {
        await this.actionTabsContent(MessageType.OPEN_POPUP);
      } else if (type === ActionType.popup) {
        await this.actionPopupContent();
      }
      this.log(`Popup opened successfully with type: ${type}`);
    } catch (error) {
      this.error('Failed to open popup', error as Error);
      throw error;
    }
  }

  /**
   * 指定されたアクションタイプでポップアップを閉じる
   */
  async closeContent(type: ActionType): Promise<void> {
    try {
      if (type === ActionType.runtime) {
        await this.actionRuntimeContent(MessageType.CLOSE_POPUP);
      } else if (type === ActionType.tabs) {
        await this.actionTabsContent(MessageType.CLOSE_POPUP);
      }
      this.log(`Popup closed successfully with type: ${type}`);
    } catch (error) {
      this.error('Failed to close popup', error as Error);
      throw error;
    }
  }

  /**
   * ポップアップを開く（デフォルトでtabsタイプを使用）
   */
  async openPopup(): Promise<void> {
    await this.openContent(ActionType.tabs);
  }

  /**
   * ポップアップを閉じる（デフォルトでtabsタイプを使用）
   */
  async closePopup(): Promise<void> {
    await this.closeContent(ActionType.tabs);
  }
}
