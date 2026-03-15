# Store

## Description

Store page where players browse and purchase game items using COG currency. Catalog is grouped by category: Characters, Equipment, Potions, Materials, Recipes.

## Page

### StorePage (`src/pages/StorePage.tsx`)

- **Route:** `/store`
- **Auth required:** Yes
- **API endpoints:** `GET /api/store`, `POST /api/store/purchase`

Displays the store catalog grouped by category. Each item shows name, price, and a Buy button. Characters require a name input. Potions, materials, and recipes allow quantity selection.

After purchase:
- Success message with COG spent and new balance
- Invalidates `['me']` (balance), `['store']` (catalog), and relevant resource queries

## Service

### `src/services/store.ts`

| Function | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| `getCatalog(token)` | GET | `/api/store` | Yes | Returns catalog grouped by category |
| `purchase(token, data)` | POST | `/api/store/purchase` | Yes | Purchase item, returns cogSpent and newBalance |

## Types

### `src/types/store.ts`

| Type | Fields |
|------|--------|
| `StoreItem` | `itemIndex`, `price`, `name` |
| `CogPack` | `amount`, `price` |
| `StoreCatalog` | `characters`, `equipment`, `potions`, `materials`, `recipes`, `cog` |
| `PurchaseRequest` | `class`, `storeIndex`, `amount`, `characterName?` |
| `PurchaseResponse` | `purchased`, `cogSpent`, `newBalance` |

## Store Classes

| Class | Category | Notes |
|-------|----------|-------|
| 0 | Character | Requires `characterName`, amount must be 1 |
| 1 | Equipment | Amount must be 1 |
| 2 | Potion | Amount can be > 1 |
| 3 | Material | Amount can be > 1 |
| 4 | Recipe | Amount can be > 1 |
| 6 | COG | COG packs (real-currency, no COG cost) |

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/store.test.ts` | 3 | getCatalog, purchase success, insufficient COG |
| `src/__tests__/pages/StorePage.test.tsx` | 7 | Catalog render, prices, char name input, purchase success, name validation, insufficient COG, loading |

### Run tests

```bash
npm test -- src/__tests__/services/store.test.ts
npm test -- src/__tests__/pages/StorePage.test.tsx
```
