import ReactDOM from "react-dom/client";
import App from "./App";
import { MessageType } from "@/types/result";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    let open = false;

    const ui = await createShadowRootUi(ctx, {
      name: "zen-search",
      position: "modal",
      zIndex: 999999999,
      anchor: "body",
      append: "first",
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);

        root.render(<App />);

        return { root, container };
      },
      onRemove: (input) => {
        input?.root.unmount();
      },
    });
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === MessageType.OPEN_POPUP) {
        open ? ui.remove() : ui.mount();
        open = !open;
      }

      if (message.type === MessageType.CLOSE_POPUP) {
        ui.remove();
        open = false;
      }
    });
  },
});
