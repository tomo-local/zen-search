import React from "react";
import ReactDOM from "react-dom/client";
import { MessageType } from "@/services/runtime/types";
import App from "./App";

// バックグラウンドにサイドパネルの開閉状態を通知するためのポート接続。
// ポート切断 = サイドパネルが閉じられたことをバックグラウンドが検知できる。
// 25 秒ごとの ping により MV3 Service Worker の停止も防ぐ。
const KEEPALIVE_INTERVAL_MS = 25000;

function connectSidePanelPort(): void {
  const port = chrome.runtime.connect({ name: "sidepanel" });
  const interval = setInterval(
    () => port.postMessage({ type: "PING" }),
    KEEPALIVE_INTERVAL_MS,
  );

  port.onMessage.addListener((message) => {
    if (message.type === MessageType.CLOSE_SIDEPANEL) {
      window.close();
    }
  });

  port.onDisconnect.addListener(() => {
    clearInterval(interval);
    connectSidePanelPort();
  });
}

connectSidePanelPort();

const rootElement =
  document.getElementById("root") ??
  (() => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    return div;
  })();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
