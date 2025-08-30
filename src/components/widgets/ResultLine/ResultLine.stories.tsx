import type { Meta, StoryObj } from "@storybook/react";
import { ActionType } from "@/services/action/types";
import { ResultType } from "@/types/result";

import ResultLine, { type ResultLineProps } from "./ResultLine";

const meta: Meta<ResultLineProps> = {
  component: ResultLine,
};

export default meta;

type Story = StoryObj<ResultLineProps>;

export const Default: Story = {
  args: {
    key: "1",
    item: {
      id: "1",
      type: ResultType.Tab,
      title: "Tab Title",
      url: "https://www.example.com",
      data: {
        active: true,
        lastAccessed: Date.now(),
        windowId: 1,
        currentWindow: true,
      },
    },
    onClick: (event) => {
      console.log("Result line clicked:", event);
    },
    isSelected: false,
  },
};

export const TabSelected: Story = {
  args: {
    key: "2",
    item: {
      id: "2",
      type: ResultType.Tab,
      title: "Selected Tab",
      url: "https://www.google.com",
      data: {
        icon: "https://www.google.com/favicon.ico",
        active: false,
        lastAccessed: Date.now() - 1000000,
        windowId: 1,
        currentWindow: true,
      },
    },
    onClick: (event) => {
      console.log("Selected result line clicked:", event);
    },
    isSelected: true,
  },
};

export const BookmarkItem: Story = {
  args: {
    key: "3",
    item: {
      id: "3",
      type: ResultType.Bookmark,
      title: "Bookmark Title",
      url: "https://www.github.com",
      data: {
        dateAdded: Date.now(),
        parentId: "1",
      },
    },
    onClick: (event) => {
      console.log("Bookmark clicked:", event);
    },
    isSelected: false,
  },
};

export const HistoryItem: Story = {
  args: {
    key: "4",
    item: {
      id: "4",
      type: ResultType.History,
      title: "History Item",
      url: "https://www.stackoverflow.com",
      data: {
        lastVisitTime: Date.now() - 3600000,
        visitCount: 5,
        typedCount: 2,
      },
    },
    onClick: (event) => {
      console.log("History clicked:", event);
    },
    isSelected: false,
  },
};

export const GoogleSuggestion: Story = {
  args: {
    key: "5",
    item: {
      id: "5",
      type: ResultType.Google,
      title: "Google Suggestion",
      url: "https://www.google.com/search?q=example",
      data: {
        originalQuery: "example",
      },
    },
    onClick: (event) => {
      console.log("Suggestion clicked:", event);
    },
    isSelected: false,
  },
};

export const CalculationAction: Story = {
  args: {
    key: "6",
    item: {
      id: "6",
      type: ActionType.Calculation,
      title: "2 + 2 = 4",
      url: "",
      data: {
        expression: "2 + 2",
        result: 4,
      },
    },
    onClick: (event) => {
      console.log("Calculation clicked:", event);
    },
    isSelected: false,
  },
};
