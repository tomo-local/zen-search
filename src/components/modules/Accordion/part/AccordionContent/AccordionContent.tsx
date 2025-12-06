import { type ReactNode, useEffect, useRef, useState } from "react";
import { useAccordion } from "../../hooks";

export interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className,
}) => {
  const { isOpen } = useAccordion();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen) {
      setHeight(`${contentRef.current?.scrollHeight ?? 0}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{
        height,
        //TODO: Chrome 120, Firefox 126, Safari 18 で `interpolate-size: allow-keywords` がサポートされたら、下記CSSを有効化して useState の高さ制御を削除すること！
        // https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/interpolate-size
        // @supports (height: auto) and (interpolate-size: allow-keywords) {
        //   height: isOpen ? "auto" : "0px";
        //   interpolateSize: "allow-keywords";
        // }
      }}
      className={`overflow-y-hidden transition-[height] ${className ?? ""}`}
    >
      {children}
    </div>
  );
};
