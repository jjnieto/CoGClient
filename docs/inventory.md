# Inventory

## Description

Inventory page showing all owned potions, materials, and recipes in a read-only tabbed view. Potion usage happens elsewhere:
- **Vitality potions** — used from the character detail page (restores vitality outside combat)
- **Combat potions** — selected in the quest page before starting a quest (applied during combat)

## Page

### InventoryPage (`src/pages/InventoryPage.tsx`)

- **Route:** `/inventory`
- **Auth required:** Yes
- **API endpoint:** `GET /api/items`

Read-only view with three tabs: Potions, Materials, Recipes. Each tab shows item count. Items display name (resolved from game data), description, and quantity.

### Vitality Potion Usage (CharacterDetailPage)

A "Use Vitality Potion" button appears in the Vitality section of the character detail page when the user owns a Vitality Potion (index 5). Calls `POST /api/characters/:id/use-potion`.

### Combat Potion Selection (QuestsPage)

A "Combat Potion" dropdown in the quest page lets the player select a combat potion (health, attack, defense) to use during the quest. The selected potion index is sent as `potionId` in `POST /api/quests/play`.

## Service

### `src/services/items.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `getInventory(token)` | GET | `/api/items` | Returns potions, materials, recipes grouped |

## Types

### `src/types/item.ts`

| Type | Fields |
|------|--------|
| `InventoryItem` | `index`, `quantity`, `tokenId` |
| `Inventory` | `potions: InventoryItem[]`, `materials: InventoryItem[]`, `recipes: InventoryItem[]` |

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/items.test.ts` | 2 | getInventory with items, empty inventory |
| `src/__tests__/pages/InventoryPage.test.tsx` | 7 | Potions tab, tab counts, materials tab, recipes tab, info text, empty state, loading |

### Run tests

```bash
npm test -- src/__tests__/services/items.test.ts
npm test -- src/__tests__/pages/InventoryPage.test.tsx
```
