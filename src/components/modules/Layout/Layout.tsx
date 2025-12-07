import React from "react";

import ThemeProvider from "@/context/ThemeProvider";
import TranslationProvider from "@/context/TranslationProvider";

export const commonClassName = {
  bg: "bg-gray-50 dark:bg-gray-800",
  text: "text-gray-700 dark:text-gray-200",
  border: "border-2 border-solid border-sky-500",
  shadow: "shadow-xl",
  p: "px-6 pt-2 pb-1",
  space: "space-y-2",
};

export type LayoutProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  return (
    <React.StrictMode>
      <TranslationProvider>
        <ThemeProvider>
          <div className={props.className}>{props.children}</div>
        </ThemeProvider>
      </TranslationProvider>
    </React.StrictMode>
  );
}
