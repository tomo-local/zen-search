import { useCallback, useEffect, useState } from "react";
import { MessageType } from "@/types/result";

const keyMap: Record<string, string> = {
  "⇧": "Shift",
  "⌘": "Meta",
  "⌃": "Control",
  "⌥": "Alt",
  "←": "ArrowLeft",
  "→": "ArrowRight",
  "↑": "ArrowUp",
  "↓": "ArrowDown",
};

export default function usePopupShortCut() {
  const [shortcut, setShortcut] = useState<string[]>([]);

  const getCommandShortcut = useCallback(async () => {
    const commands = await chrome.commands.getAll();

    return commands.find((command) => command.name === MessageType.OPEN_POPUP);
  }, []);
  useEffect(() => {
    getCommandShortcut().then((command) => {
      if (!command) {
        return;
      }
      const normalizedShortcut = command?.shortcut
        ?.split("")
        .map((char) => {
          const key = keyMap[char] || char;
          return key.toLowerCase();
        })
        .sort();

      setShortcut(normalizedShortcut ?? []);
    });
  }, [getCommandShortcut]);

  return {
    shortcut,
  };
}
