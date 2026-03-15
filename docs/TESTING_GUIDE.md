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

<!-- New phases will be appended below this line -->
