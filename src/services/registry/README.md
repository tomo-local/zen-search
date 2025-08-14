# Service Registry

全てのbackgroundサービスを管理するメインサービスです。

## 機能

- **サービス管理**: 全サービスの初期化・停止を管理
- **メッセージルーティング**: メッセージタイプに基づいて適切なサービスに処理を委譲
- **ヘルスチェック**: 全サービスの状態確認

## API

### initialize()
全サービスを初期化します。

### dispose()
全サービスを停止します。

### getServiceForMessage(messageType: string)
メッセージタイプに基づいて適切なサービスを取得します。

### getService<T>(serviceName: string)
特定のサービスを取得します。

### getHealthStatus()
全サービスの状態を確認します。

## 使用例

```typescript
const serviceRegistry = new ServiceRegistry();
await serviceRegistry.initialize();

// メッセージを処理
const service = serviceRegistry.getServiceForMessage(MessageType.QUERY_TAB);
if (service) {
  const result = await service.queryTabs(message);
}
```
