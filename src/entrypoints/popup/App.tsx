import { useEffect, useRef, useState } from "react";

import SearchBar from "@/components/SearchBar";
import ResultLine from "@/components/ResultLine";

import { ListType, ListContext } from "@/machine/searchList";
import {
  searchHistorySearch,
  searchSuggestions,
  searchTabSearch,
  searchBookmarkSearch,
} from "@/function/search";

const Popup = () => {
  const [searchType, setSearchType] = useState<ListType>("all");
  const [stockType, setStockType] = useState<string>();

  const [list, setList] = useState<ListContext[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedItem = listRef.current.children[selectedIndex];
      selectedItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    updateList();
  }, [searchTerm]);

  const updateList = async () => {
    const newList = await searchList(searchTerm, {
      suggestionCount: 5,
      historyCount: 10,
      tabCount: 10,
    });

    setList(newList);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
  };

  const searchList = async (
    query: string,
    option: {
      historyCount?: number;
      tabCount?: number;
      suggestionCount?: number;
    }
  ) => {
    const suggestionResult = ["all", "search"].includes(searchType)
      ? await searchSuggestions({
          query,
          option: {
            count: searchType === "search" ? 20 : option.suggestionCount || 5,
          },
        })
      : [];

    const tabResult = ["all", "tab"].includes(searchType)
      ? await searchTabSearch({
          query,
          option: { count: searchType === "tab" ? 20 : option.tabCount },
        })
      : [];

    const historyResult = ["all", "history"].includes(searchType)
      ? await searchHistorySearch({
          query,
          option: {
            count: searchType === "history" ? 20 : option.historyCount,
            term: {
              start: new Date().getTime() - 1000 * 60 * 60 * 24 * 30, // 30日前から
              end: new Date().getTime(), // 現在まで
            },
          },
        })
      : [];

    const bookmarkResult = ["all", "bookmark"].includes(searchType)
      ? await searchBookmarkSearch({
          query,
          option: { count: 10 },
        })
      : [];

    console.log({
      suggestionResult,
      tabResult,
      historyResult,
      bookmarkResult,
    });

    const list = [
      ...suggestionResult?.map((item) => ({
        type: "search",
        title: item,
        url: `https://www.google.com/search?q=${item}`,
      })),
      ...tabResult?.map((tab) => ({
        type: "tab",
        title: tab?.title || "",
        icon: tab?.favIconUrl,
        id: tab.id,
      })),
      ...historyResult?.map((history) => ({
        type: "history",
        title: history.title || "",
        url: history.url,
      })),
      ...bookmarkResult?.map((bookmark) => ({
        type: "bookmark",
        title: bookmark.title,
        url: bookmark.url,
      })),
    ] as ListContext[];

    return rankResults(list);
  };

  const rankResults = (result: ListContext[]) => {
    const ranked = result.sort((a, b) => {
      //完全一致を最優先
      const aTitle = a.title?.toLowerCase() || "";
      const bTitle = b.title?.toLowerCase() || "";

      const aExactMatch = aTitle === searchTerm.toLowerCase();
      const bExactMatch = bTitle === searchTerm.toLowerCase();
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // 次に部分一致
      const aPartialMatch = aTitle.includes(searchTerm.toLowerCase());
      const bPartialMatch = bTitle.includes(searchTerm.toLowerCase());

      if (aPartialMatch && !bPartialMatch) return -1;
      if (!aPartialMatch && bPartialMatch) return 1;

      // タブ、履歴、検索候補の優先順位
      const typeOrder = {
        tab: 0,
        history: 3,
        search: 2,
        bookmark: 1,
      };

      if (a.type === b.type) {
        return 0;
      }

      return typeOrder[a.type] - typeOrder[b.type];
    });

    return ranked;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "t") {
      e.preventDefault();
      window.close();
    }

    if (e.key === "Enter" && selectedIndex >= 0 && !isComposing) {
      const item = list[selectedIndex];
      if (item.type === "tab") {
        chrome.tabs.update(item.id as number, { active: true });
      } else {
        window.open(item.url, "_blank");
      }
      setSelectedIndex(-1); // 選択後、選択状態をリセット
    }

    if (
      e.key === "Enter" &&
      selectedIndex < 0 &&
      !isComposing &&
      searchType === "search" &&
      searchTerm !== ""
    ) {
      window.open(`https://www.google.com/search?q=${searchTerm}`, "_blank");
    }

    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, list.length - 1));
    }
    if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (searchTerm.toLowerCase() === "google") {
        setStockType(searchTerm);
        setSearchType("search");
        setSearchTerm("");
      }

      if (searchTerm.toLowerCase() === "tab") {
        setStockType(searchTerm);
        setSearchType("tab");
        setSearchTerm("");
      }

      if (searchTerm.toLowerCase() === "history") {
        setStockType(searchTerm);
        setSearchType("history");
        setSearchTerm("");
      }

      if (searchTerm.toLowerCase() === "bookmark") {
        setStockType(searchTerm);
        setSearchType("bookmark");
        setSearchTerm("");
      }

      if (searchTerm.toLowerCase() === "all") {
        setSearchType("all");
        setSearchTerm("");
      }
    }

    if (
      (e.key === "Delete" || e.key === "Backspace") &&
      searchTerm === "" &&
      searchType !== "all"
    ) {
      e.preventDefault();
      setSearchType("all");
      setSearchTerm(stockType || "");
      setStockType("");
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "w") {
      e.preventDefault();
      const tab = list[selectedIndex];

      if (tab.type === "tab") {
        chrome.tabs.remove(tab.id as number);
        setSelectedIndex(selectedIndex <= 0 ? 0 : selectedIndex - 1);

        const newList = list.filter((_, index) => index !== selectedIndex);

        setList(newList);
      }
    }
  };

  const handleMouseEnter = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="px-4 pt-2 pb-3 font-sans text-white bg-gray-800 w-[700px]">
      <div className="sticky top-0 border-b border-gray-700 ">
        <SearchBar
          type={searchType}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
        />
      </div>
      <div className="mt-4 bg-gray-800 rounded">
        <ul
          ref={listRef}
          className="overflow-y-scroll max-h-[400px] hidden-scrollbar"
        >
          {list.map((item, index) => (
            <ResultLine
              key={`${index.toString()}`}
              item={item}
              index={index}
              selectedIndex={selectedIndex}
              onMouseEnter={handleMouseEnter}
              onClick={() => {
                if (item.type === "tab") {
                  chrome.tabs.update(item.id as number, {
                    active: true,
                  });
                  window.close();
                } else {
                  window.open(item.url, "_blank");
                }
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Popup;
