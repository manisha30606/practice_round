# CivicTrack

A civic issue reporting and resolution management web platform for citizens, municipal administrators and field workers.

## Stack

- Web: Next.js App Router, React, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod, Leaflet, Recharts
- API: Express, TypeScript, Mongoose, JWT access/refresh sessions, Socket.IO
- Infrastructure: pnpm workspaces, MongoDB, Docker Compose, Vitest, Supertest, GitHub Actions

## Prerequisites

- Node.js 20.19+ (or a compatible current Node 22 release)
- pnpm 10+
- MongoDB 7+ (or Docker)

## Local setup

```bash
cp .env.example .env
# Replace both JWT secrets with unique random values.
pnpm install
docker compose up -d mongo
pnpm --filter @civictrack/api db:seed
pnpm dev
```

Open:
- Web: http://localhost:3000
- API health: http://localhost:4000/health
- API base: http://localhost:4000/api/v1

Demo accounts created by the seed command (password for all: `CivicTrack!2026`):
- `citizen@civictrack.local`
- `admin@civictrack.local`
- `worker@civictrack.local`

Change these credentials before exposing the application to a network.

## Docker

```bash
cp .env.example .env
# Edit secrets in .env
docker compose up --build
```

The Docker setup starts MongoDB, the API and the web application. The seed script is intended for local development and can be run with `pnpm db:seed` from a local checkout.

## Workspace commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm db:seed
```

## Product workflows

- Citizens create reports with category, location, description and optional image evidence.
- Administrators review reports, set priority, route them to a department and assign field workers.
- Workers accept assignments, post progress and submit resolution evidence.
- Complaint activity is recorded as an append-only timeline.
- Socket.IO broadcasts role-scoped updates; REST remains the source of truth.

## Security notes

- Passwords are hashed with bcrypt.
- Access tokens are short-lived. Refresh tokens are stored as hashes and rotated on use.
- API routes enforce authentication and role checks on the server.
- Uploads are restricted by MIME type and size. For production, replace local disk storage with a private object-storage bucket and signed delivery URLs.
- Configure `WEB_ORIGIN`, secrets, HTTPS, reverse proxy limits, backups and observability before production deployment.

## Scope notes

This repository is a runnable engineering baseline rather than a claim of municipal procurement readiness. Production deployment should add operational policies for identity verification, data retention, moderation, legal notices, backups, incident response and geographic service boundaries. Map tiles use OpenStreetMap; respect its tile usage policy.

## API documentation

See [`docs/API.md`](docs/API.md) and import [`docs/civictrack.postman_collection.json`](docs/civictrack.postman_collection.json) into Postman.

## Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
