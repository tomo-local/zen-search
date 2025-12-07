import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DropdownMenu from "../../DropdownMenu";
import { DropdownMenuButton } from "./DropdownMenuButton";

const meta: Meta<typeof DropdownMenuButton> = {
  component: DropdownMenuButton,
  decorators: [
    (Story) => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <DropdownMenu
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
          selectedValue={undefined}
          onSelect={action("select")}
          className="w-64"
        >
          <Story />
        </DropdownMenu>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof DropdownMenuButton>;

export const Default: Story = {
  render: () => (
    <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
      <span className="text-sm font-medium text-gray-800">Choose option</span>
      <span className="text-gray-500">v</span>
    </DropdownMenuButton>
  ),
};

export const Active: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <DropdownMenu
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        selectedValue={undefined}
        onSelect={action("select")}
        className="w-64"
      >
        <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-800">Opened</span>
          <span className="text-gray-500 rotate-180">v</span>
        </DropdownMenuButton>
      </DropdownMenu>
    );
  },
};
