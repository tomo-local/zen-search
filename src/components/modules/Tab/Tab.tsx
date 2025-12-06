import type React from "react";

export interface TabProps {
  value: string;
  className?: string | undefined;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

const Tab: React.FC<TabProps> = ({ children, className, value, onClick }) => {
  return (
    <button
      type="button"
      className={className}
      role="tab"
      aria-selected="false"
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Tab;
