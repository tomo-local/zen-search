import { action } from "@storybook/addon-actions";
import clsx from "clsx";
import type { Meta, StoryObj } from "@storybook/react";

import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "./ButtonItem";

const meta: Meta = {
  component: ButtonItem,
};

export default meta;

type Story = StoryObj<ButtonItemProps>;

export const Default: Story = {
  args: {
    key: "result-item-1",
    className: clsx(
      defaultClassName.bg,
      defaultClassName.text,
      defaultClassName.border,
      defaultClassName.hover
    ),
    onClick: () => action("clicked"),
    children: "Result Item",
    selected: false,
  },
};
