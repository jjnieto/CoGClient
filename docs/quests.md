# Quests

## Description

Quest listing and classic (auto-resolve) combat page. Players select a character and difficulty level, then play a quest. Combat resolves instantly and shows the result with XP gained, combat percentage, chest obtained, and guaranteed drops.

## Page

### QuestsPage (`src/pages/QuestsPage.tsx`)

- **Route:** `/quests`
- **Auth required:** Yes
- **API endpoints:** `GET /api/quests`, `POST /api/quests/play`

Features:
- Character selector dropdown (from user's characters)
- Difficulty selector (Normal 100% — Legendary 1500%)
- Grid of quest cards: name, description, enemy name, vitality cost, base XP, luck %
- Play Quest button (disabled until character is selected)
- Result panel: combat %, XP earned, new level, level-up indicator, lock time, chest, guaranteed drops
- Query invalidation after play: characters, chests, items

## Service

### `src/services/quests.ts`

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `listQuests(token)` | GET | `/api/quests` | List all quests with drop tables |
| `playQuest(token, data)` | POST | `/api/quests/play` | Play quest, returns combat result |

## Types

### `src/types/quest.ts`

| Type | Key fields |
|------|------------|
| `QuestInfo` | `index`, `name`, `description`, `vitalityCost`, `enemyIndex`, `luck`, `experience`, `drops[]` |
| `PlayQuestRequest` | `questIndex`, `characterId`, `questLevel`, `potionId` |
| `PlayQuestResponse` | `levelUp`, `experience`, `newLevel`, `combatPercentage`, `missionTime`, `chest`, `guaranteedDrops[]` |

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/quests.test.ts` | 4 | list, play success, locked character, insufficient vitality |
| `src/__tests__/pages/QuestsPage.test.tsx` | 7 | List render, char selector, difficulty selector, disabled buttons, play success, locked error, loading |

### Run tests

```bash
npm test -- src/__tests__/services/quests.test.ts
npm test -- src/__tests__/pages/QuestsPage.test.tsx
```
