# Architecture

Chrome/Firefox extension built with [WXT](https://wxt.dev/) + React 19 + TypeScript + Tailwind CSS v4. Opens a search popup (`Cmd+T` / `Ctrl+T`) to search tabs, bookmarks, history, and browser suggestions.

## Entrypoints (`src/entrypoints/`)

- **`popup/`** — Search UI as extension popup. Renders `<SearchApp onClose={() => window.close()} />`.
- **`sidepanel/`** — Same `SearchApp` as a side panel via `<SearchApp variant="sidepanel" />`. Switched via `ViewModeValue` in storage.
- **`background/`** — Service worker. Handles `OPEN_POPUP` command and message routing via `router/command.ts` and `router/message.ts`.

`SWITCH_VIEW_MODE` must call `chrome.action.openPopup()` **synchronously** (before any `await`) to preserve the user gesture token — see `router/message.ts`.

## Feature layer (`src/features/`)

- **`search/hooks/useSearch`** — Core search state (query, type filter, debounce). Uses `useReducer`.
- **`search/hooks/useSearchResults`** — Fetches results via `QUERY_RESULT` message with cache + retry.
- **`search/hooks/useSearchKeyboard`** — Arrow key navigation, Enter/Tab/Escape/Backspace handlers.
- **`search/hooks/useSearchShortcut`** — Detects if the registered keyboard shortcut was pressed.
- **`theme/hooks/useTheme`** — Reads/writes theme from storage via `useSyncExternalStore`.
- **`settings/hooks/useViewMode`** — Reads/writes `viewMode` (`"popup"` | `"sidepanel"`) via `useSyncExternalStore`.

## Shared (`src/shared/`)

Cross-feature resources organized by type:

- **`components/`** — Reusable UI primitives (`Layout`, `ButtonItem`, `SquareIcon`)
- **`hooks/`** — Shared hooks (`useTranslation`)
- **`utils/`** — Pure utility functions (`algorithm.ts` — n-gram similarity)
- **`lib/`** — Library wrappers (`i18n.ts`)

## Storage pattern

Current persisted keys: `theme` (`ThemeValue`) and `viewMode` (`ViewModeValue`).

To add a new persisted setting:
1. Add a key to `SyncStorageKey` enum in `src/services/storage/types.ts`
2. Add the value type to `SyncStorage` interface
3. `storageService.get/set/subscribe` work automatically for any `SyncStorageKey`

## Message passing

Background ↔ popup uses typed `MessageType` enum (`src/services/runtime/types.ts`). Add new message types there and handle in `src/entrypoints/background/router/message.ts`.

## i18n

Locales in `src/locales/{en,ja}.json`. Access via `useTranslation` hook (wraps `@wxt-dev/i18n`).

## Linting / Formatting

[Biome](https://biomejs.dev/) (not ESLint/Prettier). Config in `biome.json`. Run `pnpm check` to auto-fix.
