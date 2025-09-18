# OKR Summary Application

A web application for publishing and maintaining OKR summary history, built with React, Node.js, and SQLite.

## Features

- 📊 Display OKR summaries with detailed information
- 📜 Maintain historical versions of OKR summaries
- 🔍 Search and filter OKR data
- 📁 Organized data management
- 🚀 Modern responsive UI

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up the database:**
   ```bash
   npm run setup
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
okr-summary-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
├── server/                 # Express.js backend
│   ├── src/
│   ├── database/
│   └── package.json
└── package.json           # Root package.json
```

## Technology Stack

- **Frontend:** React 18, TypeScript, Create React App
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** SQLite with better-sqlite3
- **Development:** Concurrently for running both servers

## API Endpoints

- `GET /api/summaries` - Get all OKR summaries
- `GET /api/summaries/:id` - Get specific summary
- `POST /api/summaries` - Create new summary
- `PUT /api/summaries/:id` - Update summary
- `DELETE /api/summaries/:id` - Delete summary
- `GET /api/summaries/:id/history` - Get summary history

## Development

- Frontend runs on port 3000
- Backend runs on port 5000
- Database file: `server/database/okr_summaries.db`