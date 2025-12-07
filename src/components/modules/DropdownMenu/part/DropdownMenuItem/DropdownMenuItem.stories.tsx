import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DropdownMenu from "../../DropdownMenu";
import { DropdownMenuButton } from "../DropdownMenuButton/DropdownMenuButton";
import { DropdownMenuItems } from "../DropdownMenuItems/DropdownMenuItems";
import { DropdownMenuItem } from "./DropdownMenuItem";

const meta: Meta<typeof DropdownMenuItem> = {
  component: DropdownMenuItem,
  decorators: [
    (Story) => {
      const [isOpen, setIsOpen] = useState(true);
      const [selected, setSelected] = useState<string | undefined>("apple");
      const handleSelect = (value: string) => {
        setSelected(value);
        action("select")(value);
      };
      return (
        <DropdownMenu
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
          selectedValue={selected}
          onSelect={handleSelect}
          className="w-64"
        >
          <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-t-lg bg-white">
            <span className="text-sm font-medium text-gray-800">Pick one</span>
            <span className="text-gray-500">v</span>
          </DropdownMenuButton>
          <DropdownMenuItems className="bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-sm duration-[200ms] ease-in-out">
            <Story />
          </DropdownMenuItems>
        </DropdownMenu>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof DropdownMenuItem>;

export const Default: Story = {
  render: () => <DropdownMenuItem value="apple">Apple</DropdownMenuItem>,
};

export const Active: Story = {
  render: () => <DropdownMenuItem value="banana">Banana</DropdownMenuItem>,
};

export const Disabled: Story = {
  render: () => (
    <DropdownMenuItem value="cherry" disabled>
      Cherry (disabled)
    </DropdownMenuItem>
  ),
};
