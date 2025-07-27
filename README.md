# Bank Website

This project contains a simple full‑stack banking web application.  The
backend is a lightweight REST API built with Node and Express, while
the frontend is a minimal React app served directly from the same
server.  There is **no build step**: the frontend uses CDN versions
of React and ReactDOM so you can run everything with just Node.

## Structure

- **backend/** – Contains the Express server (`index.js`) and
  `package.json`.  The server exposes API endpoints under
  `/api/accounts` and also serves the static frontend.
- **frontend/** – Contains `index.html` which bootstraps a React
  application using the UMD builds served from unpkg.com.  The UI
  allows you to view existing accounts, create new accounts, and
  deposit/withdraw funds.

## Running locally

1. Install the dependencies:

   ```sh
   cd backend
   npm install
   ```

2. Start the server:

   ```sh
   npm start
   ```

3. Open your browser to [http://localhost:3000](http://localhost:3000)
   to view the frontend.  The API will be available under
   `/api/accounts` for programmatic access.

The server stores all data in memory.  Restarting the server will
reset account balances.  For a production system you would add a
database and proper authentication.

## Deploying to GitHub and Netlify

This repository can be pushed to GitHub and then connected to
Netlify.  Since there is no build step, Netlify can simply serve the
`frontend/index.html` file.  If you wish to deploy the Node backend
separately, consider using services such as Heroku or Render.
