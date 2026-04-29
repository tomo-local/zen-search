# CLAUDE.md

Chrome/Firefox extension: WXT + React 19 + TypeScript + Tailwind CSS v4.

## Commands

```bash
pnpm dev       # Start dev server (Chrome)
pnpm check     # Biome lint + format (auto-fix)
pnpm compile   # TypeScript type check
pnpm build     # Build for Chrome
```

→ Full command list: `.claude/rules/commands.md`

## Critical Constraints

- `chrome.action.openPopup()` must be called **synchronously** (before any `await`) to preserve the user gesture token — see `router/message.ts`
- UI must only call `runtimeService` at runtime — all other services are background-only

## Rules

@.claude/rules/readme-sync.md
@.claude/rules/code-generation-service.md
