---
name: new-hook
description: Creates a custom React hook with TypeScript types, tests, and documentation. Use for API data fetching, game logic, or shared state.
argument-hint: "<hook-name> - e.g. useCharacters or useCombat"
---

# New Hook Skill

You are creating a custom React hook for the Chains of Glory frontend (React + Vite + TanStack Query). Follow every step.

## Input

The user provides the hook name, e.g. `useCharacters` or `useCombat`.

## Steps

### 1. Read the API spec

Read the relevant backend docs to understand what data this hook manages.

### 2. Create TypeScript types

Add interfaces in `src/types/` for the data this hook returns.

### 3. Create the hook

- Place in `src/hooks/{hookName}.ts`
- Use TanStack Query (useQuery/useMutation) for server state
- Use Zustand stores for client-only state if needed
- Return typed data, loading state, error state, and action functions
- Handle API errors gracefully

### 4. Create tests

**Mandatory.** Test the hook using `renderHook` from Testing Library, wrapped in `QueryClientProvider`.

Cover:
- **Initial state** — loading true, data null
- **Successful fetch** — data populated, loading false
- **Error handling** — error state set on API failure
- **Actions** — mutation functions work correctly
- **Re-fetch** — data updates on dependency change

### 5. Create documentation

**Mandatory.** Add to `docs/hooks/{name}.md`:
- Description, return type, usage example, dependencies

### 6. Verify

- Run `npm test` to confirm all tests pass
