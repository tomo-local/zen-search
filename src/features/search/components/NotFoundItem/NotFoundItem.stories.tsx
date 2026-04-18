import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import NotFoundItem, { type NotFoundItemProps } from "./NotFoundItem";

const meta: Meta = {
  component: NotFoundItem,
};

export default meta;

type Story = StoryObj<NotFoundItemProps>;

export const Default: Story = {
  args: {
    selected: false,
    onClick: action("clicked"),
  },
};
