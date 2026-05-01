import { useCallback } from "react";
import SearchApp from "@/features/search/components/SearchApp/SearchApp";

export default function App() {
  const handleClose = useCallback(() => window.close(), []);
  return <SearchApp onClose={handleClose} />;
}
