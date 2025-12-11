# GeoTrace Pro (Frontend Demo)

A React-based IP Geolocation and History tracking application. 

**Note:** This version operates in "Frontend Only" mode using LocalStorage to mock backend persistence.

## Prerequisites

- Node.js (v16+)

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173`.

### Usage

1. **Login**: Use `test@example.com` / `password123`.
2. **Dashboard**:
   - The map loads your current location.
   - Enter an IP (e.g., `8.8.8.8`) to track it.
   - View search history in the sidebar (persisted in browser LocalStorage).
   - Bulk delete history items.

## Technologies

- React (Vite)
- Tailwind CSS
- Leaflet Maps
- Axios
