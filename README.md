# Equalize

Equalize is a frontend-only React prototype for a SOEN 357 final project. The product focuses on fair expense sharing for roommates and explores whether contribution visuals can reduce tension compared with balance-only expense tracking.

## Prototype Scope

- Frontend only
- Mocked local data only
- No backend, database, authentication, or payment integration
- Built for demoing and evaluating roommate expense-sharing flows

## Current Features

- Household dashboard with roommate balances
- Fairness-focused contribution breakdown
- Expense history with mocked shared purchases
- Low-friction reminder templates for settlement requests
- Modal flows for adding expenses and logging payments

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion

## Run Locally

Prerequisites:

- Node.js
- npm

Install dependencies:

```bash
npm install
```

Start the local web app:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run clean
```

## Mock Data

The current prototype uses mocked roommate and expense data stored in `src/data/mockData.ts`. UI state is local to the frontend and resets when the page reloads.
