import ArrowLongRightIcon from "@heroicons/react/16/solid/ArrowLongRightIcon";
import MagnifyingGlassIcon from "@heroicons/react/16/solid/MagnifyingGlassIcon";
import WindowIcon from "@heroicons/react/16/solid/WindowIcon";
import QuestionMarkCircleIcon from "@heroicons/react/16/solid/QuestionMarkCircleIcon";
import BookmarkIcon from "@heroicons/react/16/solid/BookmarkIcon";

import { ListContext } from "@/machine/searchList";

function LeftIcon({ item }: { item: ListContext }) {
  const searchFavicon = (url: string) => {
    return `http://www.google.com/s2/favicons?domain=${url}`;
  };

  switch (item.type) {
    case "tab":
      return item.icon ? (
        <img src={item.icon} alt="icon" className="size-5" />
      ) : (
        <WindowIcon className="size-5" />
      );
    case "history":
    case "bookmark":
      return (
        <img src={searchFavicon(item.url)} alt="icon" className="size-5" />
      );
    case "search":
      return <MagnifyingGlassIcon className="size-5" />;
    default:
      return <QuestionMarkCircleIcon className="size-5" />;
  }
}

type ResultLineProps = {
  key: string;
  item: ListContext;
  index: number;
  selectedIndex: number;
  onMouseEnter: (index: number) => void;
  onClick: () => void;
};

function ResultLine({
  key,
  item,
  index,
  selectedIndex,
  onMouseEnter,
  onClick,
}: ResultLineProps) {
  return (
    <li key={key}>
      <button
        type="button"
        key={item.type === "tab" ? item.id : item.url}
        className={`${
          selectedIndex === index && "bg-gray-700"
        } border-gray-700 rounded-lg flex w-full space-x-3 my-1 p-3 text-left hover:bg-gray-700 flex items-center justify-center justify-items-center`}
        onMouseEnter={() => onMouseEnter(index)}
        onClick={onClick}
      >
        <div className="flex flex-none justify-center justify-items-center items-center h-full">
          <LeftIcon item={item} />
        </div>
        <div className="text-left truncate grow text-nowrap">{item.title}</div>
        {item.type === "tab" && (
          <div className="flex flex-none justify-between items-center w-28">
            <div className="text-left truncate text-nowrap">Switch to Tab</div>
            <span>
              <div className="flex justify-center items-center p-1 bg-gray-900 rounded-lg">
                <ArrowLongRightIcon className="size-4" />
              </div>
            </span>
          </div>
        )}
        {(item.type === "history" || item.type === "bookmark") && item.url && (
          <div className="grow">
            <span className="text-gray-500 truncate text-none">
              {new URL(item.url).hostname}
            </span>
          </div>
        )}

        {item.type === "bookmark" && (
          <div className="flex flex-none justify-between items-center ml-auto">
            <div className="flex justify-center items-center p-1 bg-gray-900 rounded-lg">
              <BookmarkIcon className="size-4" />
            </div>
          </div>
        )}
      </button>
    </li>
  );
}
export default ResultLine;
