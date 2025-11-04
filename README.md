# E-Shop Sample

This project is a Vue 3 + Vite storefront that consumes product data from a Node.js + MySQL backend.

## Prerequisites

- Node.js 18+
- npm 8+
- MySQL 8+

## Backend setup (Node.js + MySQL)

1. Create a ```.env``` file in the project root to configure your database connection and backend port:

   ```
   PORT=1346
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=admin
   MYSQL_DATABASE=eshop
   MYSQL_CONNECTION_LIMIT=10
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Initialize and start the backend server:
   ```bash
   npm run server
   ```
   The server will:
   - Automatically create the ```eshop``` database if it does not exist
   - Create the ```categories``` and ```products``` tables
   - Insert sample products (cups, badges, shirts)

   Once started, the API will be available at ```http://127.0.0.1:1346/api/products```.

4. Verify the backend:
   ```bash
   curl http://127.0.0.1:1346/api/products
   ```
   You should receive a JSON response containing sample product data.

> **Note:**  
> The backend uses Express with a RESTful JSON API that serves both product and category data.  
> Routes include ```/api/products``` and ```/api/categories```.

## Frontend setup (Vue 3 + Vite)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

   The Vite dev server runs at ```http://localhost:5173``` and proxies all ```/api``` requests to the backend (```http://127.0.0.1:1346```).

3. Build for production:
   ```bash
   npm run build
   ```

4. Serve the built app with the integrated Express server:
   ```bash
   npm run start
   ```
   This will:
   - Build the frontend
   - Serve it along with the backend API at ```http://127.0.0.1:1346```

## Environment configuration

If you need to override the API base URL for the frontend, create a ```.env``` file in the project root:

```
VITE_PRODUCTS_API=http://127.0.0.1:1346/api/products
```

Restart the Vite dev server after changing environment variables.

## API Overview

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | ```/api/products``` | Retrieve all products |
| GET | ```/api/products/:id``` | Retrieve a single product |
| POST | ```/api/products``` | Create a new product |
| PUT | ```/api/products/:id``` | Update an existing product |
| DELETE | ```/api/products/:id``` | Delete a product |
| GET | ```/api/categories``` | Retrieve all categories |

## Project scripts

| Command | Description |
|----------|-------------|
| ```npm run dev``` | Run the Vite dev server (frontend only) |
| ```npm run server``` | Start the Express backend (API + MySQL) |
| ```npm run build``` | Build the frontend for production |
| ```npm run start``` | Build and serve both frontend and backend together |

## Notes

- The backend listens on **port 1346**
- The frontend (Vite) runs on **port 5173**
- MySQL should be running locally on **port 3306**
- The backend automatically initializes and populates the ```eshop``` database if it does not exist
