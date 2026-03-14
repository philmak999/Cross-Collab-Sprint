# Cross-Collab Sprint - Dispatcher Dashboard

This project is a dispatcher workflow prototype for triaging emergency calls, selecting a destination hospital, and dispatching an ambulance using AI-generated outputs from live-feed hospital data and phone call transcripts. The UI includes a case summary, hospital routing tools, a selectable hospital list with map previews, and follow-up screens for ambulance dispatched and emergency call in progress.

## Key Features
- Case summary display with critical symptoms and actions
- Hospital routing panel with selectable hospital cards
- Map preview tied to the selected hospital with fully supported incorportation of Google Maps API on deployment
- Dispatch flow with follow-up pages
- Hamburger menu navigation and responsive layout adjustments

## Project Structure
- `frontend/` - React + Vite client application
- `backend/` - Express server and MySQL database

## Database Import (MySQL)
The backend includes a an importer-ready code constructed for `.mysql`/`.sql` files.
