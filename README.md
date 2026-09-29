# Portfolio Backend

A REST API for a dynamic portfolio website, built with **Node.js (Express 5)**, **PostgreSQL** and **Prisma**.
From an admin panel you can edit the profile, site text and every section of the portfolio.

## Architecture

The code follows a **route → controller → service → repository** layout:

```
prisma/
  schema.prisma          # database models
  seed.js                # admin user + starter content
src/
  config/                # env + Prisma client
  routes/                # URL → middleware → controller wiring
  controllers/           # HTTP only: read req, call service, send response
  services/              # business rules (visibility, slugs, date checks, auth)
  repositories/          # the only layer that talks to Prisma
  validators/            # zod request schemas
  middlewares/           # auth, validation, error handling
  utils/
  app.js / server.js
```

Most sections share generic `BaseRepository`, `BaseService` and `BaseController` classes and a `crudRouter`.
Resources that need extra behavior extend them. For example, projects and sections generate slugs, and experience and education validate their dates.

## Getting started

```bash
cp .env.example .env          # set DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev        # create tables
npm run seed                  # create the admin user (ADMIN_EMAIL / ADMIN_PASSWORD) and sample content
npm run dev                   # http://localhost:5000/api
```

Other scripts: `npm start`, `npm run prisma:deploy` (production migrations), `npm run prisma:studio`.

## Auth

- `POST /api/auth/register` works only when no admin exists yet, or when `ALLOW_REGISTRATION=true`.
- `POST /api/auth/login` returns `{ token }`. Send it as `Authorization: Bearer <token>`.
- `GET /api/auth/me` and `PATCH /api/auth/password` (`{ currentPassword, newPassword }`).

`GET` endpoints are **public** and return only records with `isVisible: true`.
If the request includes a valid admin token, hidden records are returned as well, which the admin panel needs.
All write endpoints require the token.

## Endpoints (all under `/api`)

| Resource | Routes |
|---|---|
| Everything at once | `GET /portfolio`: profile, settings and all visible sections in one response |
| Profile (single record) | `GET /profile`, `PUT`/`PATCH /profile` (created on first save) |
| Site text / settings | `GET /settings` (`?format=map` → `{ key: value }`), `PUT /settings` (bulk `{ key: value }`), `GET/PUT/DELETE /settings/:key` (`{ value, description? }`; value can be any JSON) |
| Social links | `/social-links` |
| Skills | `/skills` (`?category=`) |
| Experience | `/experiences` |
| Education | `/educations` |
| Projects | `/projects` (`?category=`, `?isFeatured=true`), `GET /projects/slug/:slug` |
| Certifications | `/certifications` |
| Services | `/services` |
| Testimonials | `/testimonials` |
| Custom sections | `/sections` (`?type=`), `GET /sections/slug/:slug`, items at `/sections/:sectionId/items` |
| Contact messages | `POST /messages` (public contact form); `GET /messages` (`?isRead=false`), `GET /messages/:id`, `PATCH /messages/:id/read`, `DELETE /messages/:id` (admin) |

Each CRUD resource supports:

```
GET    /resource            list (sorted by `order`)
GET    /resource/:id
POST   /resource            create
PATCH  /resource/:id        partial update (PUT works too)
DELETE /resource/:id
PATCH  /resource/reorder    body: [{ "id": "...", "order": 0 }, ...]
```

### Custom sections

Use custom sections for anything the fixed models don't cover, such as "Achievements", "Hobbies" or "Publications":

```json
POST /api/sections
{ "title": "Achievements", "subtitle": "Things I'm proud of", "content": "Intro text…", "type": "grid", "data": { "columns": 3 } }

POST /api/sections/:sectionId/items
{ "title": "Won XYZ Hackathon", "description": "…", "date": "2024-05-01", "tags": ["2024"], "link": "https://…", "data": { "any": "extra fields" } }
```

`type` and `data` are free-form, so the frontend decides how to render each section.

## Responses

```json
{ "success": true, "message": "Project created", "data": { ... } }
{ "success": false, "message": "Validation failed", "details": [{ "path": "title", "message": "..." }] }
```
