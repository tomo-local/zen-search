import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import clsx from "clsx";
import { useState } from "react";
import DropdownMenu, {
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuItems,
  type DropdownMenuProps,
} from "./index";

const meta: Meta<DropdownMenuProps> = {
  component: DropdownMenu,
};

export default meta;

type Story = StoryObj<DropdownMenuProps>;

const sampleItems = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

const StatefulDropdownMenu = ({
  defaultOpen = false,
  defaultSelected = sampleItems[0].value,
}: {
  defaultOpen?: boolean;
  defaultSelected?: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [selectedValue, setSelectedValue] = useState(defaultSelected);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      action("toggle")(next ? "opened" : "closed");
      return next;
    });
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    action("select")(value);
  };

  const selectedLabel =
    sampleItems.find((item) => item.value === selectedValue)?.label ?? "Select";

  return (
    <DropdownMenu
      className="w-64"
      isOpen={isOpen}
      onToggle={handleToggle}
      selectedValue={selectedValue}
      onSelect={handleSelect}
    >
      <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
        <span className="text-sm font-medium text-gray-800">
          {selectedLabel}
        </span>
        <span
          className={clsx(
            "text-gray-500 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        >
          v
        </span>
      </DropdownMenuButton>
      <DropdownMenuItems>
        {sampleItems.map((item) => (
          <DropdownMenuItem key={item.value} value={item.value}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuItems>
    </DropdownMenu>
  );
};

export const Default: Story = {
  render: () => <StatefulDropdownMenu />,
};

export const WithDisabledItem: Story = {
  render: () => (
    <DropdownMenu
      className="w-64"
      isOpen
      onToggle={action("toggle")}
      selectedValue="apple"
      onSelect={action("select")}
    >
      <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg">
        <span className="text-sm font-medium text-gray-800">Choose fruit</span>
        <span className="text-gray-500">v</span>
      </DropdownMenuButton>
      <DropdownMenuItems>
        <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
        <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
        <DropdownMenuItem value="cherry" disabled>
          Cherry (disabled)
        </DropdownMenuItem>
      </DropdownMenuItems>
    </DropdownMenu>
  ),
};

export const OpenRight: Story = {
  render: () => (
    <DropdownMenu
      className="w-64"
      isOpen
      onToggle={action("toggle")}
      selectedValue="apple"
      onSelect={action("select")}
    >
      <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg">
        <span className="text-sm font-medium text-gray-800">Open Right</span>
        <span className="text-gray-500">v</span>
      </DropdownMenuButton>
      <DropdownMenuItems position="right" className="w-48">
        <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
        <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
        <DropdownMenuItem value="cherry">Cherry</DropdownMenuItem>
      </DropdownMenuItems>
    </DropdownMenu>
  ),
};

export const OpenUp: Story = {
  render: () => (
    <DropdownMenu
      className="w-64"
      isOpen
      onToggle={action("toggle")}
      selectedValue="apple"
      onSelect={action("select")}
    >
      <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg">
        <span className="text-sm font-medium text-gray-800">Open Up</span>
        <span className="text-gray-500">v</span>
      </DropdownMenuButton>
      <DropdownMenuItems position="top">
        <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
        <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
        <DropdownMenuItem value="cherry">Cherry</DropdownMenuItem>
      </DropdownMenuItems>
    </DropdownMenu>
  ),
};

export const OpenRightEnd: Story = {
  render: () => (
    <DropdownMenu
      className="w-64"
      isOpen
      onToggle={action("toggle")}
      selectedValue="apple"
      onSelect={action("select")}
    >
      <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg">
        <span className="text-sm font-medium text-gray-800">
          Open Right End
        </span>
        <span className="text-gray-500">v</span>
      </DropdownMenuButton>
      <DropdownMenuItems position="right" align="end" className="w-48">
        <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
        <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
        <DropdownMenuItem value="cherry">Cherry</DropdownMenuItem>
      </DropdownMenuItems>
    </DropdownMenu>
  ),
};

export const OpenTopEnd: Story = {
  render: () => (
    <DropdownMenu
      className="w-64"
      isOpen
      onToggle={action("toggle")}
      selectedValue="apple"
      onSelect={action("select")}
    >
      <DropdownMenuButton className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg">
        <span className="text-sm font-medium text-gray-800">Open Top End</span>
        <span className="text-gray-500">v</span>
      </DropdownMenuButton>
      <DropdownMenuItems position="top" align="end">
        <DropdownMenuItem value="apple">Apple</DropdownMenuItem>
        <DropdownMenuItem value="banana">Banana</DropdownMenuItem>
        <DropdownMenuItem value="cherry">Cherry</DropdownMenuItem>
      </DropdownMenuItems>
    </DropdownMenu>
  ),
};
