# Equipment

## Description

Equipment listing page and equip UI integrated into the character detail page. Players can view all owned gear, see stats with rarity colors, upgrade equipment, and equip/unequip items on characters via slot dropdowns.

## Pages

### EquipmentPage (`src/pages/EquipmentPage.tsx`)

- **Route:** `/equipment`
- **Auth required:** Yes
- **API endpoints:** `GET /api/equipment`, `POST /api/equipment/:id/upgrade`

Grid of equipment cards showing: name (colored by rarity), rarity badge, slot, level, non-zero stats, equipped-on indicator, and upgrade button.

### CharacterDetailPage — Gear Section

The character detail page (`/characters/:id`) now includes an interactive gear section with:
- 11 slot boxes (Head, Neck, Chest, Belt, Legs, Feet, Arms, Weapon, Off-hand, Ring, Mount)
- Each slot shows the equipped item name and rarity badge (or "Empty")
- Dropdown selector to equip/unequip compatible gear per slot
- Sends `PUT /api/characters/:id/equip` with the full 11-slot gear array

## Components

### RarityBadge (`src/components/equipment/RarityBadge.tsx`)

Colored badge for equipment rarity:
- Common: gray (slate-300)
- Rare: green (green-500)
- Epic: cyan (cyan-400)
- Legendary: purple (purple-500)
- Mythic: pink (pink-500)

Also exports `getRarityColor(rarity)` for coloring item names.

## Service

### `src/services/equipment.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `listEquipment(token)` | GET | `/api/equipment` | List all user's equipment |
| `upgradeEquipment(token, id)` | POST | `/api/equipment/:id/upgrade` | Level up equipment (burns materials) |

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/equipment.test.ts` | 3 | list, upgrade success, insufficient materials |
| `src/__tests__/pages/EquipmentPage.test.tsx` | 7 | List render, rarity badges, slot/level, equipped indicator, upgrade buttons, empty, loading |
| `src/__tests__/components/RarityBadge.test.tsx` | 5 | All 5 rarity levels render correctly |

### Run tests

```bash
npm test -- src/__tests__/services/equipment.test.ts
npm test -- src/__tests__/pages/EquipmentPage.test.tsx
npm test -- src/__tests__/components/RarityBadge.test.tsx
```
