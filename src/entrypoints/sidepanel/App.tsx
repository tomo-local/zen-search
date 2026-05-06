import SearchApp from "@/features/search/components/SearchApp/SearchApp";
import ErrorBoundary from "@/shared/components/ErrorBoundary/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <SearchApp variant="sidepanel" />
    </ErrorBoundary>
  );
}
