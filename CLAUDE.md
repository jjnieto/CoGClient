# CLAUDE.md

## Project Overview

Chains of Glory Client — Frontend for the Chains of Glory RPG game. Connects to the CoGServer backend API.

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
- **Integer arithmetic only** — all game math uses integer division
- **Token IDs** for frontend: potions = index, materials = 10000+index, recipes = 20000+index
- **Two combat systems**: classic (auto-resolve via `/quests/play`) and turn-based (interactive via `/combat/*`)

## Mandatory Workflow

Every implementation step **MUST** include:

1. **Tests** — Create tests that cover the implemented functionality
2. **Documentation** — Update or create relevant documentation
3. **Verify** — All existing tests must still pass after changes

## Commands

Commands depend on the chosen stack. Update this section once the framework is selected.

| Action | Description |
|--------|-------------|
| Install dependencies | Install all project dependencies |
| Run dev server | Start the development server |
| Run tests | Execute the full test suite |
| Build | Create production build |
