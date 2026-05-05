# Service Architecture

## Service Access Architecture

### Intended Architecture (migration target)

UI (popup / sidepanel / features) must reference **only the `runtime` service**. All other services must be called exclusively from the background service worker.

```
[UI: popup / sidepanel / features]
        │
        │ only runtime service
        ▼
[runtime service]  ──(chrome.runtime.sendMessage)──▶  [background]
                                                            │
                                          ┌─────────────────┼──────────────────┐
                                          ▼                 ▼                  ▼
                                      content           storage     result / tab / bookmark
                                                                    history / suggestion / action
```

- **Type-only imports** (`import type { ... }`) from any service are allowed in UI — they are erased at build time and carry no runtime dependency.
- **Runtime calls** (instantiating or calling service methods) must not appear in UI code except via `runtimeService`.

### Current State (as of 2026-04)

The codebase has not yet fully migrated. The following deviations exist and will be resolved incrementally:

| Service   | Used from UI | Note                                                                                 |
| --------- | ------------ | ------------------------------------------------------------------------------------ |
| `runtime` | ✅ correct   | `runtimeService` in `useControlTab`, `useSearchResults`                              |
| `storage` | ⚠️ deviation | `storageService` called directly in `useTheme`, `useViewMode`                        |
| `content` | ⚠️ deviation | `contentService` called directly in `popup/main.tsx`                                 |
| others    | ✅ type-only | `result`, `tab`, `bookmark`, `history`, `suggestion`, `action` are type imports only |

When touching `useTheme`, `useViewMode`, or `popup/main.tsx`, do not add further direct service calls — route through `runtime` instead.

---

## Service Layers

Services in `src/services/` fall into three layers:

| Layer | Services | Characteristics |
| --- | --- | --- |
| **Application** | `result`, `action` (future) | Orchestrate multiple services; no direct Chrome API calls |
| **Infrastructure** | `tab`, `bookmark`, `history`, `suggestion`, `storage`, `content`, `runtime` | Wrap Chrome APIs or external systems; no business logic |
| **Domain** | `action` (current) | Pure logic; no Chrome API or network dependency |

`action` is currently a Domain service (pure mathjs logic). As more action types are added, it will evolve into an Application service with sub-handlers, similar to `result`.

## Service Roles

Each service in `src/services/` has a single, well-defined responsibility. Follow the patterns below when implementing or extending services.

### result

**Role:** Application orchestrator. Aggregates results from all source services in parallel and applies fuzzy search.

- Calls Tab / Bookmark / History / Suggestion / Action in parallel via `Promise.allSettled()`
- Distributes the requested count evenly across services
- Prepends Action (calculation) results at the top
- Applies Fuse.js fuzzy search (threshold: 0.4) over title + url fields
- Do not add Chrome API calls here — delegate to source services

### tab

**Role:** Manage browser tabs (query, create, activate, remove).

- Wraps `chrome.tabs` and `chrome.windows` APIs
- Sorts results by `lastAccessed` descending (most recent first)
- Filters by keyword using AND-logic regex matching against title and URL
- Converts `chrome.tabs.Tab` → `Tab` via `converter.ts`

### bookmark

**Role:** Search and retrieve browser bookmarks.

- Wraps `chrome.bookmarks` APIs
- Recursively flattens the bookmark tree to extract URL-only nodes (excludes folders)
- Returns recent bookmarks (via `getRecent`) when no query is provided
- Attaches favicon via Google Favicon API: `https://www.google.com/s2/favicons?domain={origin}`

### history

**Role:** Search browser history.

- Wraps `chrome.history.search`
- Default max results: 100 items
- Supports time range filtering (`startTime` / `endTime`)
- Attaches favicon using the same Google Favicon strategy as bookmark

### suggestion

**Role:** Fetch search suggestions from Google Suggest API.

- Calls `https://www.google.com/complete/search?client=chrome&q={query}`
- Parses JSONP response and normalizes to `Suggestion[]`
- Always prepends the original query as the first suggestion
- Returns empty array if query is blank; falls back to original query on fetch failure

### action

**Role:** Detect and evaluate actions. Currently handles only mathematical expressions, but is designed to grow into an orchestrator (similar to `result`) as more action types are added.

- Uses `mathjs` to evaluate expressions matching `/[0-9]+(\s*[+\-*/]\s*[0-9]+)+/`
- Returns a single `Action<"Action.Calculation">` item with the result formatted as `"expr = result"`
- Result URL links to `https://www.google.com/search?q={expr}` for click-through
- Currently the only action kind is `Action.Calculation`
- **Future:** each action type will be extracted to `handlers/` (e.g., `handlers/calculation.ts`, `handlers/conversion.ts`); `service.ts` will become an orchestrator

### content

**Role:** Open and close the extension popup or sidepanel.

- Calls `chrome.action.openPopup()` to open the popup
- Calls `window.close()` to close the popup
- `chrome.action.openPopup()` **must be called synchronously** (before any `await`) to preserve the user gesture token

### storage

**Role:** Persist user preferences to `chrome.storage.sync`.

- Wraps Chrome storage callbacks in Promises
- Current keys: `theme` (`"light" | "dark" | "system"`) and `viewMode` (`"popup" | "sidepanel"`)
- Provides a `subscribe(key, callback)` pattern that returns an unsubscribe function
- To add a new key: add to `SyncStorageKey` enum and `SyncStorage` interface in `types.ts`

### runtime

**Role:** IPC bridge between popup/sidepanel and the background service worker.

- Sends typed messages via `chrome.runtime.sendMessage` using `MessageType` enum
- Wraps errors in `RuntimeServiceError`
- Falls back to `contentService` methods if message delivery fails
- Add new message types to `MessageType` in `types.ts`, then handle in `background/router/message.ts`
