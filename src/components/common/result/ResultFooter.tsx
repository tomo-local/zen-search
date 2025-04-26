import ThemeSelectButton from "@/components/common/ThemeSelectButton";
import Footer from "@/components/modules/Footer";
import LinearProgress from "@/components/modules/LoadingSpinner";
import { Result } from "@/types/result";

interface ResultFooterProps {
  className?: string;
  loading: boolean;
  result: Result[];
}

export default function ResultFooter({
  className,
  result,
  loading,
}: ResultFooterProps) {
  if (loading) {
    return (
      <Footer className={`pt-1 text-base ${className}`}>
        <div className="flex flex-row items-center justify-between space-x-2">
          <ThemeSelectButton className="dark:text-gray-400" />
          <div className="flex flex-row items-center justify-center space-x-2">
            <p className="text-gray-400 ">Loading...</p>
            <LinearProgress active={loading} size="xs" />
          </div>
        </div>
      </Footer>
    );
  }

  return (
    <Footer className={`pt-1 text-base ${className}`}>
      <div className="flex flex-row items-center justify-between space-x-2">
        <ThemeSelectButton className="dark:text-gray-400" />
        {result.length ? (
          <p className="text-base font-bold text-right dark:text-gray-400">
            {result.length} RESULTS
          </p>
        ) : (
          <p className="font-bold text-right dark:text-gray-400">NO FOUND</p>
        )}
      </div>
    </Footer>
  );
}
