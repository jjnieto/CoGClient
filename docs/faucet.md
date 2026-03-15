# Faucet

## Description

Dev faucet that gives free COG currency for testing. Located in the Dashboard page. Each click gives 500 COG, up to a maximum of 2500 (5 uses per user).

## UI Location

Dashboard page (`/`) — "Dev Faucet" card below the user info cards.

## Service

### `src/services/faucet.ts`

| Function | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| `withdraw(token)` | POST | `/api/faucet/withdraw` | Yes | Withdraw 500 COG, returns new balance |

## Types

### `src/types/faucet.ts`

| Type | Fields |
|------|--------|
| `FaucetResponse` | `amount`, `totalWithdrawn`, `newBalance` |

## Behavior

- Button "Get Free COG" triggers `POST /api/faucet/withdraw`
- On success: green message showing amount received and total withdrawn (e.g., "+500 COG received! Total withdrawn: 1000/2500")
- On error (max reached): red message showing "Max withdrawal reached"
- After withdraw: COG balance in header updates via query invalidation of `['me']`

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/faucet.test.ts` | 2 | Service sends correct request, handles max error |
| `src/__tests__/pages/DashboardPage.test.tsx` | 3 | Renders faucet, success message, error message |

### Run tests

```bash
npm test -- src/__tests__/services/faucet.test.ts
npm test -- src/__tests__/pages/DashboardPage.test.tsx
```
