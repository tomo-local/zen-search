import BookmarkIcon from "@heroicons/react/16/solid/BookmarkIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import clsx from "clsx";
import type React from "react";
import { useMemo } from "react";
import type { Bookmark } from "@/services/bookmark/types";

import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "../../modules/ButtonItem/ButtonItem";
import SquareIcon from "../../modules/SquareIcon/SquareIcon";

type BookmarkData = Pick<
  Bookmark["data"],
  "id" | "title" | "url" | "favIconUrl"
>;

export type BookmarkItemProps = Pick<
  ButtonItemProps,
  "onClick" | "selected"
> & {
  item: {
    data: BookmarkData;
  };
};

const BookmarkItem: React.FC<BookmarkItemProps> = ({
  onClick,
  selected,
  item,
}) => {
  const LeftIcon = useMemo(
    () => (
      <SquareIcon>
        {item.data.favIconUrl ? (
          <img
            src={item.data.favIconUrl}
            alt="Favicon"
            className={clsx(
              defaultClassName.icon.size,
              defaultClassName.icon.text,
            )}
          />
        ) : (
          <BookmarkIcon
            className={clsx(
              defaultClassName.icon.size,
              defaultClassName.icon.text,
            )}
          />
        )}
      </SquareIcon>
    ),
    [item.data.favIconUrl],
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
        id={item.data.id}
        className="relative flex flex-col items-center justify-center max-w-fit"
      >
        <div className="text-sm truncate max-w-[450px] md:max-w-md whitespace-nowrap">
          {item.data.title || item.data.url}
        </div>
      </div>
    </ButtonItem>
  );
};

export default BookmarkItem;
