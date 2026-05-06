import { useCallback } from "react";
import SearchApp from "@/features/search/components/SearchApp/SearchApp";
import ErrorBoundary from "@/shared/components/ErrorBoundary/ErrorBoundary";

export default function App() {
  const handleClose = useCallback(() => window.close(), []);
  return (
    <ErrorBoundary>
      <SearchApp onClose={handleClose} />
    </ErrorBoundary>
  );
}
