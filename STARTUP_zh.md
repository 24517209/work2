Startup Guide (English)

This project: PROG2002 A2 Charity Events Dynamic Website (Node.js + Express + MySQL + HTML/JS/DOM).

1. Environment Setup

- Install Node.js LTS (recommended 18/20)
- Install MySQL 8+
- Clone or download this project code to local

2. Configure Environment Variables

- Copy `.env.example` to `.env`
- Fill in according to your local database configuration:
  - PORT=3000
  - DB_HOST=localhost
  - DB_PORT=3306
  - DB_USER=your_username
  - DB_PASSWORD=your_password
  - DB_NAME=charityevents_db

Note: Please do not commit real passwords to the repository. For production or assignment submission, use local `.env` files.

3. Initialize Database

1) Use MySQL client (such as MySQL Workbench, command line, TablePlus, etc.) to connect to the database.
2) Execute the following scripts in order:
   - `sql/schema.sql` (create database and tables)
   - `sql/seed.sql` (insert sample data, including 8+ events)

4. Install Dependencies

Execute in the project root directory:
```bash
npm install
```

5. Start Service

```bash
npm run dev
```

Default listening on `http://localhost:3000`

6. Frontend Access and Function Verification

- Open browser and visit: `http://localhost:3000`
- Homepage: Organization info (static) + Events list (from `/api/events`)
- Search page: `/search.html`, supports date/city/category/keyword filtering (calls `/api/events/search`)
- Detail page: `/detail.html?id=1`, displays complete information (calls `/api/events/:id`), "Register/Purchase" button will show "This feature is under construction"

7. API Overview

- GET /api/categories: Get event categories
- GET /api/events: Get current/future events for homepage (hidden events filtered out)
- GET /api/events/search?dateFrom&dateTo&city&categoryId&keyword: Search by conditions
- GET /api/events/:id: Get event details

8. Common Issues

- Port occupied: Modify `PORT` in `.env` or close the occupying program
- Cannot connect to database: Check database address/port/user/password/permissions in `.env`, confirm schema/seed has been executed
- Empty data: Confirm `sql/seed.sql` has been executed and records with `events.is_hidden=0` exist

9. Submission Instructions (Assignment)

- Submit: Source code + exported SQL (including `schema.sql` and `seed.sql`)
- Running guide: Include this `STARTUP_zh.md` or the "Quick Start (English)" section in `README.md`

Wish you smooth development!

