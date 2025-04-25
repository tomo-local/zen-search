import ThemeSelector from "@/components/common/ThemeSelector";
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
          <ThemeSelector className="text-gray-400" />
          <p className="text-gray-400">Loading...</p>
          <LinearProgress active={loading} size="xs" />
        </div>
      </Footer>
    );
  }

  return (
    <Footer className={`pt-1 text-base ${className}`}>
      <div className="flex flex-row items-center justify-between space-x-2">
        <ThemeSelector className="text-gray-400" />
        {result.length ? (
          <p className="text-base text-right text-gray-400">
            {result.length} Results Found
          </p>
        ) : (
          <p className="text-right text-gray-400">No Results Found</p>
        )}
      </div>
    </Footer>
  );
}
