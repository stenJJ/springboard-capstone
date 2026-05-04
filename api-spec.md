# ClipVault API Specifications

## Project Summary

ClipVault is a full-stack media URL organizer. Users can register, log in, save video/media URLs, organize clips with statuses and tags, and avoid saving duplicate URLs.

This document outlines the planned API endpoints for communication between the React frontend and the Express backend.

---

## API Style

This project will use a REST-style API.

Base path:

```text
/api
```

Example:

```text
/api/clips
```

---

## Authentication

Protected routes require the user to be logged in.

The frontend will send an auth token with protected requests.

Example header:

```text
Authorization: Bearer <token>
```

If the user is not logged in, protected routes should return:

```json
{
  "error": "Unauthorized"
}
```

---

# 1. Main Route

## GET `/api`

### Purpose

Checks that the backend API is running.

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "message": "ClipVault API is running"
}
```

---

# 2. Auth Routes

## POST `/api/auth/register`

### Purpose

Creates a new user account.

### Request Body

```json
{
  "username": "sten",
  "email": "sten@example.com",
  "password": "password123"
}
```

### Successful Response

Status:

```text
201 Created
```

Example:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "sten",
    "email": "sten@example.com"
  }
}
```

### Error Responses

Status:

```text
400 Bad Request
```

Possible reasons:

- Missing required fields
- Invalid email
- Password too short
- Username already exists
- Email already exists

Example:

```json
{
  "error": "Username already exists"
}
```

---

## POST `/api/auth/login`

### Purpose

Logs in an existing user.

### Request Body

```json
{
  "usernameOrEmail": "sten",
  "password": "password123"
}
```

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "sten",
    "email": "sten@example.com"
  }
}
```

### Error Responses

Status:

```text
400 Bad Request
```

Possible reasons:

- Missing username/email
- Missing password

Status:

```text
401 Unauthorized
```

Possible reasons:

- Incorrect username/email
- Incorrect password

Example:

```json
{
  "error": "Invalid login credentials"
}
```

---

## GET `/api/auth/me`

### Purpose

Gets the currently logged-in user's basic profile information.

### Protected?

Yes.

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "user": {
    "id": 1,
    "username": "sten",
    "email": "sten@example.com"
  }
}
```

### Error Response

Status:

```text
401 Unauthorized
```

Example:

```json
{
  "error": "Unauthorized"
}
```

---

# 3. Clip Routes

## GET `/api/clips`

### Purpose

Gets all clips saved by the logged-in user.

### Protected?

Yes.

### Optional Query Parameters

| Query | Example | Purpose |
| --- | --- | --- |
| `search` | `/api/clips?search=react` | Search by title, URL, notes, or creator |
| `status` | `/api/clips?status=watch_later` | Filter by status |
| `tag` | `/api/clips?tag=coding` | Filter by tag |
| `sort` | `/api/clips?sort=newest` | Sort results |

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "clips": [
    {
      "id": 15,
      "url": "https://www.youtube.com/watch?v=abc123",
      "normalized_url": "https://www.youtube.com/watch?v=abc123",
      "title": "React Router Tutorial",
      "creator": "Example Channel",
      "thumbnail_url": "https://example.com/thumbnail.jpg",
      "duration": "12:45",
      "status": "watch_later",
      "notes": "Useful for routing review.",
      "tags": ["coding", "react"],
      "created_at": "2026-05-03T12:10:00Z",
      "updated_at": "2026-05-03T12:10:00Z"
    }
  ]
}
```

### Error Responses

Status:

```text
401 Unauthorized
```

Example:

```json
{
  "error": "Unauthorized"
}
```

---

## GET `/api/clips/:id`

### Purpose

Gets one saved clip by ID.

### Protected?

Yes.

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "clip": {
    "id": 15,
    "url": "https://www.youtube.com/watch?v=abc123",
    "normalized_url": "https://www.youtube.com/watch?v=abc123",
    "title": "React Router Tutorial",
    "creator": "Example Channel",
    "thumbnail_url": "https://example.com/thumbnail.jpg",
    "duration": "12:45",
    "status": "watch_later",
    "notes": "Useful for routing review.",
    "tags": ["coding", "react"],
    "created_at": "2026-05-03T12:10:00Z",
    "updated_at": "2026-05-03T12:10:00Z"
  }
}
```

### Error Responses

Status:

```text
401 Unauthorized
```

User is not logged in.

Status:

```text
404 Not Found
```

Clip does not exist or does not belong to the logged-in user.

Example:

```json
{
  "error": "Clip not found"
}
```

---

## POST `/api/clips`

### Purpose

Creates a new saved clip.

The backend should normalize the submitted URL and check whether the logged-in user already saved it.

