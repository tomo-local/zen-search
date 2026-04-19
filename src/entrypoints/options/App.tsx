import "@/assets/global.css";
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
import type { ThemeValue, ViewModeValue } from "@/services/storage/types";
import Layout from "@/shared/components/Layout/Layout";
import { useTranslation } from "@/shared/hooks/useTranslation";

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

function OptionsContent() {
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);
  const { viewMode, setViewMode } = useViewMode();

  const handleViewModeChange = useCallback(
    async (value: ViewModeValue) => {
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
    [setViewMode],
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-8">
      <h1 className="text-2xl font-bold mb-8">{t("settings.title")}</h1>

      <section className="mb-8 max-w-md">
        <h2 className="text-lg font-semibold mb-4">{t("settings.theme")}</h2>
        <div className="space-y-2">
          {themes.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTheme(item.value)}
              className={clsx(
                "flex items-center w-full px-4 py-3 rounded-lg border-2 transition-colors",
                theme === item.value
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700",
              )}
            >
              <ThemeIcon theme={item.value} className="size-5 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {theme === item.value && (
                <CheckCircleIcon className="size-5 text-sky-500" />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-md">
        <h2 className="text-lg font-semibold mb-4">{t("settings.viewMode")}</h2>
        <div className="space-y-2">
          {modes.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleViewModeChange(item.value)}
              className={clsx(
                "flex items-center w-full px-4 py-3 rounded-lg border-2 transition-colors",
                viewMode === item.value
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700",
              )}
            >
              <ViewModeIcon mode={item.value} className="size-5 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {viewMode === item.value && (
                <CheckCircleIcon className="size-5 text-sky-500" />
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <OptionsContent />
    </Layout>
  );
}
