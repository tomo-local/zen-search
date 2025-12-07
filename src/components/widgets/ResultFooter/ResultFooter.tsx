import Modules from "@/components/modules";
import Footer from "@/components/modules/Footer/Footer";
import ThemeSelectButton from "@/components/widgets/ThemeSelectButton/ThemeSelectButton";
import { useTranslation } from "@/hooks/storage/useTranslation";

export interface ResultFooterProps {
  className?: string;
  loading: boolean;
  count?: number;
}

export default function ResultFooter({
  className,
  loading,
  count,
}: ResultFooterProps) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <Footer className={`text-base ${className}`}>
        <div className="flex flex-row items-center justify-between space-x-2">
          <ThemeSelectButton className="dark:text-gray-400" />
          <div className="flex flex-row items-center justify-center space-x-2">
            <p className="text-gray-400 ">{t("ui.loading")}</p>
            <Modules.Spinner active={loading} size="xs" />
          </div>
        </div>
      </Footer>
    );
  }

  return (
    <Footer className={`text-base ${className}`}>
      <div className="flex flex-row items-center justify-between space-x-2">
        <ThemeSelectButton className="dark:text-gray-400" />
        <p className="text-base font-bold text-right dark:text-gray-400">
          {count ?? 0} {t("ui.results")}
        </p>
      </div>
    </Footer>
  );
}
