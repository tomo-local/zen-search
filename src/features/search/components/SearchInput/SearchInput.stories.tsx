import MagnifyingGlassIcon from "@heroicons/react/16/solid/MagnifyingGlassIcon";
import type { Meta, StoryObj } from "@storybook/react";

import SearchInput, { type SearchInputProps } from "./SearchInput";

const meta: Meta<SearchInputProps> = {
  component: SearchInput,
};

export default meta;

type Story = StoryObj<SearchInputProps>;

export const Default: Story = {
  args: {
    leftContent: <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />,
    value: "Search...",
    rightContent: (
      <div className="flex items-center space-x-1">
        <div>Change to</div>
        <div className="text-gray-400">All</div>
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
      </div>
    ),
  },
};
