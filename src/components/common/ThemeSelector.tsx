import useTheme from "@/hooks/storage/useTheme";
import { ThemeValue } from "@/types/storage";
import SunIcon from "@heroicons/react/16/solid/SunIcon";
import MoonIcon from "@heroicons/react/16/solid/MoonIcon";
import ComputerDesktopIcon from "@heroicons/react/16/solid/ComputerDesktopIcon";

type ThemeSelectorProps = {
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

export default function ThemeSelector(props: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    const themes: ThemeValue[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const handleThemeChange = () => {
    nextTheme();
  };

  return (
    <button
      className={`flex items-center ${props.className}`}
      onClick={handleThemeChange}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}
