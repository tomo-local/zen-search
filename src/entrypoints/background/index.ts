import { routeCommand, routeMessage } from "./router";

export default defineBackground(() => {
  /**
   * @description コマンドのルーティング
   */
  chrome.commands.onCommand.addListener((command, tab) =>
    routeCommand(command, tab),
  );

  /**
   * @description メッセージのルーティング
   */
  chrome.runtime.onMessage.addListener((message, sender, response) =>
    routeMessage(message, sender, response),
  );
});
