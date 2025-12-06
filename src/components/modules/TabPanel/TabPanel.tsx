import type React from "react";

export interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string | undefined;
}

const TabPanel: React.FC<TabPanelProps> = ({ value, children, className }) => {
  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={className}
    >
      {children}
    </div>
  );
};

export default TabPanel;
