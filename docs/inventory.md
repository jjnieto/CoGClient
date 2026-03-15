# Inventory

## Description

Inventory page showing all owned potions, materials, and recipes in tabbed view. Players can use vitality potions on characters directly from this page.

## Page

### InventoryPage (`src/pages/InventoryPage.tsx`)

- **Route:** `/inventory`
- **Auth required:** Yes
- **API endpoints:** `GET /api/items`, `POST /api/characters/:id/use-potion`

Features:
- Three tabs: Potions, Materials, Recipes (with item counts)
- Items show name (resolved from game data), description, and quantity
- Vitality potions (index 5) have a "Use on character" button
- Character selector dropdown for potion usage
- Names resolved via `usePotions()`, `useMaterials()`, `useRecipes()` hooks from game data

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
| `src/__tests__/pages/InventoryPage.test.tsx` | 7 | Potions tab, tab counts, materials tab, recipes tab, vitality use button, empty state, loading |

### Run tests

```bash
npm test -- src/__tests__/services/items.test.ts
npm test -- src/__tests__/pages/InventoryPage.test.tsx
```
