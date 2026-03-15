---
name: add-tests
description: Adds or expands tests for an existing page, component, or hook. Use when code exists but lacks tests or needs more coverage.
argument-hint: "<target> - e.g. CharacterCard or useInventory"
---

# Add Tests Skill

You are adding tests for existing frontend code (React + Vite + Vitest). Follow every step.

## Steps

1. Read the source code to understand what it does
2. Check for existing test files
3. Create or extend tests covering:
   - **Rendering** — correct output with various props/states
   - **Interactions** — clicks, inputs, form submissions
   - **API calls** — mocked with MSW or vi.mock, verify correct params
   - **Error states** — API failures, empty data
   - **Edge cases** — boundary values, null data
4. Run `npm test` and confirm all pass
5. Update documentation with test coverage table

## Rules

- Use Vitest + React Testing Library
- Wrap components in `QueryClientProvider` and `MemoryRouter` when needed
- Mock API calls and Zustand stores
- Test behavior, not implementation details
- All tests in **English**
- Use relative imports
