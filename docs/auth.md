# Authentication

## Description

Authentication flow for the Chains of Glory client. Covers user registration, login, session management, and protected route access.

## Pages

### LoginPage (`src/pages/LoginPage.tsx`)

Login form with email and password fields. On success, stores the token and redirects to the dashboard. On failure, displays the API error message.

- **Route:** `/login`
- **Auth required:** No
- **API endpoint:** `POST /api/auth/login`

### RegisterPage (`src/pages/RegisterPage.tsx`)

Registration form with username, email, and password fields. On success, stores the token and redirects to the dashboard. On failure, displays the API error message (validation errors, duplicate username/email).

- **Route:** `/register`
- **Auth required:** No
- **API endpoint:** `POST /api/auth/register`

### DashboardPage (`src/pages/DashboardPage.tsx`)

Displays the authenticated user's username, COG balance, and online status. Fetches user data via `/auth/me` on load.

- **Route:** `/`
- **Auth required:** Yes
- **API endpoint:** `GET /api/auth/me`

## Components

### ProtectedRoute (`src/components/layout/ProtectedRoute.tsx`)

Route wrapper that checks `isAuthenticated` from the auth store. Redirects to `/login` if no token is present. Uses React Router's `<Outlet>` to render child routes.

### Header (`src/components/layout/Header.tsx`)

Top navigation bar shown on all authenticated pages. Displays:
- App name (link to dashboard)
- Navigation links (Dashboard, Characters, Equipment, Quests, Store, Inventory, Chests)
- COG balance (amber color)
- Username
- Logout button

Fetches user data via `GET /api/auth/me` using TanStack Query to keep the balance up to date.

### AppLayout (`src/components/layout/AppLayout.tsx`)

Layout wrapper that renders the Header and an `<Outlet>` for page content. Used inside `ProtectedRoute` in the router config.

## Services

### `src/services/auth.ts`

| Function | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| `register(data)` | POST | `/api/auth/register` | No | Creates account, returns token + user |
| `login(data)` | POST | `/api/auth/login` | No | Authenticates, returns token + user |
| `getMe(token)` | GET | `/api/auth/me` | Yes | Returns current user info |

## State Management

### Auth Store (`src/stores/authStore.ts`)

Zustand store managing authentication state:

| Field | Type | Description |
|-------|------|-------------|
| `token` | `string \| null` | Bearer token, persisted in localStorage |
| `user` | `User \| null` | Current user data (id, username, cogBalance) |
| `isAuthenticated` | `boolean` | Whether a token exists |

| Action | Description |
|--------|-------------|
| `setAuth(token, user)` | Stores token in localStorage and updates state |
| `setUser(user)` | Updates user data without changing token |
| `logout()` | Clears token from localStorage and resets state |

## Types

### `src/types/auth.ts`

| Type | Fields |
|------|--------|
| `User` | `id`, `username`, `cogBalance`, `isAdmin?` |
| `LoginRequest` | `email`, `password` |
| `RegisterRequest` | `username`, `email`, `password` |
| `AuthResponse` | `token`, `user` |

## Testing

### Test files

| File | Tests | Description |
|------|-------|-------------|
| `src/__tests__/services/auth.test.ts` | 3 | Service functions send correct requests |
| `src/__tests__/stores/authStore.test.ts` | 4 | Store actions (setAuth, setUser, logout) |
| `src/__tests__/pages/LoginPage.test.tsx` | 4 | Render, submit success, submit error, link to register |
| `src/__tests__/pages/RegisterPage.test.tsx` | 4 | Render, submit success, submit error, link to login |
| `src/__tests__/components/ProtectedRoute.test.tsx` | 2 | Renders children when auth, redirects when not |
| `src/__tests__/App.test.tsx` | 2 | Routing: redirect to login, login page renders |

### Run tests

```bash
# All auth tests
npm test

# Specific test file
npm test -- src/__tests__/pages/LoginPage.test.tsx
```

### Manual testing against backend

1. Start the backend:
   ```bash
   cd ../CoGServer
   php artisan serve
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Test flow:
   - Open `http://localhost:5173` — should redirect to `/login`
   - Click "Register" link — go to `/register`
   - Fill in username, email, password — submit
   - Should redirect to `/` (Dashboard) showing username and COG balance (0)
   - Header should show "0 COG" and the username
   - Click "Logout" — should redirect to `/login`
   - Login with the same email/password — should return to Dashboard
   - Try logging in with wrong password — should show "Invalid credentials" error
