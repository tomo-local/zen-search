import { useCallback, useEffect, useRef, useState } from "react";
import type { Result } from "@/types/result";

export default function useArrowKeyControl(tabs: Result[]) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedItem = listRef.current.children[selectedIndex];
      selectedItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  const handleArrowUpDownKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : tabs.length - 1));
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < tabs.length - 1 ? prev + 1 : 0));
      }
    },
    [tabs.length],
  );

  return { selectedIndex, listRef, handleArrowUpDownKey };
}
