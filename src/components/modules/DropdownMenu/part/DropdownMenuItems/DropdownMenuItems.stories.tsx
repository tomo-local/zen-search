import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DropdownMenu from "../../DropdownMenu";
import { DropdownMenuButton } from "../DropdownMenuButton/DropdownMenuButton";
import { DropdownMenuItem } from "../DropdownMenuItem/DropdownMenuItem";
import { DropdownMenuItems } from "./DropdownMenuItems";

const meta: Meta<typeof DropdownMenuItems> = {
  component: DropdownMenuItems,
  decorators: [
    (Story) => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <DropdownMenu
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
          selectedValue={undefined}
          onSelect={action("select")}
          className="w-64"
        >
          <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg">
            <span className="text-sm font-medium text-gray-800">Fruits</span>
            <span className="text-gray-500">v</span>
          </DropdownMenuButton>
          <Story />
        </DropdownMenu>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof DropdownMenuItems>;

export const Default: Story = {
  render: () => (
    <DropdownMenuItems>
      <div className="px-4 py-3 text-sm text-gray-700">
        Dropdown content here
      </div>
    </DropdownMenuItems>
  ),
};

export const WithItems: Story = {
  render: () => (
    <DropdownMenuItems>
      <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
      <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
      <DropdownMenuItem value="cherry">Cherry</DropdownMenuItem>
    </DropdownMenuItems>
  ),
};

export const OpenRight: Story = {
  render: () => (
    <DropdownMenuItems position="right" className="w-48">
      <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
      <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
      <DropdownMenuItem value="cherry">Cherry</DropdownMenuItem>
    </DropdownMenuItems>
  ),
};

export const OpenUp: Story = {
  render: () => (
    <DropdownMenuItems position="top">
      <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
      <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
      <DropdownMenuItem value="cherry">Cherry</DropdownMenuItem>
    </DropdownMenuItems>
  ),
};

export const OpenRightEnd: Story = {
  render: () => (
    <DropdownMenuItems position="right" align="end" className="w-48">
      <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
      <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
      <DropdownMenuItem value="cherry">Cherry</DropdownMenuItem>
    </DropdownMenuItems>
  ),
};

export const OpenTopEnd: Story = {
  render: () => (
    <DropdownMenuItems position="top" align="end">
      <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
      <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
      <DropdownMenuItem value="cherry">Cherry</DropdownMenuItem>
    </DropdownMenuItems>
  ),
};
