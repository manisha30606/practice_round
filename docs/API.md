# API reference

Base URL: `/api/v1`

All successful responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "error": { "message": "...", "code": "..." } }`.

## Authentication
- `POST /auth/register` — citizen registration
- `POST /auth/login` — login; refresh token is set as an HTTP-only cookie
- `POST /auth/refresh` — rotate refresh token
- `POST /auth/logout` — revoke refresh session
- `GET /auth/me` — current user

## Complaints
- `GET /complaints` — role-aware paginated list; query: `page`, `limit`, `status`, `category`, `priority`, `q`
- `POST /complaints` — citizen creates complaint (multipart form; `images` optional)
- `GET /complaints/:id` — detail and timeline
- `PATCH /complaints/:id/status` — authorized status transition
- `POST /complaints/:id/votes` — toggle citizen upvote
- `POST /complaints/:id/reopen` — citizen reopens a resolved report with a reason
- `GET /complaints/nearby?lat=&lng=&radiusKm=` — nearby public reports

## Assignments
- `POST /assignments` — admin assigns a complaint to a worker
- `GET /assignments/mine` — worker assignments
- `PATCH /assignments/:id/respond` — worker accepts or rejects
- `PATCH /assignments/:id/progress` — worker adds progress note
- `PATCH /assignments/:id/complete` — worker submits completion evidence

## Departments and operations
- `GET/POST /departments`
- `GET /users?role=worker`
- `GET /analytics/overview`
- `GET /notifications`
- `PATCH /notifications/:id/read`
- `POST /complaints/:id/comments`
- `POST /complaints/:id/feedback`

Protected endpoints require `Authorization: Bearer <access-token>`, except login, register and refresh.
