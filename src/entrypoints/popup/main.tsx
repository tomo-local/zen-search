import React from "react";
import ReactDOM from "react-dom/client";
import { contentService } from "@/services/content";
import { runtimeService } from "@/services/runtime";
import App from "./App";

const rootElement =
  document.getElementById("root") ?? document.createElement("div");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CLOSE_POPUP") {
    contentService.close();
  }
});

// MV3 Service Worker のアイドル停止を防ぐ永続ポート接続を確立する
runtimeService.connectPort("keepalive");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
