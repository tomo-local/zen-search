import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import ComputerDesktopIcon from "@heroicons/react/16/solid/ComputerDesktopIcon";
import MoonIcon from "@heroicons/react/16/solid/MoonIcon";
import SunIcon from "@heroicons/react/16/solid/SunIcon";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useContext } from "react";
import { defaultClassName } from "@/components/modules/ButtonItem/ButtonItem";
import { ThemeContext } from "@/context/ThemeProvider";
import { useTranslation } from "@/hooks/storage/useTranslation";
import type { ThemeValue } from "@/services/storage/types";

export type ThemeSelectorProps = {
  className?: string;
};

const ThemeIcon = (props: { theme: ThemeValue; className?: string }) => {
  switch (props.theme) {
    case "light":
      return <SunIcon className={`${props.className}`} />;
    case "dark":
      return <MoonIcon className={`${props.className}`} />;
    default:
      return <ComputerDesktopIcon className={`${props.className}`} />;
  }
};

export default function ThemeSelectButton(props: ThemeSelectorProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);

  const themes: { value: ThemeValue; label: string }[] = [
    { value: "light", label: t("theme.light") },
    { value: "dark", label: t("theme.dark") },
    { value: "system", label: t("theme.system") },
  ];

  return (
    <Menu>
      <MenuButton
        className={clsx(
          "flex items-center hover:cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700 group relative space-x-2 p-1 rounded-md focus:outline-none",
          defaultClassName.bg,
          props.className,
        )}
      >
        <ThemeIcon theme={theme} className="size-5" />
      </MenuButton>
      <MenuItems
        transition
        anchor="top start"
        className="transition duration-200 bg-white border-2 border-gray-600 rounded-lg shadow-lg focus:outline-none dark:bg-gray-800 [--anchor-gap:--spacing(1)] ease-in-out"
      >
        {themes.map((t) => (
          <MenuItem
            as="button"
            disabled={theme === t.value}
            key={t.value}
            className="flex items-center w-full px-3 py-2 space-x-2 text-gray-800 hover:cursor-pointer hover:bg-gray-400 hover:opacity-80 dark:hover:bg-gray-700 dark:text-gray-300"
            onClick={() => setTheme(t.value)}
          >
            <ThemeIcon theme={t.value} className="size-5" />
            <div className="min-w-12">{t.label}</div>
            {theme === t.value && (
              <CheckCircleIcon className="flex-none ml-auto size-5" />
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
