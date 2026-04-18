import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Cog6ToothIcon from "@heroicons/react/16/solid/Cog6ToothIcon";
import ComputerDesktopIcon from "@heroicons/react/16/solid/ComputerDesktopIcon";
import MoonIcon from "@heroicons/react/16/solid/MoonIcon";
import RectangleGroupIcon from "@heroicons/react/16/solid/RectangleGroupIcon";
import Squares2X2Icon from "@heroicons/react/16/solid/Squares2X2Icon";
import SunIcon from "@heroicons/react/16/solid/SunIcon";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useCallback, useContext } from "react";
import useViewMode from "@/features/settings/hooks/useViewMode";
import { ThemeContext } from "@/features/theme/context/ThemeProvider";
import { MessageType } from "@/services/runtime/types";
import type { ThemeValue, ViewModeValue } from "@/services/storage/types";
import { defaultClassName } from "@/shared/components/ButtonItem/ButtonItem";
import { useTranslation } from "@/shared/hooks/useTranslation";

export type SettingsButtonProps = {
  className?: string;
};

const ThemeIcon = (props: { theme: ThemeValue; className?: string }) => {
  switch (props.theme) {
    case "light":
      return <SunIcon className={props.className} />;
    case "dark":
      return <MoonIcon className={props.className} />;
    default:
      return <ComputerDesktopIcon className={props.className} />;
  }
};

const ViewModeIcon = (props: { mode: ViewModeValue; className?: string }) => {
  switch (props.mode) {
    case "sidepanel":
      return <RectangleGroupIcon className={props.className} />;
    default:
      return <Squares2X2Icon className={props.className} />;
  }
};

export default function SettingsButton(props: SettingsButtonProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);
  const { viewMode, setViewMode } = useViewMode();

  const handleViewModeChange = useCallback(
    async (value: ViewModeValue) => {
      if (value === viewMode) return;
      setViewMode(value);
      if (value === "sidepanel") {
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
        if (tab?.id) {
          await chrome.sidePanel.open({ tabId: tab.id }).catch(console.error);
        }
        window.close();
      } else {
        // background 経由で openPopup を呼ぶ（ユーザージェスチャーが伝播する）
        chrome.runtime.sendMessage({ type: MessageType.SWITCH_VIEW_MODE }, () =>
          window.close(),
        );
      }
    },
    [viewMode, setViewMode],
  );

  const themes: { value: ThemeValue; label: string }[] = [
    { value: "light", label: t("theme.light") },
    { value: "dark", label: t("theme.dark") },
    { value: "system", label: t("theme.system") },
  ];

  const modes: { value: ViewModeValue; label: string }[] = [
    { value: "popup", label: t("viewMode.popup") },
    { value: "sidepanel", label: t("viewMode.sidepanel") },
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
        <Cog6ToothIcon className="size-5" />
      </MenuButton>
      <MenuItems
        transition
        anchor="top start"
        className="transition duration-200 ease-in-out bg-white border-2 border-gray-600 rounded-lg shadow-lg focus:outline-none dark:bg-gray-800 [--anchor-gap:--spacing(1)] data-[closed]:opacity-0 data-[closed]:scale-95"
      >
        <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {t("settings.theme")}
        </div>
        {themes.map((item) => (
          <MenuItem
            as="button"
            disabled={theme === item.value}
            key={item.value}
            className="flex items-center w-full px-3 py-2 space-x-2 text-gray-800 hover:cursor-pointer hover:bg-gray-400 hover:opacity-80 dark:hover:bg-gray-700 dark:text-gray-300"
            onClick={() => setTheme(item.value)}
          >
            <ThemeIcon theme={item.value} className="size-5" />
            <div className="min-w-16">{item.label}</div>
            {theme === item.value && (
              <CheckCircleIcon className="flex-none ml-auto size-5" />
            )}
          </MenuItem>
        ))}
        <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
        <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {t("settings.viewMode")}
        </div>
        {modes.map((item) => (
          <MenuItem
            as="button"
            disabled={viewMode === item.value}
            key={item.value}
            className="flex items-center w-full px-3 py-2 space-x-2 text-gray-800 hover:cursor-pointer hover:bg-gray-400 hover:opacity-80 dark:hover:bg-gray-700 dark:text-gray-300"
            onClick={() => handleViewModeChange(item.value)}
          >
            <ViewModeIcon mode={item.value} className="size-5" />
            <div className="min-w-20">{item.label}</div>
            {viewMode === item.value && (
              <CheckCircleIcon className="flex-none ml-auto size-5" />
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
