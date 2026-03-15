# Chests

## Description

Chest listing and opening page. Chests are earned from quests and contain loot (equipment, items, COG). Some chests have a time lock that must expire before opening. Opening a chest may yield drops or be empty depending on the combat percentage.

## Page

### ChestsPage (`src/pages/ChestsPage.tsx`)

- **Route:** `/chests`
- **Auth required:** Yes
- **API endpoints:** `GET /api/chests`, `POST /api/chests/:id/open`

Features:
- Grid of chest cards showing: ID, quest index, quest level, combat percentage
- Time lock countdown (updates every second, disables open button)
- Open button triggers loot roll
- Loot display: list of drops with class name and amount
- Empty chest message when no drops
- Query invalidation after open: chests, equipment, items, characters, me (balance)

## Service

### `src/services/chests.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `listChests(token)` | GET | `/api/chests` | List all user's chests |
| `openChest(token, id)` | POST | `/api/chests/:id/open` | Open chest, returns drops |

## Types

### `src/types/chest.ts`

| Type | Key fields |
|------|------------|
| `Chest` | `id`, `questIndex`, `questLevel`, `percentage`, `heroId`, `timeLock`, `hits[]` |
| `ChestDrop` | `class`, `index`, `amount` |
| `OpenChestResponse` | `drops: ChestDrop[]` |

## Drop Classes

| Class | Type |
|-------|------|
| 0 | Character |
| 1 | Equipment |
| 2 | Potion |
| 3 | Material |
| 4 | Recipe |
| 255 | COG |

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/chests.test.ts` | 3 | list, open with drops, locked chest |
| `src/__tests__/pages/ChestsPage.test.tsx` | 7 | List render, open button, locked countdown, open with loot, empty chest, empty state, loading |

### Run tests

```bash
npm test -- src/__tests__/services/chests.test.ts
npm test -- src/__tests__/pages/ChestsPage.test.tsx
```