### Protected?

Yes.

### Request Body

```json
{
  "url": "https://www.youtube.com/watch?v=abc123&t=30s",
  "title": "React Router Tutorial",
  "creator": "Example Channel",
  "status": "watch_later",
  "notes": "Useful for routing review.",
  "tags": ["coding", "react"]
}
```

### Successful Response

Status:

```text
201 Created
```

Example:

```json
{
  "clip": {
    "id": 15,
    "url": "https://www.youtube.com/watch?v=abc123&t=30s",
    "normalized_url": "https://www.youtube.com/watch?v=abc123",
    "title": "React Router Tutorial",
    "creator": "Example Channel",
    "status": "watch_later",
    "notes": "Useful for routing review.",
    "tags": ["coding", "react"],
    "created_at": "2026-05-03T12:10:00Z",
    "updated_at": "2026-05-03T12:10:00Z"
  }
}
```

### Error Responses

Status:

```text
400 Bad Request
```

Possible reasons:

- Missing URL
- Invalid URL
- Invalid status

Example:

```json
{
  "error": "A valid URL is required"
}
```

Status:

```text
401 Unauthorized
```

User is not logged in.

Status:

```text
409 Conflict
```

The URL has already been saved by this user.

Example:

```json
{
  "error": "This clip is already saved",
  "existingClipId": 15
}
```

---

## PATCH `/api/clips/:id`

### Purpose

Updates one saved clip.

### Protected?

Yes.

### Request Body

All fields are optional. The user can update one or more fields.

```json
{
  "title": "Updated React Router Tutorial",
  "creator": "Example Channel",
  "status": "watched",
  "notes": "Finished watching this.",
  "tags": ["coding", "react", "frontend"]
}
```

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "clip": {
    "id": 15,
    "url": "https://www.youtube.com/watch?v=abc123&t=30s",
    "normalized_url": "https://www.youtube.com/watch?v=abc123",
    "title": "Updated React Router Tutorial",
    "creator": "Example Channel",
    "status": "watched",
    "notes": "Finished watching this.",
    "tags": ["coding", "react", "frontend"],
    "updated_at": "2026-05-03T12:30:00Z"
  }
}
```

### Error Responses

Status:

```text
400 Bad Request
```

Invalid update data.

Status:

```text
401 Unauthorized
```

User is not logged in.

Status:

```text
404 Not Found
```

Clip does not exist or does not belong to the logged-in user.

---

## DELETE `/api/clips/:id`

### Purpose

Deletes one saved clip.

### Protected?

Yes.

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "message": "Clip deleted"
}
```

### Error Responses

Status:

```text
401 Unauthorized
```

User is not logged in.

Status:

```text
404 Not Found
```

Clip does not exist or does not belong to the logged-in user.

---

# 4. Tag Routes

## GET `/api/tags`

### Purpose

Gets all tags created by the logged-in user.

### Protected?

Yes.

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "tags": [
    {
      "id": 3,
      "name": "coding",
      "created_at": "2026-05-03T12:15:00Z"
    },
    {
      "id": 4,
      "name": "anime",
      "created_at": "2026-05-03T12:16:00Z"
    }
  ]
}
```

### Error Responses

Status:

```text
401 Unauthorized
```

User is not logged in.

---

## POST `/api/tags`

### Purpose

Creates a new tag for the logged-in user.

### Protected?

Yes.

### Request Body

```json
{
  "name": "coding"
}
```

### Successful Response

Status:

```text
201 Created
```

Example:

```json
{
  "tag": {
    "id": 3,
    "name": "coding",
    "created_at": "2026-05-03T12:15:00Z"
  }
}
```

### Error Responses

Status:

```text
400 Bad Request
```

Missing or invalid tag name.

Status:

```text
401 Unauthorized
```

User is not logged in.

Status:

```text
409 Conflict
```

Tag already exists for this user.

Example:

```json
{
  "error": "Tag already exists"
}
```

---

## DELETE `/api/tags/:id`

### Purpose

Deletes one tag.

### Protected?

Yes.

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "message": "Tag deleted"
}
```

### Error Responses

Status:

```text
401 Unauthorized
```

User is not logged in.

Status:

```text
404 Not Found
```

Tag does not exist or does not belong to the logged-in user.

---

# 5. Metadata Route

## POST `/api/metadata`

### Purpose

Attempts to get metadata from a submitted URL.

For the MVP, this route can be optional. If metadata extraction is not finished in time, the app can still allow manual title and creator entry.

### Protected?

Yes.

### Request Body

```json
{
  "url": "https://www.youtube.com/watch?v=abc123"
}
```

### Successful Response

Status:

```text
200 OK
```

Example:

