# Game Data

## Description

Static game data loaded once and cached forever. These endpoints require no authentication and return the same data for all users. Used across the app to resolve names, stats, and definitions for heroes, enemies, equipment, items, etc.

## Service

### `src/services/gamedata.ts`

| Function | Endpoint | Returns |
|----------|----------|---------|
| `fetchHeroes()` | `GET /api/gamedata/heroes` | 4 hero race definitions |
| `fetchEnemies()` | `GET /api/gamedata/enemies` | 9 enemy definitions |
| `fetchQuests()` | `GET /api/gamedata/quests` | 9 quest definitions with drop tables |
| `fetchEquipmentDefs()` | `GET /api/gamedata/equipment` | 26 equipment type definitions |
| `fetchPotions()` | `GET /api/gamedata/potions` | 6 potion definitions |
| `fetchMaterials()` | `GET /api/gamedata/materials` | 27 material definitions |
| `fetchRecipes()` | `GET /api/gamedata/recipes` | 11 recipe definitions |
| `fetchChestDefs()` | `GET /api/gamedata/chests` | 2 chest type definitions |

None of these require authentication.

## Hooks

### `src/hooks/useGameData.ts`

Each hook wraps one service function with TanStack Query using `staleTime: Infinity` and `gcTime: Infinity` so the data is fetched once and never re-fetched.

| Hook | Query Key | Service |
|------|-----------|---------|
| `useHeroes()` | `['gamedata', 'heroes']` | `fetchHeroes` |
| `useEnemies()` | `['gamedata', 'enemies']` | `fetchEnemies` |
| `useQuests()` | `['gamedata', 'quests']` | `fetchQuests` |
| `useEquipmentDefs()` | `['gamedata', 'equipment']` | `fetchEquipmentDefs` |
| `usePotions()` | `['gamedata', 'potions']` | `fetchPotions` |
| `useMaterials()` | `['gamedata', 'materials']` | `fetchMaterials` |
| `useRecipes()` | `['gamedata', 'recipes']` | `fetchRecipes` |
| `useChestDefs()` | `['gamedata', 'chests']` | `fetchChestDefs` |

## Types

### `src/types/gamedata.ts`

| Type | Key fields |
|------|------------|
| `Hero` | `id`, `name`, `stats[8]` (HP, ATK, DEF, DDG, MST, SPD, LCK, FTH) |
| `Enemy` | `id`, `name`, `stats[3]` (HP, ATK, DEF) |
| `Quest` | `id`, `name`, `stats` (nested arrays: enemy, vitality cost, XP, drops) |
| `EquipmentDef` | `id`, `name`, `slot`, `rarity`, `gearset`, `stats[8]` |
| `Potion` | `id`, `name`, `statToBoost[]`, `boost[]` |
| `Material` | `id`, `name`, `ownValue` |
| `Recipe` | `id`, `name`, `classToBurn[]`, `itemToBurn[]`, `amountToBurn[]`, `classToMint[]`, `itemToMint[]`, `amountToMint[]` |
| `ChestDef` | `id`, `name`, `questId` |

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/gamedata.test.ts` | 8 | Each service function calls correct endpoint |
| `src/__tests__/hooks/useGameData.test.tsx` | 4 | Hooks return data, handle loading and errors |

### Run tests

```bash
npm test -- src/__tests__/services/gamedata.test.ts
npm test -- src/__tests__/hooks/useGameData.test.tsx
```
