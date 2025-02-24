export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  browser.commands.onCommand.addListener((command) => {
    if (command === "openPopup") {
      chrome.action.openPopup();
    }
  });
});
