# ClipVault Implementation Plan

## Goal

Build a working MVP of ClipVault, a full-stack media URL organizer.

The app should allow a user to:

1. Register or log in.
2. Save a video/media URL.
3. Prevent duplicate URLs from being saved.
4. View saved clips.
5. Edit clip details.
6. Delete clips.
7. Search or filter saved clips.

---

## MVP Scope

The first version will focus on core functionality.

### Required MVP Features

- User registration
- User login
- Protected routes
- Add clip form
- Duplicate URL check
- Clip library page
- Edit clip
- Delete clip
- Basic search/filter
- Clean README

### Deferred Stretch Goals

These are not required for graduation:

- yt-dlp metadata extraction
- actual downloading
- browser extension
- local file scanning
- AI tagging
- video hash comparison
- deployment, if time runs out

---

## Planned Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express
- REST API
- JWT or simple auth token approach
- PostgreSQL if time allows

### Database

Primary plan:

- PostgreSQL

Backup plan if time is short:

- JSON file or in-memory mock data for demo purposes

---

## Build Order

## 1. Project Setup

Set up the repo structure:

```text
springboard-capstone/
  client/
  server/
  proposal.md
  frontend-spec.md
  database-model.md
  api-spec.md
  implementation-plan.md
  README.md