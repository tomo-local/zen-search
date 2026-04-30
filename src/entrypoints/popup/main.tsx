import React from "react";
import ReactDOM from "react-dom/client";
import { contentService } from "@/services/content";
import App from "./App";

const rootElement =
  document.getElementById("root") ?? document.createElement("div");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CLOSE_POPUP") {
    contentService.close();
  }
});

// MV3 Service Worker はアイドル時に停止されるため、ポート接続で生存を維持する。
// ポップアップが開いている間は SW を生かし続け、メッセージ送信の失敗を防ぐ。
const KEEPALIVE_INTERVAL_MS = 25000;

function connectKeepalivePort(): void {
  const port = chrome.runtime.connect({ name: "keepalive" });
  const interval = setInterval(
    () => port.postMessage({ type: "PING" }),
    KEEPALIVE_INTERVAL_MS,
  );
  port.onDisconnect.addListener(() => {
    clearInterval(interval);
    connectKeepalivePort();
  });
}

connectKeepalivePort();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
