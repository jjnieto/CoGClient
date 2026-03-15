# CLAUDE.md

## Project Overview

Chains of Glory Client — Frontend for the Chains of Glory RPG game built with React and Vite. Connects to the CoGServer backend API.

## Backend API

The backend API documentation is at `E:/CoGServer/docs/`:

| Document | What it covers |
|----------|----------------|
| `E:/CoGServer/docs/API_REFERENCE.md` | Complete API reference: all 34 routes, status codes, auth flow |
| `E:/CoGServer/docs/QUICKSTART.md` | Step-by-step onboarding with CURL examples |
| `E:/CoGServer/docs/GAME_CONCEPTS.md` | Game mechanics: races, stats, combat, crafting, drops |
| `E:/CoGServer/docs/api/` | Per-endpoint CURL examples and test coverage |
| `E:/CoGServer/docs/design/turn-based-combat.md` | Turn-based combat system design |

**Read these documents before building any feature.** They contain every endpoint, every response format, and every game mechanic.

## Tech Stack

- **Build Tool:** Vite
- **Framework:** React 18
- **Language:** TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Server State:** TanStack Query (React Query) v5
- **Client State:** Zustand
- **Testing:** Vitest + React Testing Library + MSW
- **HTTP Client:** Native fetch (wrapped in API service)

## API Connection

```
Base URL: http://localhost:8000/api
Auth:     Bearer token via Authorization header
Format:   JSON request/response
Errors:   {"error": "message"} with HTTP status codes
```

## Key Game Concepts

- **4 races** (Barbarian, Rogue, Assassin, Dwarf) with different base stats
- **8 stats** computed on the fly: HP, ATK, DEF, DDG, MST, SPD, LCK, FTH
- **Vitality** regenerates at 1pt/sec, max 86400 (24h full recovery)
- **Integer arithmetic only** — all game math uses integer division (Math.trunc)
- **Token IDs** for frontend: potions = index, materials = 10000+index, recipes = 20000+index
- **Two combat systems**: classic (auto-resolve via `/quests/play`) and turn-based (interactive via `/combat/*`)
- **Equipment rarities**: Common (gray), Rare (green), Epic (cyan), Legendary (purple), Mythic (pink)
- **11 gear slots**: head, neck, chest, belt, legs, feet, arms, weapon, off-hand, ring, mount

## Commands

| Action | Command |
|--------|---------|
| Install dependencies | `npm install` |
| Run dev server | `npm run dev` |
| Run tests | `npm test` |
| Run single test | `npm test -- --grep "test name"` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |

## Mandatory Workflow — NEVER skip these steps

Every implementation step (page, component, hook, service, etc.) **MUST** include:

1. **Tests** — Create tests that cover: rendering, user interactions, API integration (mocked), error states, and edge cases. Run `npm test` and confirm they pass before moving on.
2. **Documentation** — Create or update a markdown file in `docs/` with component description, props, usage examples, and screenshots if visual.
3. **Verify** — All existing tests must still pass after your changes.

This is **not optional**. Do not wait for the user to ask. Do not skip documentation because "it's just a small change." Every piece of code ships with its tests and docs in the same commit.

Use the skills in `.claude/skills/` for templates and conventions:
- `/new-page` — Full workflow: page + tests + docs
- `/new-component` — Create component + tests + docs
- `/new-hook` — Create custom hook + tests + docs
- `/add-tests` — Add tests to existing code
- `/add-docs` — Add documentation to existing code

## Code Rules

- All code, tests, and documentation must be written in **English**.
- Use TypeScript strictly — no `any` types unless absolutely necessary.
- API responses must be typed with interfaces matching the backend response formats.
- Use integer arithmetic (Math.trunc for division) when replicating game formulas client-side.
- Handle all API error states gracefully — show user-friendly messages for 400, 401, 402, 403, 404, 423, 429.
- Store auth token in localStorage. Clear on logout.
- Use Zustand stores for client-only global state (auth, active combat).
- Use TanStack Query for all server state (data fetching, caching, mutations).
- Components should be small, focused, and reusable.

## Project Structure

```
src/
  pages/                    # Page components (one per route)
    LoginPage.tsx
    RegisterPage.tsx
    DashboardPage.tsx
    CharactersPage.tsx
    CharacterDetailPage.tsx
    EquipmentPage.tsx
    StorePage.tsx
    QuestsPage.tsx
    CombatPage.tsx
    InventoryPage.tsx
    CraftingPage.tsx
    ChestsPage.tsx
  components/               # Reusable UI components
    layout/                 # Header, ProtectedRoute
    ui/                     # Base UI (buttons, cards, modals, bars)
    game/                   # Game-specific (stat display, gear slots, combat UI)
  hooks/                    # Custom React hooks
  services/                 # API client and service layer
  stores/                   # Zustand stores
  types/                    # TypeScript interfaces for API responses
  lib/                      # Utilities (game math, formatters)
  __tests__/                # Test files mirror src/ structure
docs/                       # Component and page documentation
```
