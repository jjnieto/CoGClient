# Testing Guide — Chains of Glory Client

Step-by-step manual testing instructions for each implemented feature. Updated as new phases are completed.

## Prerequisites

1. **Backend running:**
   ```bash
   cd E:/CoGServer
   php artisan serve
   ```
   Server starts at `http://localhost:8000`. Make sure migrations and seeds have been run (`php artisan migrate --seed`).

2. **Frontend running:**
   ```bash
   cd E:/CoGClient
   npm run dev
   ```
   App starts at `http://localhost:5173`.

3. **Run automated tests:**
   ```bash
   npm test
   ```

---

## Phase 1 — Authentication

**What was built:** Register, Login, Dashboard, protected routes, Header with logout.

### Test: Register a new account

1. Open `http://localhost:5173` — you are redirected to `/login`
2. Click the **"Register"** link at the bottom
3. Fill in:
   - Username: `testplayer`
   - Email: `testplayer@example.com`
   - Password: `password123`
4. Click **"Register"**
5. **Expected:** You are redirected to the Dashboard (`/`). The header shows `testplayer` and `0 COG`.

### Test: Logout

1. From the Dashboard, click **"Logout"** in the top-right corner
2. **Expected:** You are redirected to `/login`
3. Try navigating to `http://localhost:5173/` directly
4. **Expected:** You are redirected back to `/login` (protected route)

### Test: Login with existing account

1. On the Login page, enter:
   - Email: `testplayer@example.com`
   - Password: `password123`
2. Click **"Login"**
3. **Expected:** You are redirected to the Dashboard showing `testplayer` and `0 COG`

### Test: Login with wrong password

1. On the Login page, enter:
   - Email: `testplayer@example.com`
   - Password: `wrongpassword`
2. Click **"Login"**
3. **Expected:** A red error message appears: "Invalid credentials"

### Test: Register with duplicate username

1. Click **"Register"**
2. Enter the same username `testplayer` with a different email
3. Click **"Register"**
4. **Expected:** A red error message appears: "Username already taken"

### Test: Protected routes redirect

1. Make sure you are logged out
2. Navigate to `http://localhost:5173/`
3. **Expected:** Redirected to `/login`

---

## Phase 2 — Faucet + COG Balance

**What was built:** Dev faucet button on Dashboard, COG balance updates reactively in header.

### Test: Get free COG

1. Log in (or register a new account with 0 COG)
2. On the Dashboard, find the **"Dev Faucet"** card
3. Click **"Get Free COG"**
4. **Expected:** A green message appears: "+500 COG received! Total withdrawn: 500/2500"
5. The header COG balance updates to **500**

### Test: Get COG multiple times

1. Click **"Get Free COG"** 4 more times (5 total)
2. **Expected:** After each click, the total withdrawn increases (500, 1000, 1500, 2000, 2500)
3. Header balance should show **2500** after 5 clicks

### Test: Max withdrawal reached

1. After 5 withdrawals, click **"Get Free COG"** again
2. **Expected:** A red error message appears: "Max withdrawal reached"
3. Balance stays at **2500**

---

## Phase 3 — Game Data (static)

**What was built:** Types, service, and hooks for all 8 static game data endpoints. Data is cached forever (fetched once, never re-fetched).

### Test: Verify data loads (automated only)

Game data has no dedicated UI yet — it will be consumed by later phases (Store, Characters, Quests, etc.). For now, verify via automated tests:

```bash
npm test -- src/__tests__/services/gamedata.test.ts
npm test -- src/__tests__/hooks/useGameData.test.tsx
```

### Test: Verify endpoints respond (manual curl)

These endpoints require no auth and should return JSON arrays:

```bash
curl -s http://localhost:8000/api/gamedata/heroes | head -1   # 4 heroes
curl -s http://localhost:8000/api/gamedata/enemies | head -1   # 9 enemies
curl -s http://localhost:8000/api/gamedata/quests | head -1    # 9 quests
curl -s http://localhost:8000/api/gamedata/equipment | head -1 # 26 equipment
curl -s http://localhost:8000/api/gamedata/potions | head -1   # 6 potions
curl -s http://localhost:8000/api/gamedata/materials | head -1 # 27 materials
curl -s http://localhost:8000/api/gamedata/recipes | head -1   # 11 recipes
curl -s http://localhost:8000/api/gamedata/chests | head -1    # 2 chests
```

---

## Phase 4 — Store + Purchases

**What was built:** Store page with catalog browsing and item purchasing.

### Test: Browse the store catalog

1. Log in and navigate to **Store** (click "Store" in the header)
2. **Expected:** Page shows 5 sections: Characters, Equipment, Potions, Materials, Recipes
3. Each item shows its name, price in COG, and a Buy button

### Test: Buy a character

1. Make sure you have at least 200 COG (use the Faucet if needed)
2. Go to the Store page
3. In the **Characters** section, type a name (e.g., `Ragnar`) in the name input next to "Barbarian"
4. Click **"Buy"**
5. **Expected:** Green message: "Purchased! Spent 200 COG. New balance: XXXX"
6. Header COG balance updates

### Test: Buy without character name

1. In the Characters section, leave the name field empty
2. Click **"Buy"**
3. **Expected:** Red error: "Please enter a character name"

### Test: Buy equipment

1. In the **Equipment** section, click **"Buy"** next to "Leather helm" (80 COG)
2. **Expected:** Green success message, COG deducted

### Test: Buy with insufficient COG

