# Media Watchlist Manager

## Project Description

Media Watchlist Manager is a full-stack web application that helps users search for movies and TV shows, save them to a personal watchlist, and track their viewing status.

The goal is to solve a common problem: users often forget whether they already planned to watch, started watching, or completed a movie or show.

Users will be able to search for media titles through an external movie/TV API, view useful metadata such as title, poster, release year, and overview, and then save selected items to their own account. The app will prevent duplicate saved entries by warning users when they try to add something that already exists in their watchlist.



## 1. Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS or Bootstrap

### Backend

- Node.js
- Express
- PostgreSQL
- bcrypt for password hashing
- JWT or session-based authentication

### External API

- TMDb API or OMDb API

I am currently leaning toward TMDb because it supports movie and TV search and includes poster/image-related data.

### Deployment

Deployment is a stretch goal. The main priority is a working full-stack app locally with a clear README.

---

## 2. Project Focus

This will be an evenly focused full-stack application.

The frontend will focus on a clean user interface for searching media, viewing details, filtering saved items, and managing a personal watchlist.

The backend will focus on user authentication, saving user-specific watchlist data, preventing duplicates, managing status updates, and connecting the frontend to the external movie/TV API.

---

## 3. Project Type

This will be a web application.

It will run in a browser and be built as a full-stack app with a React frontend and an Express/PostgreSQL backend.

---

## 4. Project Goal

The goal of the project is to help users organize movies and TV shows they want to watch.

The app will allow users to:

- Search for movies and TV shows
- Save items to a personal watchlist
- Avoid adding duplicate entries
- Mark items as planned, watching, completed, or dropped
- View and filter their saved media list

The main problem being solved is media clutter and forgetfulness. Instead of relying on scattered notes, browser bookmarks, or memory, users can keep their watchlist in one organized place.

---

## 5. Target Users

The target users are people who regularly watch movies, TV shows, or anime and want a simple way to track what they are interested in.

Example users:

- Students who want to organize shows and movies
- Anime/movie fans with long watchlists
- Casual viewers who forget what they planned to watch
- Users who want a lightweight alternative to spreadsheets or notes apps

---

## 6. Data Plan

The app will use two kinds of data:

1. External API data
2. App database data

### External API Data

The external API will provide movie and TV metadata, such as:

- Title
- Release year or first air date
- Poster image
- Overview/description
- Media type
- External API ID
- Rating or popularity, if available

TMDb has search endpoints for movies and TV shows. OMDb is another possible fallback because it provides movie information by title, IMDb ID, and search query.

### App Database Data

The app database will store user accounts and saved watchlist items.

The database will not store the entire external API database. It will only store the specific items that users save to their watchlists.

---

## 7. Proposed Database Schema

### `users`

| Column | Type | Description |
| --- | --- | --- |
| `id` | `SERIAL PRIMARY KEY` | Unique user ID |
| `username` | `TEXT UNIQUE NOT NULL` | User's login name |
| `password_hash` | `TEXT NOT NULL` | Hashed password |
| `email` | `TEXT UNIQUE` | Optional email |
| `created_at` | `TIMESTAMP` | Account creation date |

### `watchlist_items`

| Column | Type | Description |
| --- | --- | --- |
| `id` | `SERIAL PRIMARY KEY` | Unique saved item ID |
| `user_id` | `INTEGER REFERENCES users(id)` | Owner of the item |
| `api_id` | `TEXT NOT NULL` | ID from TMDb/OMDb |
| `media_type` | `TEXT NOT NULL` | Movie or TV |
| `title` | `TEXT NOT NULL` | Movie/show title |
| `poster_url` | `TEXT` | Poster image URL |
| `release_year` | `TEXT` | Release year |
| `overview` | `TEXT` | Description |
| `status` | `TEXT NOT NULL` | Planned, watching, completed, or dropped |
| `user_rating` | `INTEGER` | Optional personal rating |
| `notes` | `TEXT` | Optional user notes |
| `created_at` | `TIMESTAMP` | Date added |

### Duplicate Rule

The app should prevent duplicate entries for the same user by checking this combination:

```sql
user_id + api_id + media_type
```

## 8. Possible API Issues

Possible API issues include:

- API rate limits
- Missing posters or incomplete metadata
- Search results returning many similar titles
- Movie and TV results having slightly different fields
- API key needing to be hidden on the backend
- External API downtime or failed requests

To handle these issues, the app will include backend error handling and loading/error states on the frontend.

---

## 9. Sensitive Information

The app will need to secure:

- User passwords
- JWT secret
- External API key
- Database connection string

Passwords will be hashed with bcrypt. API keys and secrets will be stored in environment variables, not committed to GitHub.

---

## 10. Core Functionality

### Must-Have Features

- User signup
- User login
- User logout
- Search movies/shows using an external API
- View search results
- Add a movie/show to the personal watchlist
- Prevent duplicate watchlist entries
- View saved watchlist
- Update item status:
  - Planned
  - Watching
  - Completed
  - Dropped
- Delete item from watchlist
- Filter watchlist by status

### Nice-to-Have Features

- Add personal notes
- Add personal rating
- Sort by title, date added, or release year
- View detail page for each saved item
- Separate movie and TV filters
- Better visual styling with poster cards

---

## 11. User Flow

### New User Flow

1. User visits homepage.
2. User signs up.
3. User logs in.
4. User searches for a movie or TV show.
5. User views search results.
6. User clicks "Add to Watchlist."
7. App saves the item.
8. User goes to their watchlist.
9. User changes the item status over time.

### Returning User Flow

1. User logs in.
2. User views their saved watchlist.
3. User filters by planned, watching, completed, or dropped.
4. User searches for new media.
5. User adds new items.
6. App warns them if the item already exists.

---

## 12. Key Features and Logic

The app will include:

- External API integration
- User authentication
- User-specific saved data
- Duplicate prevention logic
- Search functionality
- Filtering by status
- Backend route protection
- Data normalization between external API results and local database records

The duplicate prevention feature is especially important because the app is not only saving records. It is checking whether a media item already exists for that user before creating a new database entry.

---

## 13. Stretch Goals

- Add personal notes
- Add personal rating
- Sort by title, date added, or release year
- Add anime-specific category or tag
- Import/export watchlist as JSON or CSV
