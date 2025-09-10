import Modules from "@/components/modules";
import Footer from "@/components/modules/Footer/Footer";
import ThemeSelectButton from "@/components/widgets/ThemeSelectButton/ThemeSelectButton";

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
  if (loading) {
    return (
      <Footer className={`pt-1 text-base ${className}`}>
        <div className="flex flex-row items-center justify-between space-x-2">
          <ThemeSelectButton className="dark:text-gray-400" />
          <div className="flex flex-row items-center justify-center space-x-2">
            <p className="text-gray-400 ">Loading...</p>
            <Modules.Spinner active={loading} size="xs" />
          </div>
        </div>
      </Footer>
    );
  }

  return (
    <Footer className={`pt-1 text-base ${className}`}>
      <div className="flex flex-row items-center justify-between space-x-2">
        <ThemeSelectButton className="dark:text-gray-400" />
        <p className="text-base font-bold text-right dark:text-gray-400">
          {count ?? 0} RESULTS
        </p>
      </div>
    </Footer>
  );
}
