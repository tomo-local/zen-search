import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Accordion, { type AccordionProps } from "./Accordion";
import { AccordionContent } from "./part/AccordionContent/AccordionContent";
import { AccordionTitle } from "./part/AccordionTitle/AccordionTitle";

const meta: Meta<AccordionProps> = {
  component: Accordion,
};

export default meta;

type Story = StoryObj<AccordionProps>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Accordion
        isOpen={isOpen}
        onToggle={() => {
          setIsOpen(!isOpen);
          action("Toggled")(isOpen ? "closed" : "opened");
        }}
        className="border border-b border-gray-300 rounded-lg"
      >
        <AccordionTitle className="w-full px-4 py-3 font-semibold text-left">
          Default Title
        </AccordionTitle>
        <AccordionContent className="duration-[300ms] ease-in-out bg-white rounded-b-lg">
          <div className="px-4 py-4">
            <p>This is the default accordion content.</p>
          </div>
        </AccordionContent>
      </Accordion>
    );
  },
};

export const Opened: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Accordion
        isOpen={isOpen}
        onToggle={() => {
          setIsOpen(!isOpen);
          action("Toggled")(isOpen ? "closed" : "opened");
        }}
        className="overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <AccordionTitle className="w-full px-4 py-3 font-semibold text-left transition-colors duration-200 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 active:bg-gray-200">
          Opened by Default
        </AccordionTitle>
        <AccordionContent className="duration-[300ms] ease-in-out rounded-b-lg">
          <div className="px-4 py-4">
            <p>This is the default accordion content.</p>
          </div>
        </AccordionContent>
      </Accordion>
    );
  },
};

export const WithDetailedContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Accordion
        isOpen={isOpen}
        onToggle={() => {
          setIsOpen(!isOpen);
          action("Toggled")(isOpen ? "closed" : "opened");
        }}
        className="overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <AccordionTitle className="w-full px-4 py-3 font-semibold text-left transition-colors duration-200 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 active:bg-gray-200">
          <h2>Detailed Information</h2>
        </AccordionTitle>
        <AccordionContent className="duration-[300ms] ease-in-out bg-white rounded-b-lg">
          <div className="px-4 py-4">
            <h3>Section Details</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </div>
        </AccordionContent>
      </Accordion>
    );
  },
};
