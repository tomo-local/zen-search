import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from '@storybook/react';

import BookmarkItem, { type BookmarkItemProps } from './BookmarkItem';

const meta: Meta = {
  component: BookmarkItem,
};

export default meta;

type Story = StoryObj<BookmarkItemProps>;

export const Default: Story = {
  args: {
    item: { id: "1", title: "Example Bookmark", url: "https://example.com" },
    onClick: action('clicked'),
    selected: false,
  },
};