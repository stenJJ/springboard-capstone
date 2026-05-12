# ClipVault

ClipVault is a full-stack media URL organizer. It allows users to save video links, organize them with statuses and tags, search/filter their saved clips, and prevent duplicate URLs from being saved.

The app was built as a Springboard capstone project and focuses on full-stack CRUD, REST API design, authentication, user-specific data, URL normalization, and duplicate prevention.

---

## Project Goal

The goal of ClipVault is to help users manage large collections of saved video links. Instead of keeping hundreds of tabs open or losing links in browser history, users can save clips in one organized library.

A key feature is duplicate prevention. The backend normalizes URLs before saving them so that similar versions of the same URL can be treated as the same saved clip.

Example:

```text
https://www.youtube.com/watch?v=abc123&t=30s
```

normalizes to:

```text
https://www.youtube.com/watch?v=abc123
```

---

## Live Demo

Frontend: https://ornate-puppy-779bc1.netlify.app/

Backend API: https://clipvault-api.onrender.com/api

## Features

- User registration
- User login/logout
- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- User-specific saved clips
- Add video/media URLs
- Normalize URLs before saving
- Prevent duplicate saved clips per user
- View saved clips
- Search saved clips
- Filter clips by status
- Edit clip details
- Delete clips
- Store data with a JSON file backend

---

## Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express
- CORS
- bcryptjs
- JSON Web Token
- JSON file storage

### Testing

- Jest
- Supertest

---

## Project Structure

```text
springboard-capstone/
  client/
    src/
      components/
      api.js
      App.jsx
      App.css

  server/
    app.js
    server.js
    controllers/
    data/
    helpers/
    middleware/
    routes/
    __tests__/

  proposal.md
  frontend-spec.md
  database-model.md
  api-spec.md
  implementation-plan.md
  README.md
```

---

## Backend Architecture

The backend is organized into separate layers:

```text
routes → controllers → data store/helpers
```

### Important backend files

```text
server/app.js
```

Sets up Express middleware and API route mounting.

```text
server/server.js
```

Starts the backend server.

```text
server/routes/
```

Defines API endpoints.

```text
server/controllers/
```

Handles request/response logic.

```text
server/middleware/authMiddleware.js
```

Protects private routes by verifying JWT tokens.

```text
server/helpers/normalizeUrl.js
```

Normalizes URLs before duplicate checking.

```text
server/data/
```

Stores JSON-backed data for users and clips.

---

## API Routes

### Auth Routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in an existing user |
| GET | `/api/auth/me` | Get current logged-in user |

### Clip Routes

All clip routes are protected and require a JWT token.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/clips` | Get all clips for logged-in user |
| GET | `/api/clips/:id` | Get one clip |
| POST | `/api/clips` | Create a clip |
| POST | `/api/clips/check-duplicate` | Check duplicate URL |
| PATCH | `/api/clips/:id` | Update a clip |
| DELETE | `/api/clips/:id` | Delete a clip |

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/stenJJ/springboard-capstone.git
cd springboard-capstone
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 3. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Test Instructions

From the backend folder:

```bash
cd server
npm test
```

The tests cover:

- API health check
- user registration
- user login
- protected clip creation
- duplicate URL prevention
- user-specific clip retrieval

---

## MVP User Flow

1. User registers or logs in.
2. User pastes a video URL.
3. User adds title, status, tags, and notes.
4. User saves the clip.
5. Backend normalizes the URL.
6. Backend checks whether the user already saved that normalized URL.
7. User can view saved clips.
8. User can search/filter clips.
9. User can edit or delete clips.
10. User can log out.

---

## Future Improvements

- Replace JSON file storage with PostgreSQL
- Add Prisma or another ORM
- Add deployed production database
- Add frontend tests
- Add TypeScript
- Add yt-dlp metadata extraction
- Add browser extension integration
- Add local file duplicate detection
- Add AI tagging and summarization
- Add download queue management