# Rewards

## Description

Level-up reward system integrated into the character detail page. Each character has 10 reward levels (0-9). Rewards can be claimed once the character reaches that level, creating an immediately openable chest.

## UI Location

Character detail page (`/characters/:id`) — "Level Rewards" section at the bottom. Shows a grid of 10 boxes, one per level:
- **Amber** (Claim button) — available to claim (character level >= reward level, not yet claimed)
- **Gray** ("Claimed") — already claimed
- **Dark** ("Locked") — character hasn't reached this level yet

## Service

### `src/services/rewards.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `getRewardStatus(token, characterId)` | GET | `/api/rewards/:characterId` | Returns 10-element claims array |
| `claimReward(token, data)` | POST | `/api/rewards/claim` | Claim reward, creates chest |

## Types

### `src/types/rewards.ts`

| Type | Fields |
|------|--------|
| `RewardStatus` | `characterId`, `characterLevel`, `race`, `claims: boolean[10]` |
| `ClaimRewardRequest` | `characterId`, `level` |
| `ClaimRewardResponse` | `chest: { id, questIndex, questLevel, percentage, mintNFT }` |

## Behavior

1. On character detail page load, fetches reward status via `GET /api/rewards/:characterId`
2. Displays 10 level boxes showing claimed/available/locked state
3. Clicking "Claim" sends `POST /api/rewards/claim`
4. On success: message with chest ID, invalidates rewards and chests queries
5. Created chest has `percentage: 100` and `timeLock: 0` — can be opened immediately from the Chests page

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/rewards.test.ts` | 4 | getStatus, claim success, already claimed, level not reached |

### Run tests

```bash
npm test -- src/__tests__/services/rewards.test.ts
```
