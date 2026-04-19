import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import RectangleGroupIcon from "@heroicons/react/16/solid/RectangleGroupIcon";
import Squares2X2Icon from "@heroicons/react/16/solid/Squares2X2Icon";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useCallback } from "react";
import useViewMode from "@/features/settings/hooks/useViewMode";
import type { ViewModeValue } from "@/services/storage/types";
import { defaultClassName } from "@/shared/components/ButtonItem/ButtonItem";
import { useTranslation } from "@/shared/hooks/useTranslation";

export type ViewModeSelectProps = {
  className?: string;
};

const ViewModeIcon = (props: { mode: ViewModeValue; className?: string }) => {
  switch (props.mode) {
    case "sidepanel":
      return <RectangleGroupIcon className={props.className} />;
    default:
      return <Squares2X2Icon className={props.className} />;
  }
};

export default function ViewModeSelect(props: ViewModeSelectProps) {
  const { t } = useTranslation();
  const { viewMode, setViewMode } = useViewMode();

  const handleChange = useCallback(
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
      }
    },
    [viewMode, setViewMode],
  );

  const modes: { value: ViewModeValue; label: string }[] = [
    { value: "popup", label: t("viewMode.popup") },
    { value: "sidepanel", label: t("viewMode.sidepanel") },
  ];

  return (
    <Menu>
      <MenuButton
        aria-label={t("settings.viewMode")}
        className={clsx(
          "flex items-center hover:cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700 group relative space-x-2 p-1 rounded-md focus:outline-none",
          defaultClassName.bg,
          props.className,
        )}
      >
        <ViewModeIcon mode={viewMode} className="size-5" />
      </MenuButton>
      <MenuItems
        transition
        anchor="top start"
        className="transition duration-200 ease-in-out bg-white border-2 border-gray-600 rounded-lg shadow-lg focus:outline-none dark:bg-gray-800 [--anchor-gap:--spacing(1)] data-[closed]:opacity-0 data-[closed]:scale-95"
      >
        {modes.map((m) => (
          <MenuItem
            as="button"
            disabled={viewMode === m.value}
            key={m.value}
            className="flex items-center w-full px-3 py-2 space-x-2 text-gray-800 hover:cursor-pointer hover:bg-gray-400 hover:opacity-80 dark:hover:bg-gray-700 dark:text-gray-300"
            onClick={() => handleChange(m.value)}
          >
            <ViewModeIcon mode={m.value} className="size-5" />
            <div className="min-w-20">{m.label}</div>
            {viewMode === m.value && (
              <CheckCircleIcon className="flex-none ml-auto size-5" />
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
