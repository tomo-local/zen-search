import React from "react";
import ReactDOM from "react-dom/client";
import { MessageType } from "@/services/runtime/types";
import App from "./App";

// バックグラウンドにサイドパネルの開閉状態を通知するためのポート接続
// ポート切断 = サイドパネルが閉じられたことをバックグラウンドが検知できる
const port = chrome.runtime.connect({ name: "sidepanel" });

port.onMessage.addListener((message) => {
  if (message.type === MessageType.CLOSE_SIDEPANEL) {
    window.close();
  }
});

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
