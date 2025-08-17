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
 * レスポンス形式を統一する
 */
export const createResponse = (type: string, result: any, error?: string): any => {
  return {
    type,
    result,
    ...(error && { error }),
    timestamp: Date.now(),
  };
};

/**
 * エラーレスポンスを作成する
 */
export const createErrorResponse = (type: string, error: Error): any => {
  return createResponse(type, null, error.message);
};

/**
 * 成功レスポンスを作成する
 */
export const createSuccessResponse = (type: string, result: any): any => {
  return createResponse(type, result);
};

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
