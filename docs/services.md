# Service Layer Design

## Overview

The service layer in zen-search is organized around Domain-Driven Design (DDD) principles, adapted pragmatically for a browser extension environment. Services are grouped into three layers based on their responsibility.

## Service Layers

### Application Services

Coordinate multiple domain services to fulfill a single use case.

| Service | Responsibility |
| --- | --- |
| `result` | Aggregates results from all source services in parallel, applies fuzzy search, and returns a unified result list |

### Domain Services

Encapsulate domain logic and own the data model for a single domain concept.

| Service | Responsibility |
| --- | --- |
| `tab` | Query, create, activate, and remove browser tabs |
| `bookmark` | Search bookmarks and retrieve recent bookmarks |
| `history` | Search browser history with optional time-range filtering |
| `suggestion` | Fetch search suggestions from Google Suggest API |
| `action` | Detect and evaluate mathematical expressions |

### Infrastructure Services

Abstract external systems and cross-cutting concerns away from domain logic.

| Service | Responsibility |
| --- | --- |
| `storage` | Persist and subscribe to user preferences via `chrome.storage.sync` |
| `content` | Open and close the extension popup or side panel |
| `runtime` | Typed IPC bridge between UI and the background service worker |

## Access Rules

### Intended Architecture

UI contexts (popup, sidepanel, features) must reference **only the `runtime` service** at runtime. All domain and infrastructure logic runs exclusively inside the background service worker.

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
  types.ts      # Interfaces, enums, and request/response types
  service.ts    # Public service implementation
  helper.ts     # Pure utility functions (no side effects)
  converter.ts  # Data transformation from Chrome API types to domain types (where needed)
  index.ts      # Re-exports public API
```

## Design Notes

### Why DDD?

Each domain concept (tab, bookmark, history, suggestion, action) is owned by exactly one service. This prevents logic from spreading across files and makes it straightforward to find, change, or replace an individual domain's behavior.

### Why runtime-only access from UI?

The background service worker is the only context that has stable, long-lived access to Chrome APIs. Routing all service calls through the background avoids timing issues with the service worker lifecycle and keeps UI code free of Chrome API dependencies.

### Tradeoffs

- `storage` is currently accessed directly from UI hooks (`useTheme`, `useViewMode`) because `chrome.storage.onChanged` subscriptions need to run in the UI context for reactive state updates. This will be resolved as the migration progresses.
- `converter.ts` acts as a factory or value-object transformer in DDD terms, but is kept as a simple file of pure functions for pragmatic simplicity.
