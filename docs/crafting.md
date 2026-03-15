# Crafting

## Description

Crafting page where players use owned recipes and materials to create new items. Shows owned recipes with ingredient requirements, quantities available, output preview, and a craft button.

## Page

### CraftingPage (`src/pages/CraftingPage.tsx`)

- **Route:** `/crafting`
- **Auth required:** Yes
- **API endpoints:** `GET /api/items`, `POST /api/crafting/craft`

Features:
- Lists only recipes the user owns (from inventory)
- Each recipe card shows: name, description, ingredients with required vs owned quantities
- Ingredients are color-coded: white if sufficient, red if insufficient
- Output section shows what will be created
- Craft button: enabled when all materials available, disabled ("Missing materials") otherwise
- Result panel: shows consumed items (red) and created items (green)
- Query invalidation after craft: items, equipment

## Service

### `src/services/crafting.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `craft(token, recipeIndex)` | POST | `/api/crafting/craft` | Execute recipe, burns ingredients, creates output |

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/crafting.test.ts` | 3 | craft success, recipe not owned, insufficient materials |
| `src/__tests__/pages/CraftingPage.test.tsx` | 8 | Ingredients, quantities, output, enabled/disabled button, craft result, empty state, loading |

### Run tests

```bash
npm test -- src/__tests__/services/crafting.test.ts
npm test -- src/__tests__/pages/CraftingPage.test.tsx
```
