import React from "react";

import ThemeProvider from "@/context/ThemeProvider";

export const commonClassName = {
  bg: "bg-gray-50 dark:bg-gray-800",
  text: "text-gray-700 dark:text-gray-200",
  border: "border-2 border-solid border-sky-500",
  shadow: "shadow-xl",
  p: "px-6 py-2",
  space: "space-y-2",
};

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function Layout(props: Props) {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <div className={props.className}>{props.children}</div>
      </ThemeProvider>
    </React.StrictMode>
  );
}
