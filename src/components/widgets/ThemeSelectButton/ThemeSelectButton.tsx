import ComputerDesktopIcon from "@heroicons/react/16/solid/ComputerDesktopIcon";
import MoonIcon from "@heroicons/react/16/solid/MoonIcon";
import SunIcon from "@heroicons/react/16/solid/SunIcon";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeProvider";
import type { ThemeValue } from "@/services/storage/types";

export type ThemeSelectorProps = {
  className?: string;
};

const ThemeIcon = (props: { theme: ThemeValue }) => {
  const common = "size-5";

  switch (props.theme) {
    case "light":
      return <SunIcon className={`${common}`} />;
    case "dark":
      return <MoonIcon className={`${common}`} />;
    default:
      return <ComputerDesktopIcon className={`${common}`} />;
  }
};

export default function ThemeSelectButton(props: ThemeSelectorProps) {
  const { theme, changeNextTheme } = useContext(ThemeContext);

  const handleThemeChange = () => {
    changeNextTheme();
  };

  return (
    <button
      type="button"
      className={`flex items-center hover:cursor-pointer group relative space-x-2 ${props.className}`}
      onClick={handleThemeChange}
    >
      <ThemeIcon theme={theme} />
      <span className="invisible font-bold opacity-0 opacity-100 group-hover:visible">
        {theme.toUpperCase()}
      </span>
    </button>
  );
}
