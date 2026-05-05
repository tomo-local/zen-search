# Service Layer Design

## Overview

The service layer in zen-search follows a layered architecture adapted pragmatically for a browser extension environment. Services are grouped into three layers based on their responsibility.

## Service Layers

### Application Services

Orchestrate multiple infrastructure services to fulfill a single use case.

| Service | Responsibility |
| --- | --- |
| `result` | Aggregates results from all source services in parallel, applies fuzzy search, and returns a unified result list |

### Domain Services

Encapsulate pure business logic with no dependency on Chrome APIs or external systems.

| Service | Responsibility |
| --- | --- |
| `action` | Detect and evaluate mathematical expressions via mathjs. Currently handles only calculation, but is designed to grow into an orchestrator (similar to `result`) as more action types are added. |

### Infrastructure Services

Wrap Chrome APIs or external systems and expose them as typed interfaces. These services have no business logic of their own — they translate between Chrome's types and the app's domain types.

| Service | Responsibility |
| --- | --- |
| `tab` | Wrap `chrome.tabs` — query, create, activate, and remove browser tabs |
| `bookmark` | Wrap `chrome.bookmarks` — search bookmarks and retrieve recent bookmarks |
| `history` | Wrap `chrome.history` — search browser history with optional time-range filtering |
| `suggestion` | Wrap external search suggestion APIs — fetch and deduplicate suggestions across engines |
| `storage` | Wrap `chrome.storage.sync` — persist and subscribe to user preferences |
| `content` | Wrap `chrome.action` — open and close the extension popup or side panel |
| `runtime` | Typed IPC bridge between UI and the background service worker via `chrome.runtime` |

## Data Flow

### Read (search)

```
UI
 └─ runtimeService.queryResults()
      └─ sendMessage(QUERY_RESULT)
           └─ background router        ← Application layer
                └─ resultService       ← Orchestrates in parallel
                     ├─ tabService.query()
                     ├─ bookmarkService.query()
                     ├─ historyService.query()
                     ├─ suggestionService.query()
                     └─ actionService.calculate()
```

### Write (tab operations)

```
UI
 └─ runtimeService.createTab()
      └─ sendMessage(CREATE_TAB)
           └─ background router        ← Application layer
                └─ tabService.create() ← Infrastructure (direct call, no orchestration needed)
```

Write operations are called directly from the background router because each write maps 1:1 to a single Chrome API call — no orchestration is required.

## Access Rules

### Intended Architecture

UI contexts (popup, sidepanel, features) must reference **only the `runtime` service** at runtime. All service logic runs exclusively inside the background service worker.

```
[UI: popup / sidepanel / features]
        │
        │  runtime service only
        ▼
[runtime service] ──(chrome.runtime.sendMessage)──▶ [background]
                                                           │
                                         ┌─────────────────┼──────────────────┐
                                         ▼                 ▼                  ▼
                                     content           storage     result / tab / bookmark
                                                                   history / suggestion / action
```

Type-only imports (`import type { ... }`) from any service are permitted in UI code — they are erased at build time and carry no runtime dependency.

### Current State

The codebase is migrating toward the intended architecture. The following deviations remain:

| Service | Used from UI | Note |
| --- | --- | --- |
| `runtime` | ✅ correct | Called from `useControlTab`, `useSearchResults` |
| `storage` | ⚠️ deviation | Called directly from `useTheme`, `useViewMode` |
| `content` | ⚠️ deviation | Called directly from `popup/main.tsx` |
| others | ✅ type-only | `result`, `tab`, `bookmark`, `history`, `suggestion`, `action` |

When modifying `useTheme`, `useViewMode`, or `popup/main.tsx`, do not add further direct service calls — route through `runtime` instead.

## Internal Structure

Each service follows a consistent file structure:

```
src/services/<name>/
  index.ts      # Public API — re-exports from service.ts and types.ts only
  service.ts    # Service implementation and exported singleton
  interface.ts  # Service interface (contract)
  types.ts      # Request/response types and domain types
  helper.ts     # Pure utility functions (no side effects) — internal only
  converter.ts  # Chrome API type → domain type conversion — internal only
  internal.ts   # Error class and logger instance — internal only
  container.ts  # Dependency injection (present only when cross-service deps exist) — internal only
```

## Public API Contract

**Only files listed in `index.ts` may be imported from outside the service.**

`index.ts` re-exports only from `service.ts` and `types.ts`:

```typescript
// ✅ Correct — index.ts
export * from "./service";
export * from "./types";

// ❌ Wrong — never re-export internal files
export * from "./helper";
export * from "./converter";
export * from "./internal";
export * from "./container";
```

External code must import exclusively through the service index:

```typescript
// ✅ Correct — import through index
import { tabService } from "@/services/tab";
import type { Tab } from "@/services/tab";

// ❌ Wrong — direct import of internal files
import { fuseFilter } from "@/services/tab/helper";
import { TabServiceError } from "@/services/tab/internal";
import { toTab } from "@/services/tab/converter";
```

`helper.ts`, `converter.ts`, `internal.ts`, and `container.ts` are implementation details of the service and must never be accessed from outside their own service directory.

## Design Notes

### Why are tab/bookmark/history classified as Infrastructure?

These services are thin wrappers around Chrome APIs. They translate Chrome's raw types (`chrome.tabs.Tab`, `chrome.bookmarks.BookmarkTreeNode`, etc.) into the app's domain types, but contain no business logic. The routing decisions (when to call them, how to combine results) live in the `result` service or the background router.

### Why does result sit above tab/bookmark/history?

`result` is the only service that needs to coordinate multiple sources. It runs queries in parallel via `Promise.allSettled`, merges the results, and applies fuzzy search — all of which are application-level concerns rather than Chrome API concerns.

### Future direction for action

Currently `action` contains only calculation logic and is classified as a Domain Service. As more action types are added (e.g., unit conversion, URL utilities), `action` is expected to evolve into an Application Service — an orchestrator that coordinates multiple action handlers, similar to how `result` coordinates multiple source services. Each handler will remain a pure function where possible; handlers requiring external APIs will be treated as Infrastructure.

```
src/services/action/         ← future structure
  service.ts                 ← orchestrator (like result)
  types.ts
  handlers/
    calculation.ts           ← current logic (pure domain)
    conversion.ts            ← future (unit / currency)
    ...
```

### Why runtime-only access from UI?

The background service worker is the only context with stable, long-lived access to Chrome APIs. Routing all service calls through the background avoids timing issues with the service worker lifecycle and keeps UI code free of Chrome API dependencies.

### Tradeoffs

- `storage` is currently accessed directly from UI hooks (`useTheme`, `useViewMode`) because `chrome.storage.onChanged` subscriptions need to run in the UI context for reactive state updates. This will be resolved as the migration progresses.
- `converter.ts` acts as a factory in layered architecture terms, but is kept as a file of pure functions for pragmatic simplicity.
