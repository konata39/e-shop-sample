# E-Shop Sample

This project is a Vue 3 + Vite storefront that consumes product data from a Strapi headless CMS.

## Prerequisites

- Node.js 18+
- npm 8+
- A running Strapi instance available at `http://localhost:1337`

## Backend setup (Strapi)

1. Create a Strapi project (or reuse the existing one) that will serve product data:
   ```bash
   npx create-strapi-app@latest backend --quickstart
   ```
2. Install project dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start Strapi in development mode so the API is reachable at `http://localhost:1337`:
   ```bash
   npm run develop
   ```
4. Import the provided catalog data archive (`XXX.tar.gz.enc`) through the Strapi admin panel's import feature so that the products populate the database.

> **Note:** The frontend expects the `/api/products` endpoint to be available. If your Strapi project is not running at the default host/port, update the frontend configuration accordingly.

## Frontend setup (Vue 3 + Vite)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Environment configuration

Create a `.env` file if you need to override the API base URL:

```
VITE_API_BASE_URL=http://localhost:1337
```

Restart the Vite dev server after changing environment variables.
