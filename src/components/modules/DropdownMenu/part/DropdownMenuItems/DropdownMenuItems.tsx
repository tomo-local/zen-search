import clsx from "clsx";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useDropdownMenu } from "../../hooks";

export interface DropdownMenuItemsProps {
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "end";
  children: ReactNode;
}

export const DropdownMenuItems: React.FC<DropdownMenuItemsProps> = ({
  children,
  className,
  position = "bottom",
  align,
}) => {
  const { isOpen } = useDropdownMenu();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    } else {
      setContentHeight(0);
    }
  }, [isOpen]);

  const positionClasses = (() => {
    if (position === "top") {
      return clsx(
        "bottom-full mb-2 origin-bottom",
        align === "start" && "left-0 right-auto",
        align === "end" && "left-auto right-0",
        !align && "left-0 right-0",
      );
    }
    if (position === "right") {
      return clsx(
        "left-full ml-2 origin-top-left",
        align === "end" ? "bottom-0" : "top-0",
      );
    }
    if (position === "left") {
      return clsx(
        "right-full mr-2 origin-top-right",
        align === "end" ? "bottom-0" : "top-0",
      );
    }
    // bottom (default)
    return clsx(
      "mt-1 origin-top",
      align === "start" && "left-0 right-auto",
      align === "end" && "left-auto right-0",
      !align && "left-0 right-0",
    );
  })();

  return (
    <div
      style={{ height: isOpen ? `${contentHeight}px` : "0px" }}
      className={clsx(
        "absolute z-20 overflow-hidden transition-[opacity,transform,height] duration-200",
        positionClasses,
        isOpen
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none",
        className,
      )}
      role="menu"
      aria-hidden={!isOpen}
    >
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </div>
  );
};
