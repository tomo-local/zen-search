import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

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
