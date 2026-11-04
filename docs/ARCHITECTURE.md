# Architecture

```text
Browser (Next.js)
  ├── TanStack Query / Axios ── REST ── Express API
  ├── Socket.IO client ─────────────── Socket.IO server
  └── Leaflet / OpenStreetMap

Express API
  ├── Routes → validation → auth/role middleware
  ├── Controllers → domain services → repositories/models
  ├── Socket event publisher
  └── Local upload adapter

MongoDB
  ├── users
  ├── complaints
  ├── departments
  ├── assignments
  ├── comments
  ├── notifications
  ├── activity_logs
  └── feedback
```

## Domain boundaries

- **Identity** owns credentials, roles and refresh-session rotation.
- **Complaints** owns intake, status transitions, geographic fields and public discovery.
- **Assignments** owns dispatch and worker execution.
- **Departments** owns municipal routing units.
- **Activity** records immutable domain events.
- **Notifications** stores user-visible messages and emits socket events.
- **Analytics** derives operational metrics from complaint records.

## Data integrity

MongoDB references are used for cross-aggregate relationships. Critical state changes occur in services, not controllers. Each transition writes an activity entry and notification in the same service flow. For high-volume production use, use MongoDB transactions on a replica set and an outbox pattern to guarantee delivery of socket events.

## Authentication

The browser stores the access token in memory. The refresh token is an HTTP-only, SameSite cookie. Refresh tokens are stored as SHA-256 hashes and rotated. Configure HTTPS and secure cookies in production.