1. If your balance is low, try buying an expensive item
2. **Expected:** Red error: "Insufficient COG"

### Test: Buy potions/materials with quantity

1. In the **Potions** section, change the Qty field to `3`
2. Click **"Buy"** next to "Basic health potion"
3. **Expected:** 150 COG spent (3 x 50), success message shown

---

## Phase 5 — Characters

**What was built:** Character list page, character detail page with stats, vitality, XP, gear slots, and level-up.

### Test: View character list

1. Make sure you have at least one character (buy one from the Store if needed)
2. Click **"Characters"** in the header
3. **Expected:** Grid of character cards showing name, race, level, HP/ATK/DEF/DDG stats, and vitality bar

### Test: Empty character list

1. Register a new account (no characters)
2. Navigate to `/characters`
3. **Expected:** "No characters yet. Buy one from the Store" with a link

### Test: Vitality bar updates in real-time

1. On the Characters page, observe a character's vitality bar
2. If vitality is below 100%, wait a few seconds
3. **Expected:** The vitality percentage slowly increases (1 point per second)

### Test: View character detail

1. Click on a character card
2. **Expected:** Full detail page showing:
   - All 8 stats (HP, ATK, DEF, DDG, MST, SPD, LCK, FTH)
   - Vitality bar with time format (e.g., "23h 45m 12s")
   - XP progress bar
   - 11 gear slots (mostly "Empty" for a new character)

### Test: Time lock indicator

1. If a character was recently used in a quest, its card shows a red "Locked Xs" badge
2. **Expected:** The countdown decreases every second and disappears when it reaches 0

---

## Phase 6 — Equipment + Equip

**What was built:** Equipment list page, rarity badges, upgrade, and equip UI in character detail.

### Test: View equipment list

1. Buy some equipment from the Store (e.g., Leather helm for 80 COG)
2. Click **"Equipment"** in the header
3. **Expected:** Grid of equipment cards showing name, rarity badge (e.g., "Common"), slot, level, and stats

### Test: Rarity colors

1. On the Equipment page, note that:
   - Common items show gray name and "Common" badge
   - Rare items (if you have any) show green
   - Epic items show cyan

### Test: Equip gear on a character

1. Navigate to a character detail page (click a character card from Characters page)
2. Scroll to the **"Equipped Gear"** section
3. Each slot has a dropdown. Select an item from the dropdown (e.g., a Wooden Sword in the "Weapon" slot)
4. **Expected:** Green message "Gear updated!", stats above should change to reflect the equipped item

### Test: Unequip gear

1. In a slot that has an equipped item, change the dropdown to "-- None --"
2. **Expected:** Gear updated, stats recalculated without that item

### Test: Upgrade equipment

1. Go to the Equipment page
2. Click **"Upgrade to Lv.1"** on an item
3. If you have the required materials: **Expected:** Success message, level increases
4. If not: **Expected:** Error "Insufficient materials"

---

## Phase 7 — Quests + Classic Combat

**What was built:** Quests page with quest listing, character/difficulty selection, and auto-resolve combat.

### Test: View quest list

1. Click **"Quests"** in the header
2. **Expected:** Grid of quest cards showing name, description, enemy name, vitality cost, base XP, luck %
3. "Play Quest" buttons should be **disabled** (no character selected yet)

### Test: Select character and difficulty

1. In the top bar, select a character from the **Character** dropdown
2. Change the **Difficulty** dropdown (Normal, Hard, Expert, Master, Legendary)
3. **Expected:** "Play Quest" buttons become enabled after selecting a character

### Test: Play a quest

1. Select a character with enough vitality (e.g., 86400)
2. Select "Normal" difficulty
3. Click **"Play Quest"** on "Clean the Black Harpy" (1900 vitality cost)
4. **Expected:** Result panel appears showing:
   - Combat percentage (0-100%)
   - XP earned
   - Current level (with "UP!" if leveled up)
   - Lock time in seconds
   - "Chest obtained!" if lucky
5. Character is now locked — trying to play again shows "Character is locked"

### Test: Insufficient vitality

1. Play many quests until a character's vitality is low
2. Try a quest that costs more vitality than available
3. **Expected:** Error message: "Insufficient vitality"

### Test: Character locked

1. After playing a quest, immediately try to play again with the same character
2. **Expected:** Error: "Character is locked" (wait for lock timer to expire)

---

## Phase 8 — Chests

**What was built:** Chest listing page with time lock countdown and chest opening with loot display.

### Test: View chest list

1. Play a quest to earn a chest (see Phase 7)
2. Click **"Chests"** in the header
3. **Expected:** Grid of chest cards showing chest ID, quest info, combat percentage

### Test: Time lock countdown

1. If a chest was just earned, it may have a time lock
2. **Expected:** Red badge showing countdown (e.g., "5s"), Open button shows "Locked (5s)"
3. Once countdown reaches 0, the Open button becomes active

### Test: Open a chest with loot

1. Click **"Open Chest"** on an unlocked chest
2. **Expected:** Gold "Loot Received!" panel showing drops (e.g., "1x Equipment #9")
3. The chest disappears from the list

### Test: Empty chest

1. Open a chest with low combat percentage (< 100%)
2. **Expected:** Sometimes shows "Chest was empty! Bad luck." (depends on RNG)

### Test: No chests

1. Open all chests or start with a fresh account
2. **Expected:** "No chests. Play quests to earn chests!"

---

<!-- New phases will be appended below this line -->
