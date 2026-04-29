# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev               # Start dev server (Chrome)
pnpm dev:firefox       # Start dev server (Firefox)
pnpm build             # Build for Chrome
pnpm build:firefox     # Build for Firefox
pnpm zip               # Build + zip for Chrome release
pnpm zip:firefox       # Build + zip for Firefox release
pnpm compile           # TypeScript type check only
pnpm check             # Biome lint + format (auto-fix)
pnpm ci:check          # Biome check (no auto-fix, for CI)
pnpm storybook         # Run Storybook on port 6006
```

## Architecture

This is a Chrome/Firefox extension built with [WXT](https://wxt.dev/) + React 19 + TypeScript + Tailwind CSS v4. The extension opens a search popup (keyboard shortcut `Cmd+T` / `Ctrl+T`) that lets users search tabs, bookmarks, history, and browser suggestions.

### Entrypoints (`src/entrypoints/`)

- **`popup/`** — The search UI rendered as an extension popup. `App.tsx` renders `<SearchApp onClose={() => window.close()} />`.
- **`sidepanel/`** — Same `SearchApp` rendered as a side panel via `<SearchApp variant="sidepanel" />`. Users can switch between popup and sidepanel via `ViewModeValue` in storage.
- **`options/`** — Extension options page.
- **`background/`** — Service worker. Handles keyboard command (`OPEN_POPUP`) and message routing via `router/command.ts` and `router/message.ts`.

The popup is opened via `chrome.action.openPopup()` in `contentService.open()`. `SWITCH_VIEW_MODE` must call `chrome.action.openPopup()` **synchronously** (before any await) to preserve the user gesture token — see `router/message.ts`.

### Service layer (`src/services/`)

Each service follows a microservice-style pattern: `types.ts` → `helper.ts` → `service.ts` → `index.ts` (re-exports).

| Service | Responsibility |
|---|---|
| `storage` | Wraps `chrome.storage.sync`; currently stores `theme` only |
| `result` | Aggregates Tab/Bookmark/History/Suggestion/Action results in parallel, then fuses with Fuse.js |
| `tab` / `bookmark` / `history` / `suggestion` | Query Chrome APIs and convert to shared `Result<Kind>` type |
| `action` | Calculator action via mathjs |
| `content` | Opens/closes the popup via `chrome.action.openPopup` |
| `runtime` | Typed message passing helpers |

### Feature layer (`src/features/`)

Feature-scoped components and hooks, organized by domain:

- **`search/hooks/useSearch`** — Core search state (query, type filter, debounce, suggestion). Uses `useReducer`.
- **`search/hooks/useSearchResults`** — Fetches results via `chrome.runtime.sendMessage` (`QUERY_RESULT`) with cache + retry.
- **`search/hooks/useSearchKeyboard`** — Arrow key navigation, Enter/Tab/Escape/Backspace handlers.
- **`search/hooks/useSearchShortcut`** — Detects if the registered keyboard shortcut was pressed.
- **`theme/hooks/useTheme`** — Reads/writes theme from storage; syncs across tabs via `chrome.storage.onChanged`. Uses `useSyncExternalStore`.
- **`settings/hooks/useViewMode`** — Reads/writes `viewMode` (`"popup"` | `"sidepanel"`) from storage. Same `useSyncExternalStore` pattern as `useTheme`.

### Shared (`src/shared/`)

- `Layout` — Wraps children in `ThemeProvider`
- `ButtonItem`, `SquareIcon` — Reusable UI primitives

### Storage pattern

Current persisted keys: `theme` (`ThemeValue`) and `viewMode` (`ViewModeValue`).

To add a new persisted setting:
1. Add a key to `SyncStorageKey` enum in `src/services/storage/types.ts`
2. Add the value type to `SyncStorage` interface
3. The generic `storageService.get/set/subscribe` methods work automatically for any `SyncStorageKey`

### Message passing

Background ↔ popup communication uses typed `MessageType` enum (`src/services/runtime/types.ts`). Add new message types there and handle them in `src/entrypoints/background/router/message.ts`.

### i18n

Locales are in `src/locales/{en,ja}.json`. Access via `useTranslation` hook (wraps `@wxt-dev/i18n`).

### Linting / Formatting

Uses [Biome](https://biomejs.dev/) (not ESLint/Prettier). Config is in `biome.json`. Run `pnpm check` to auto-fix.
