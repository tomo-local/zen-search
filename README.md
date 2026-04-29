# Zen Search

[日本語版はこちら](docs/README-ja.md)

Zen Search is a lightweight and intuitive Chrome/Firefox extension built with [WXT](https://wxt.dev/) + React 19 + TypeScript + Tailwind CSS v4. It opens a search popup (`Cmd+T` / `Ctrl+T`) that lets you search tabs, bookmarks, history, and browser suggestions — all from one place.

## Features

- **Unified Search**: Search across tabs, bookmarks, history, and browser suggestions in a single popup.
- **Keyboard Shortcuts**: Navigate results and perform actions using arrow keys, Enter, and more.
- **Lightweight and Fast**: Minimal resource usage ensures smooth performance.
- **Modern Design**: Built with Tailwind CSS v4 for a sleek and responsive interface.

## Architecture

### Directory Structure

```
src/
  entrypoints/    # Extension entry points
    popup/        # Search UI (main.tsx bootstraps React, App.tsx wires hooks)
    background/   # Service worker (command & message routing)
  features/       # Feature-scoped components and hooks by domain
    search/       # Search state, results, keyboard navigation, shortcuts
    theme/        # Theme management (useTheme, ThemeProvider)
    tab/          # Tab-related components and hooks
    bookmark/     # Bookmark-related components
    history/      # History-related components
    suggestion/   # Suggestion-related components
    action/       # Action components (e.g., calculator)
  services/       # Business logic and Chrome extension APIs
    result/       # Aggregates results in parallel, fuses with Fuse.js
    tab/          # Queries chrome.tabs API
    bookmark/     # Queries chrome.bookmarks API
    history/      # Queries chrome.history API
    suggestion/   # Queries chrome.omnibox / search suggestions
    action/       # Calculator action via mathjs
    storage/      # Wraps chrome.storage.sync
    content/      # Opens/closes the popup via chrome.action.openPopup
    runtime/      # Typed message passing helpers
  shared/         # Reusable UI primitives (Layout, ButtonItem, SquareIcon)
  lib/            # Library wrappers (i18n)
  locales/        # Locale files (en.json, ja.json)
  utils/          # Shared helper and algorithm functions
  assets/         # Global styles
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/zen-search.git
   cd zen-search
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Load the extension in your browser and enjoy Zen Search!

## Roadmap

TBD

## License

This project is licensed under the MIT License.