```json
{
  "metadata": {
    "title": "React Router Tutorial",
    "creator": "Example Channel",
    "thumbnail_url": "https://example.com/thumbnail.jpg",
    "duration": "12:45",
    "source_platform": "youtube"
  }
}
```

### Error Responses

Status:

```text
400 Bad Request
```

Invalid URL.

Status:

```text
401 Unauthorized
```

User is not logged in.

Status:

```text
422 Unprocessable Entity
```

Metadata could not be extracted from this URL.

Example:

```json
{
  "error": "Metadata could not be extracted. Please enter details manually."
}
```

---

# 6. Duplicate Check Route

## POST `/api/clips/check-duplicate`

### Purpose

Checks whether a URL has already been saved by the logged-in user before submitting the full clip form.

This is useful for showing a warning as soon as the user pastes a URL.

### Protected?

Yes.

### Request Body

```json
{
  "url": "https://www.youtube.com/watch?v=abc123&t=30s"
}
```

### Successful Response: No Duplicate

Status:

```text
200 OK
```

Example:

```json
{
  "duplicate": false
}
```

### Successful Response: Duplicate Found

Status:

```text
200 OK
```

Example:

```json
{
  "duplicate": true,
  "existingClip": {
    "id": 15,
    "title": "React Router Tutorial",
    "url": "https://www.youtube.com/watch?v=abc123",
    "status": "watch_later"
  }
}
```

### Error Responses

Status:

```text
400 Bad Request
```

Invalid URL.

Status:

```text
401 Unauthorized
```

User is not logged in.

---

# 7. Planned Frontend Usage

## Register Flow

Frontend route:

```text
/register
```

Backend request:

```text
POST /api/auth/register
```

After success:

```text
Redirect to /dashboard
```

---

## Login Flow

Frontend route:

```text
/login
```

Backend request:

```text
POST /api/auth/login
```

After success:

```text
Redirect to /dashboard
```

---

## Add Clip Flow

Frontend route:

```text
/clips/new
```

Backend requests:

```text
POST /api/clips/check-duplicate
POST /api/clips
```

Possible optional request:

```text
POST /api/metadata
```

After success:

```text
Redirect to /clips
```

---

## Clip Library Flow

Frontend route:

```text
/clips
```

Backend request:

```text
GET /api/clips
```

With optional filters:

```text
GET /api/clips?search=react&status=watch_later&tag=coding&sort=newest
```

---

## Edit Clip Flow

Frontend route:

```text
/clips/:id/edit
```

Backend requests:

```text
GET /api/clips/:id
PATCH /api/clips/:id
```

---

## Delete Clip Flow

Frontend route:

```text
/clips/:id
```

Backend request:

```text
DELETE /api/clips/:id
```

---

# 8. MVP Endpoint Priority

For the first working version, the most important endpoints are:

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `GET /api/auth/me`
4. `GET /api/clips`
5. `POST /api/clips`
6. `PATCH /api/clips/:id`
7. `DELETE /api/clips/:id`

If time is limited, tags can be simplified into a plain `category` or `tags` field on the `clips` table instead of separate tag routes.

---

# 9. Stretch Goal Endpoints

These endpoints are useful but not required for the MVP:

| Endpoint | Purpose |
| --- | --- |
| `POST /api/metadata` | Fetch metadata from a URL |
| `POST /api/clips/check-duplicate` | Check duplicates before form submission |
| `GET /api/tags` | Get saved tags |
| `POST /api/tags` | Create saved tags |
| `DELETE /api/tags/:id` | Delete saved tags |
| `POST /api/downloads` | Future route for download queue |
| `GET /api/downloads` | Future route for viewing downloads |
| `POST /api/file-checks` | Future route for checking local file hashes |

---

# 10. Possible API Challenges

## Authentication

Protected routes need to verify that the user is logged in before returning private data.

## Duplicate URLs

The backend needs to normalize URLs before checking for duplicates.

Example:

```text
https://www.youtube.com/watch?v=abc123
https://www.youtube.com/watch?v=abc123&t=30s
```

These should be treated as the same saved clip.

## Invalid URLs

The API needs to reject invalid URLs instead of saving broken data.

## User-Owned Data

Users should only be able to view, edit, or delete their own clips and tags.

## Metadata Extraction

Metadata extraction may fail depending on the platform. For the MVP, users can manually enter clip details if metadata is unavailable.

---

# Final API Goal

The API should allow the frontend to complete this main user flow:

1. User registers or logs in.
2. User saves a video/media URL.
3. API checks if the URL is already saved.
4. If it is new, API saves it.
5. User can view all saved clips.
6. User can search or filter clips.
7. User can edit or delete saved clips.
