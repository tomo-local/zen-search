import { BackgroundMicroservices } from './microservices';

// バックグラウンドマイクロサービスのインスタンスを作成
const backgroundMicroservices = new BackgroundMicroservices();

export default defineBackground(() => {
  // バックグラウンドマイクロサービスを初期化
  backgroundMicroservices.initialize().catch((error) => {
    console.error('Failed to initialize background microservices:', error);
  });

  // キーボードショートカットハンドラー
  chrome.commands.onCommand.addListener(async (command) => {
    try {
      await backgroundMicroservices.handleCommand(command);
    } catch (error) {
      console.error('Failed to handle command:', error);
    }
  });

  // メッセージハンドラー
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    backgroundMicroservices.handleMessage(message, sender, sendResponse);
    return true; // 非同期レスポンスを有効にする
  });

  // 拡張機能の停止時にサービスを清理
  chrome.runtime.onSuspend.addListener(() => {
    backgroundMicroservices.dispose().catch((error) => {
      console.error('Failed to dispose background microservices:', error);
    });
  });
});
