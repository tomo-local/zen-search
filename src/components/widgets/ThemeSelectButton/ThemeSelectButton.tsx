import ComputerDesktopIcon from "@heroicons/react/16/solid/ComputerDesktopIcon";
import MoonIcon from "@heroicons/react/16/solid/MoonIcon";
import SunIcon from "@heroicons/react/16/solid/SunIcon";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useContext, useState } from "react";
import { defaultClassName } from "@/components/modules/ButtonItem/ButtonItem";
import DropdownMenu, {
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuItems,
} from "@/components/modules/DropdownMenu";
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

const themes: { value: ThemeValue; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function ThemeSelectButton(props: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <DropdownMenu
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      selectedValue={theme}
      onSelect={(value) => {
        setTheme(value as ThemeValue);
        setIsOpen(false);
      }}
    >
      <DropdownMenuButton
        className={clsx(
          "flex items-center hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group relative space-x-2 p-1 rounded-md",
          defaultClassName.bg,
          defaultClassName.base,
          props.className,
        )}
      >
        <ThemeIcon theme={theme} />
      </DropdownMenuButton>
      <DropdownMenuItems
        className="w-40 bg-white border border-gray-700 rounded-lg shadow-lg dark:bg-gray-800"
        position="top"
        align="start"
      >
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            value={t.value}
            className="flex items-center px-4 py-2 space-x-2 text-gray-800 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
          >
            <ThemeIcon theme={t.value} />
            <span>{t.label}</span>
            {theme === t.value && (
              <CheckCircleIcon className="ml-auto text-sky-500 size-6" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuItems>
    </DropdownMenu>
  );
}
