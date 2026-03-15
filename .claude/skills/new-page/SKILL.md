---
name: new-page
description: Creates a new page with route, component, tests, and documentation. Use when implementing a new game screen or view.
argument-hint: "<page-name> - e.g. characters or quest-combat"
---

# New Page Skill

You are creating a new page for the Chains of Glory frontend (React + Vite + React Router). Follow every step below in order. Do not skip any step.

## Input

The user provides the page name, e.g. `characters` or `quest-combat`.

## Steps

### 1. Read the backend API spec

Before writing any code, read the relevant backend documentation:
- `E:/CoGServer/docs/API_REFERENCE.md` — routes and response formats
- `E:/CoGServer/docs/GAME_CONCEPTS.md` — game mechanics this page displays
- `E:/CoGServer/docs/api/{resource}.md` — detailed endpoint docs

### 2. Create TypeScript types

- Add or update interfaces in `src/types/` for the API responses this page uses
- Match field names exactly with the backend response format (camelCase)

### 3. Create or update API service

- Add fetch functions in `src/services/` for the endpoints this page calls
- Use the auth token from the Zustand store
- Handle all error status codes (400, 401, 402, 403, 404, 423, 429)

### 4. Create the page component

- Place in `src/pages/{PageName}Page.tsx`
- Follow the template in `templates/page.md`
- Use Tailwind CSS for styling
- Use TanStack Query for data fetching (useQuery / useMutation)
- Use Zustand stores for client-only global state
- Handle loading, error, and empty states

### 5. Add route

- Register the route in `src/routes.tsx`
- Wrap with `<ProtectedRoute>` if the page requires authentication

### 6. Create sub-components

- Break the page into focused, reusable components in `src/components/`
- Each component should have clear props with TypeScript interfaces

### 7. Create tests

This step is **mandatory**. Every page must have tests.

- Create test file in `src/__tests__/` mirroring the page path
- Follow the template in `templates/test.md`
- Cover at minimum:
  - **Renders correctly** with mock data
  - **Loading state** shows spinner/skeleton
  - **Error state** shows error message
  - **Empty state** shows appropriate message
  - **User interactions** (clicks, form submissions)
  - **API calls** are made with correct parameters (mocked)
- Run tests and confirm they pass

### 8. Create documentation

This step is **mandatory**. Every page must be documented.

- Create a markdown file in `docs/{page-name}.md`
- Include: page description, screenshots placeholder, component breakdown, API endpoints used, state management, testing instructions

### 9. Verify

- Run `npm test` to confirm all tests pass
- Run `npm run build` to confirm no TypeScript errors

## Rules

- All output (code, tests, docs) must be in **English**
- Use TypeScript strictly — no `any`
- Use Tailwind CSS for all styling
- Use TanStack Query for server state, Zustand for client state
- Handle all API error states with user-friendly messages
- Use integer arithmetic (Math.trunc) for any game formula calculations
