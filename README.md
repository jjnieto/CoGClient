# Chains of Glory Client

Frontend for the Chains of Glory RPG game. Built with Next.js, TypeScript, and Tailwind CSS. Connects to the [CoGServer](https://github.com/jjnieto/CoGServer) backend API.

## Requirements

- **Node.js 18+**
- **npm 9+**
- **CoGServer running** at `http://localhost:8000` (see [backend setup](https://github.com/jjnieto/CoGServer))

## Setup

```bash
# Clone the repository
git clone https://github.com/jjnieto/CoGClient.git
cd CoGClient

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | Backend API base URL |

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a specific test file
npm test -- src/__tests__/components/StatBar.test.tsx
```

## Building

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 14+ | Framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | State management |
| Vitest | Testing |
| React Testing Library | Component testing |

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (auth)/               # Login, register (no auth required)
    (game)/               # Game pages (auth required)
  components/             # Reusable UI components
    ui/                   # Base UI (buttons, cards, modals)
    game/                 # Game-specific (stats, gear, combat)
  hooks/                  # Custom React hooks
  services/               # API client layer
  stores/                 # Zustand stores
  types/                  # TypeScript interfaces
  lib/                    # Utilities (game math, formatters)
docs/                     # Component and page documentation
```

## Documentation

| Document | Description |
|----------|-------------|
| [Backend API Reference](https://github.com/jjnieto/CoGServer/blob/main/docs/API_REFERENCE.md) | All 34 API routes |
| [Game Concepts](https://github.com/jjnieto/CoGServer/blob/main/docs/GAME_CONCEPTS.md) | Races, stats, combat, crafting |
| [Backend Quickstart](https://github.com/jjnieto/CoGServer/blob/main/docs/QUICKSTART.md) | CURL walkthrough of the full game flow |

## Backend Connection

The frontend connects to the CoGServer REST API:

```
Base URL: http://localhost:8000/api
Auth:     Bearer token stored in localStorage
Format:   JSON request/response
Errors:   {"error": "message"} with HTTP status codes
```

Make sure the backend is running and seeded before starting the frontend:

```bash
cd ../CoGServer
php artisan serve
```
