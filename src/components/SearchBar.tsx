// import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import icon from "@/public/icon.png";
import { ListType } from "@/machine/searchList";

function Chip({ value }: { value: string }) {
  return (
    <div className="flex items-center h-8 gap-2 px-3 text-gray-700 bg-gray-200 rounded-full w-max hover:bg-gray-300 hover:bg-opacity-75 focus:bg-gray-300 focus:text-blue-900 active:text-primary active:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:active:text-primary">
      {value}
    </div>
  );
}

function TypeTag({ type }: { type: ListType }) {
  switch (type) {
    case "search":
      return <Chip value="Google" />;
    case "tab":
      return <Chip value="Tab" />;
    case "history":
      return <Chip value="History" />;
    case "bookmark":
      return <Chip value="Bookmark" />;
    default:
      return <Chip value="All" />;
  }
}

function getTypePlaceholder(type: ListType) {
  switch (type) {
    case "search":
    case "history":
    case "tab":
    case "bookmark":
      return "Search...";
    default:
      return "Search or Enter URL...";
  }
}

function isDisplayMessage(value: string) {
  return (
    value.toLowerCase() === "google" ||
    value.toLowerCase() === "tab" ||
    value.toLowerCase() === "history" ||
    value.toLowerCase() === "bookmark"
  );
}

function getRightMessage(value: string) {
  if (value.toLowerCase() === "google") {
    return "Google";
  }

  if (value.toLowerCase() === "tab") {
    return "Tab";
  }

  if (value.toLowerCase() === "history") {
    return "History";
  }

  if (value.toLowerCase() === "bookmark") {
    return "Bookmark";
  }

  return value;
}

function RightMessage({ value }: { value: string }) {
  return (
    <div className="flex items-center justify-center flex-none h-full space-x-2 justify-items-center">
      <div className="text-gray-400">Search {value}</div>
      <div className="flex items-center px-2 py-1 text-gray-300 bg-gray-600 rounded-md w-max text-primary">
        Tab
      </div>
    </div>
  );
}

type SearchBarProps = {
  type: ListType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCompositionStart: (e: React.CompositionEvent<HTMLInputElement>) => void;
  onCompositionEnd: (e: React.CompositionEvent<HTMLInputElement>) => void;
};

export default function SearchBar({
  type,
  value,
  onChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
}: SearchBarProps) {
  return (
    <div className="flex items-center p-2 space-x-2 bg-gray-800">
      <span>
        <img className="size-6" src={icon} />
      </span>
      {type !== "all" && <TypeTag type={type} />}
      <input
        type="text"
        autoFocus
        className="w-full p-2 text-white bg-transparent rounded-lg focus:outline-none"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        placeholder={getTypePlaceholder(type)}
      />
      {type === "all" && isDisplayMessage(value) && (
        <RightMessage value={getRightMessage(value)} />
      )}
    </div>
  );
}
