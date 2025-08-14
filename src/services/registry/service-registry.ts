import { BaseService } from '@/services/base';
import { TabService } from '@/services/tab';
import { HistoryService } from '@/services/history';
import { BookmarkService } from '@/services/bookmark';
import { PopupService } from '@/services/popup';
import { MessageType } from '@/types/result';

/**
 * 全てのbackgroundサービスを管理するメインサービス
 */
export class ServiceRegistry extends BaseService {
  private services: Map<string, BaseService> = new Map();

  // サービスインスタンス
  readonly tabService = new TabService();
  readonly historyService = new HistoryService();
  readonly bookmarkService = new BookmarkService();
  readonly popupService = new PopupService();

  async initialize(): Promise<void> {
    this.log('Initializing service registry...');

    // 全サービスを登録
    this.services.set('tab', this.tabService);
    this.services.set('history', this.historyService);
    this.services.set('bookmark', this.bookmarkService);
    this.services.set('popup', this.popupService);

    // 全サービスを初期化
    for (const [name, service] of this.services) {
      try {
        await service.initialize();
        this.log(`Service ${name} initialized successfully`);
      } catch (error) {
        this.error(`Failed to initialize service ${name}`, error as Error);
      }
    }

    this.isInitialized = true;
    this.log('Service registry initialized');
  }

  async dispose(): Promise<void> {
    this.log('Disposing service registry...');

    // 全サービスを停止
    for (const [name, service] of this.services) {
      try {
        await service.dispose();
        this.log(`Service ${name} disposed successfully`);
      } catch (error) {
        this.error(`Failed to dispose service ${name}`, error as Error);
      }
    }

    this.services.clear();
    this.isInitialized = false;
    this.log('Service registry disposed');
  }

  /**
   * メッセージタイプに基づいて適切なサービスを取得
   */
  getServiceForMessage(messageType: string): BaseService | null {
    switch (messageType) {
      case MessageType.QUERY_TAB:
      case MessageType.CREATE_TAB:
      case MessageType.UPDATE_TAB:
      case MessageType.REMOVE_TAB:
        return this.tabService;

      case MessageType.QUERY_HISTORY:
        return this.historyService;

      case MessageType.QUERY_BOOKMARK:
        return this.bookmarkService;

      case MessageType.OPEN_POPUP:
      case MessageType.CLOSE_POPUP:
        return this.popupService;

      default:
        this.log(`No service found for message type: ${messageType}`);
        return null;
    }
  }

  /**
   * 特定のサービスを取得
   */
  getService<T extends BaseService>(serviceName: string): T | null {
    return (this.services.get(serviceName) as T) || null;
  }

  /**
   * 全サービスの状態確認
   */
  getHealthStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const [name, service] of this.services) {
      status[name] = service.isReady();
    }
    return status;
  }
}
