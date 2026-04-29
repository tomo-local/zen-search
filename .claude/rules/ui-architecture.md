# UI Architecture

## Design Philosophy

- **External libraries are avoided** — UI logic is implemented with React standard APIs only (no Zustand, React Query, etc.)
- **Feature-based structure** — migrated from presentation/container pattern; all UI is organized under `src/features/`
- **Two-layer separation within each feature** — UI layer (components) and props-creation layer (hooks) are kept distinct

---

## Directory Structure

```
src/
├── features/          # Feature-scoped UI, one folder per domain
│   └── [feature]/
│       ├── components/    # UI layer — receives props, renders only
│       └── hooks/         # Props-creation layer — logic, state, side effects
├── shared/
│   ├── components/    # Reusable primitives used across features
│   └── hooks/         # Reusable hooks used across features
```

---

## Two-Layer Separation Rule

**Components (UI layer)**
- Receive all data and callbacks as props
- Contain no business logic, no service calls, no state beyond local UI state
- Use `useMemo` for derived rendering values (icons, content slots)
- Composed from shared primitives (`ButtonItem`, `SquareIcon`, etc.)

**Hooks (props-creation layer)**
- Prepare props that components receive
- Own all state, side effects, and service interactions
- Return plain values and callbacks — no JSX

```typescript
// ✅ Hook prepares props
const { results, loading } = useSearchResults({ query, categories });

// ✅ Component receives props and renders
<ResultList items={results} loading={loading} />

// ❌ Component calls service directly
const ResultList = () => {
  const results = await runtimeService.queryResults(...); // wrong
};
```

---

## Component Conventions

### File structure

```
src/features/[feature]/components/[ComponentName]/
  [ComponentName].tsx        # Component + Props type
  [ComponentName].stories.tsx  # Storybook story
```

### Props type

```typescript
// Props type is defined in the same file as the component
export type BookmarkItemProps = Pick<ButtonItemProps, "onClick" | "selected"> & {
  item: {
    data: Pick<Bookmark["data"], "id" | "title" | "url" | "favIconUrl">;
  };
};
```

- Item components extend `ButtonItemProps` via `Pick` — only expose `onClick` and `selected`
- `item.data` is typed with `Pick` to expose only the fields the component actually uses

### Composition with ButtonItem

All list item components (`TabItem`, `BookmarkItem`, `HistoryItem`, etc.) compose `ButtonItem` using its `LeftContent` / `RightContent` slots:

```typescript
const BookmarkItem: React.FC<BookmarkItemProps> = ({ onClick, selected, item }) => {
  const LeftIcon = useMemo(() => (
    <SquareIcon>
      {item.data.favIconUrl ? <img src={item.data.favIconUrl} /> : <BookmarkIcon />}
    </SquareIcon>
  ), [item.data.favIconUrl]);

  return (
    <ButtonItem
      onClick={onClick}
      selected={selected}
      LeftContent={LeftIcon}
    >
      <div>{item.data.title || item.data.url}</div>
    </ButtonItem>
  );
};
```

---

## Hook Conventions

### Simple hook (single file)

Use a single file when the hook has minimal logic:

```
src/features/[feature]/hooks/useXxx.ts
```

### Complex hook (folder)

Use a folder when the hook needs types, constants, helpers, or a reducer:

```
src/features/[feature]/hooks/useXxx/
  index.ts       # Re-exports hook as default
  hook.ts        # Main hook implementation
  types.ts       # TypeScript types
  constants.ts   # Constants and defaults
  helper.ts      # Pure utility functions (no side effects)
  reducer.ts     # useReducer reducer (if needed)
```

### Hook return shape

Return a flat object — not a tuple, not nested objects:

```typescript
// ✅
return { query, setQuery, reset, isComposing, setIsComposing };

// ❌
return [query, { setQuery, reset }];
```

---

## Shared Components

`src/shared/components/` contains primitives reused across features:

| Component | Role |
|---|---|
| `ButtonItem` | Base list item with `LeftContent` / `RightContent` slots |
| `SquareIcon` | Rounded icon container |
| `Layout` | App root wrapper — applies `ThemeProvider` and base styles |

`defaultClassName` exported from `ButtonItem` is the source of truth for all item styling (bg, border, hover, selected states). Feature components reference these rather than duplicating Tailwind classes.

---

## Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Feature folder | lowercase | `features/bookmark/` |
| Component folder | PascalCase | `components/BookmarkItem/` |
| Component file | PascalCase | `BookmarkItem.tsx` |
| Props type | `[Component]Props` | `BookmarkItemProps` |
| Hook file / folder | camelCase | `useControlTab.ts` / `useSearch/` |
| Hook export | `export default function` | `export default function useSearch()` |
| Context | `[Name]Provider` | `ThemeProvider` |

---

## State Management

React standard APIs only — no external state libraries:

| Pattern | When to use |
|---|---|
| `useState` | Local UI state (open/closed, input value) |
| `useReducer` | Complex state with multiple actions (see `useSearch/reducer.ts`) |
| `useSyncExternalStore` | State backed by Chrome Storage or other external store |
| `useRef` | Mutable values that don't trigger re-renders (cache, request ID) |
| `useContext` | Theme — passed through `ThemeProvider` |

### `useSyncExternalStore` pattern

Used for Chrome Storage-backed state (`useTheme`, `useViewMode`). Key constraint: `getSnapshot` must return the same reference when state has not changed.

```typescript
let snapshot: ThemeSnapshot = buildSnapshot(getDefaultTheme());

// ✅ Update snapshot reference only when value actually changes
const updateSnapshot = (theme: ThemeValue) => {
  const next = buildSnapshot(theme);
  if (snapshot.theme === next.theme) return; // skip if unchanged
  snapshot = next;
  listeners.forEach((l) => l());
};

const getSnapshot = () => snapshot; // returns stable reference
```

---

## Code Generation

When creating a new component, use the generation script:

```bash
cd scripts && go run main.go gen component
```

Do not create component files manually.
