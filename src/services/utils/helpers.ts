/**
 * メッセージルーティング用のデコレータとユーティリティ
 */

/**
 * メッセージハンドラーを登録するデコレータ
 */
export function MessageHandler(messageType: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.constructor.messageHandlers) {
      target.constructor.messageHandlers = new Map();
    }
    target.constructor.messageHandlers.set(messageType, propertyKey);
  };
}

/**
 * サービスクラス用のベースヘルパー
 */
export class ServiceHelper {
  /**
   * レスポンス形式を統一する
   */
  static createResponse(type: string, result: any, error?: string): any {
    return {
      type,
      result,
      ...(error && { error }),
      timestamp: Date.now(),
    };
  }

  /**
   * エラーレスポンスを作成する
   */
  static createErrorResponse(type: string, error: Error): any {
    return this.createResponse(type, null, error.message);
  }

  /**
   * 成功レスポンスを作成する
   */
  static createSuccessResponse(type: string, result: any): any {
    return this.createResponse(type, result);
  }
}

/**
 * パフォーマンス測定デコレータ
 */
export function PerformanceMonitor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.apply(this, args);
    const end = performance.now();

    console.log(`[Performance] ${target.constructor.name}.${propertyKey}: ${(end - start).toFixed(2)}ms`);
    return result;
  };

  return descriptor;
}
