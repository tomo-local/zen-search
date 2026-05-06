import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import SuggestionItem, { type SuggestionItemProps } from "./SuggestionItem";

const meta: Meta = {
  component: SuggestionItem,
};

export default meta;

type Story = StoryObj<SuggestionItemProps>;

export const Default: Story = {
  args: {
    item: {
      data: {
        title: "Example Suggestion",
        url: "https://example.com",
        type: "Google",
      },
    },
    onClick: action("SuggestionItem clicked"),
    selected: false,
  },
};
