# Turn-Based Combat

## Description

Interactive turn-based combat system (Final Fantasy style). The player chooses an action each turn, the server resolves both sides. Accessible from the Quests page via the "Turn-Based" button.

## Page

### CombatPage (`src/pages/CombatPage.tsx`)

- **Route:** `/combat?quest=X&char=Y&level=Z`
- **Auth required:** Yes
- **API endpoints:** `POST /api/combat/start`, `POST /api/combat/action`, `POST /api/combat/auto`, `GET /api/combat/status`

Features:
- Player and enemy HP bars with stats
- Round counter (current / max 10)
- 6 action buttons: Attack, Heavy, Quick, Defend, Potion, Flee
- Potion selector (expands to show available combat potions)
- Auto-Combat button to resolve all remaining turns
- Battle log showing all turn results (newest first)
- Result panel on combat end: Victory/Defeated/Escaped/Time Out with XP, chest, combat %
- Reconnect support via `?reconnect=combatId`
- "Back to Quests" button after combat ends

### QuestsPage — Turn-Based Button

Each quest card now has two buttons:
- **Auto** — classic instant-resolve (`POST /api/quests/play`)
- **Turn-Based** — navigates to `/combat?quest=X&char=Y&level=Z`

## Actions

| Action | Effect |
|--------|--------|
| `attack_normal` | Standard attack (base ATK ±15%) |
| `attack_heavy` | 140% ATK, but -20% DEF this turn |
| `attack_quick` | 70% ATK, but +50% dodge this turn |
| `defend` | 2x DEF, heals 5% max HP, no attack |
| `potion` | Use combat potion (effect persists), no attack |
| `flee` | 30%+ chance to escape, fail = 130% enemy ATK |

## Service

### `src/services/combat.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `startCombat(token, data)` | POST | `/api/combat/start` | Start new combat |
| `submitAction(token, combatId, action, potionIndex?)` | POST | `/api/combat/action` | Submit turn action |
| `autoCombat(token, combatId)` | POST | `/api/combat/auto` | Auto-resolve remaining turns |
| `getCombatStatus(token, combatId)` | GET | `/api/combat/status` | Reconnect to active combat |

## State Management

### `src/stores/combatStore.ts` (Zustand)

Client-side combat state for reactive UI between turns:
- `combatId`, `round`, `maxRounds`
- `player`, `enemy` (HP bars)
- `status`, `availableActions`, `availablePotions`
- `turnLog` (array of all turn results)
- `result` (final combat result)
- Actions: `setCombat`, `addTurn`, `setResult`, `clearCombat`

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/combat.test.ts` | 6 | start, action, action+potion, auto, status, locked error |
| `src/__tests__/stores/combatStore.test.ts` | 4 | initial state, setCombat, addTurn, clearCombat |

### Run tests

```bash
npm test -- src/__tests__/services/combat.test.ts
npm test -- src/__tests__/stores/combatStore.test.ts
```
