import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type React from "react";
import { useMemo } from "react";
import type { NewBookmark as Bookmark } from "@/services/bookmark/types";

import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "../../modules/ButtonItem/ButtonItem";
import SquareIcon from "../../modules/SquareIcon/SquareIcon";

type BookmarkData = Pick<Bookmark["data"], "id" | "title" | "url">;

export type BookmarkItemProps = Pick<
  ButtonItemProps,
  "onClick" | "selected"
> & {
  item: BookmarkData;
};

const BookmarkItem: React.FC<BookmarkItemProps> = ({
  onClick,
  selected,
  item,
}) => {
  const LeftIcon = (
    <SquareIcon>
      <img
        // TODO: BookmarkのURLにfaviconUrlを追加する
        src={`https://www.google.com/s2/favicons?domain=${
          new URL(item.url || "").hostname
        }`}
        alt="favicon"
        className={defaultClassName.icon.size}
      />
    </SquareIcon>
  );

  const RightContent = useMemo(
    () => (
      <div className="flex items-center space-x-2">
        <span className={defaultClassName.text}>Go to Page</span>
        <SquareIcon className={clsx(selected && defaultClassName.icon.bg)}>
          <PlusIcon
            className={clsx(
              defaultClassName.icon.size,
              selected && defaultClassName.icon.selected,
            )}
          />
        </SquareIcon>
      </div>
    ),
    [selected],
  );

  return (
    <ButtonItem
      onClick={onClick}
      selected={selected}
      LeftContent={LeftIcon}
      RightContent={RightContent}
      className={clsx(
        defaultClassName.bg,
        defaultClassName.border,
        defaultClassName.hover,
      )}
    >
      <div
        id={item.id}
        className="relative flex flex-col items-center justify-center max-w-fit justify-items-center"
      >
        <div className="text-sm truncate max-w-[224px] md:max-w-md whitespace-nowrap">
          {item.title || item.url}
        </div>
      </div>
    </ButtonItem>
  );
};

export default BookmarkItem;
