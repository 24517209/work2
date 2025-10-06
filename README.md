PROG2002 Assessment 2 - Charity Events Website

Setup

1. Install Node.js LTS and MySQL 8+
2. Copy .env.example to .env and fill database credentials
3. Create database and seed data:
   - Run the SQL in sql/schema.sql then sql/seed.sql
4. Install dependencies: npm install
5. Start the server: npm run dev

Project Structure

- server: Express API and DB connection
- public: Frontend static files
- sql: Schema and seed scripts

API

- GET /api/categories
- GET /api/events (home/upcoming)
- GET /api/events/search?dateFrom&dateTo&city&categoryId&keyword
- GET /api/events/:id

Frontend Pages

- / (home): organization info + events list
- /search.html: search form + results
- /detail.html?id=ID: event details

Quick Start (English)

Environment Setup

- Node.js LTS and MySQL 8+ installed
- Create and fill `.env` (reference fields: PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)

Database Initialization

1) Execute in MySQL: `sql/schema.sql`
2) Then execute: `sql/seed.sql`

Start Service

1) Install dependencies: `npm install`
2) Start: `npm run dev`
3) Visit: `http://localhost:3000`

Verify API (Examples)

- `GET /api/categories`
- `GET /api/events`
- `GET /api/events/search?city=Sydney&categoryId=1`
- `GET /api/events/1`

