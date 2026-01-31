import React from "react";
import { createRoot } from "react-dom/client";
import { contentService } from "@/services/content";
import App from "./App";

const rootElement =
  document.getElementById("root") ?? document.createElement("div");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CLOSE_POPUP") {
    contentService.close();
  }
});

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
