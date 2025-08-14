/**
 * 基底サービスクラス
 * 全てのbackgroundサービスが継承する共通の機能を提供
 */
export abstract class BaseService {
  protected isInitialized = false;

  /**
   * サービスの初期化処理
   */
  abstract initialize(): Promise<void> | void;

  /**
   * サービスの終了処理
   */
  abstract dispose(): Promise<void> | void;

  /**
   * サービスの状態確認
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * ログ出力（開発時のデバッグ用）
   */
  protected log(message: string, ...args: any[]): void {
    console.log(`[${this.constructor.name}]`, message, ...args);
  }

  /**
   * エラーログ出力
   */
  protected error(message: string, error?: Error): void {
    console.error(`[${this.constructor.name}]`, message, error);
  }
}
