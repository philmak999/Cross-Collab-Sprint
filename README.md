# Cross-Collab Sprint - Dispatcher Dashboard

This project is a dispatcher workflow prototype for triaging emergency calls, selecting a destination hospital, and dispatching an ambulance using AI-generated outputs from live-feed hospital data and phone call transcripts. The UI includes a case summary, hospital routing tools, a selectable hospital list with map previews, and follow-up screens for ambulance dispatched and emergency call in progress.

## Key Features
- Case summary display with critical symptoms and actions
- Hospital routing panel with selectable hospital cards
- Map preview tied to the selected hospital
- Dispatch flow with follow-up pages
- Hamburger menu navigation and responsive layout adjustments

## Project Structure
- `frontend/` - React + Vite client application
- `backend/` - Express server and database import scripts

## Run Locally
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Open the URL printed by Vite to view the app in the browser.

## Database Import (MySQL)
The backend includes a simple importer for `.mysql`/`.sql` files.

1. `cd backend`
2. `npm install`
3. Create `backend/.env` (see `backend/.env.example`)
4. Place your SQL file at the path in `DB_SQL_FILE`
5. Run: `npm run db:import`
