import React from "react";
import ReactDOM from "react-dom/client";
import { MessageType, runtimeService } from "@/services/runtime";
import App from "./App";

// バックグラウンドにサイドパネルの開閉状態を通知しつつ、
// MV3 Service Worker のアイドル停止を防ぐ永続ポート接続を確立する
runtimeService.connectPort("sidepanel", (message) => {
  if ((message as { type: string }).type === MessageType.CLOSE_SIDEPANEL) {
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
