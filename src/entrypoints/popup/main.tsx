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

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
