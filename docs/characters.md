# Characters

## Description

Character listing and detail pages. Shows all characters owned by the player with computed stats, real-time vitality bar, XP progress, gear slots, and level-up functionality.

## Pages

### CharactersPage (`src/pages/CharactersPage.tsx`)

- **Route:** `/characters`
- **Auth required:** Yes
- **API endpoint:** `GET /api/characters`

Grid of character cards. Each card shows: name, race, level, HP/ATK/DEF/DDG stats, vitality bar (updates every second), and time lock status. Clicking a card navigates to the detail page. Empty state links to the Store.

### CharacterDetailPage (`src/pages/CharacterDetailPage.tsx`)

- **Route:** `/characters/:id`
- **Auth required:** Yes
- **API endpoints:** `GET /api/characters/:id`, `POST /api/characters/:id/level-up`

Full character view with:
- All 8 stats (HP, ATK, DEF, DDG, MST, SPD, LCK, FTH)
- Vitality bar (real-time, updates every second)
- XP bar with progress toward next level
- Level Up button (shown when XP is sufficient, disabled when locked)
- 11 gear slots showing equipped item IDs

## Service

### `src/services/characters.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `listCharacters(token)` | GET | `/api/characters` | List all user's characters |
| `getCharacter(token, id)` | GET | `/api/characters/:id` | Get single character |
| `levelUp(token, id)` | POST | `/api/characters/:id/level-up` | Level up if enough XP |
| `usePotion(token, id, potionIndex)` | POST | `/api/characters/:id/use-potion` | Use vitality potion |
| `equipGear(token, id, gear)` | PUT | `/api/characters/:id/equip` | Set 11-slot gear array |

## Utility Libraries

### `src/lib/vitality.ts`

- `computeCurrentVitality(stored, lastUpdate, now?)` — Computes real-time vitality (1pt/sec regen, capped at 86400)
- `formatVitality(vitality)` — Formats as `Xh Xm Xs`

### `src/lib/stats.ts`

- `computeCharacterStat(baseStat, level)` — Applies character upgrade matrix with `Math.trunc`
- `computeEquipmentStat(baseStat, level)` — Applies equipment upgrade matrix
- `xpForNextLevel(level)` — Returns XP needed or null if max level
- Constants: `STAT_NAMES`, `RACE_NAMES`, `SLOT_NAMES`

## Hooks

### `src/hooks/useVitality.ts`

Returns current vitality, updated every second via `setInterval`.

### `src/hooks/useTimeLock.ts`

Returns `{ secondsRemaining, isLocked }`, updated every second. Clears interval when lock expires.

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/characters.test.ts` | 5 | list, get, levelUp, usePotion, equipGear |
| `src/__tests__/lib/vitality.test.ts` | 6 | Vitality computation, capping, formatting |
| `src/__tests__/lib/stats.test.ts` | 7 | Stat computation, integer division, XP thresholds |
| `src/__tests__/pages/CharactersPage.test.tsx` | 4 | List render, stats, empty state, loading |

### Run tests

```bash
npm test -- src/__tests__/services/characters.test.ts
npm test -- src/__tests__/lib/vitality.test.ts
npm test -- src/__tests__/lib/stats.test.ts
npm test -- src/__tests__/pages/CharactersPage.test.tsx
```
