import { useState, useRef, useEffect } from "react";
import { Result } from "@/types/result";

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

  const handleArrowUpDownKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : tabs.length - 1));
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < tabs.length - 1 ? prev + 1 : 0));
    }
  };

  return { selectedIndex, listRef, handleArrowUpDownKey };
}
