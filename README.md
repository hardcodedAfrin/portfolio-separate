# Portfolio Website with Database

This portfolio website now uses a SQLite database to store all portfolio information and contact form submissions.

## Features

- **Dynamic Portfolio Data**: All portfolio information (header, about, education, skills, projects, certifications, languages) is loaded from the database
- **Contact Form Storage**: Contact form submissions are stored in the database
- **SQLite Database**: Lightweight, file-based database that doesn't require a separate server

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Seed the Database

Run the seed script to populate the database with initial portfolio data:

```bash
npm run seed
```

This will create a `portfolio.db` file and populate it with your existing portfolio information.

### 3. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## Database Structure

The database includes the following tables:

- **portfolio_header**: Name, title, contact information, social links
- **about_me**: About section content
- **education**: Education history
- **personal_info**: Personal information fields
- **skills**: List of skills
- **projects**: Project portfolio
- **certifications**: Certifications list
- **languages**: Languages spoken
- **contact_submissions**: Contact form submissions

## API Endpoints

- `GET /api/portfolio`: Fetch all portfolio data
- `POST /submit`: Submit contact form (stores in database)
- `GET /api/submissions`: Get all contact form submissions (optional)

## Updating Portfolio Data

To update portfolio information, you can:

1. **Directly edit the database** using a SQLite browser tool
2. **Modify the seed.js file** and re-run `npm run seed` (note: this will clear existing data)
3. **Create an admin interface** (future enhancement)

## Database File

The database is stored as `portfolio.db` in the project root directory. This file is created automatically when you first run the application.

