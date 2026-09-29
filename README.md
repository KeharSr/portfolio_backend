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
| Images and files | `POST /media` (upload), `GET /media` (`?folder=`, `?type=image\|document`), `GET/PATCH/DELETE /media/:id` (all admin). Files are served publicly at `/uploads/...` |

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

## Images, icons, avatars and files

Upload a file first, then save the returned `url` on whichever record should show it.

```bash
# 1. Upload (multipart/form-data). Use "file" for one file or "files" for up to 10.
curl -X POST http://localhost:5000/api/media \
  -H "Authorization: Bearer $TOKEN" \
  -F file=@me.jpg -F folder=avatars -F alt="My photo"
# → { "data": { "id": "...", "url": "http://localhost:5000/uploads/avatars/<uuid>.jpg",
#               "path": "/uploads/avatars/<uuid>.jpg", "width": 800, "height": 800, ... } }

# 2. Attach it
curl -X PATCH http://localhost:5000/api/profile -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"avatarUrl": "http://localhost:5000/uploads/avatars/<uuid>.jpg"}'
```

From a browser admin panel:

```js
const form = new FormData();
form.append('file', fileInput.files[0]);
form.append('folder', 'projects');
const res = await fetch(`${API}/media`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
const { data } = await res.json(); // data.url → use as imageUrl
```

- **Allowed types:** PNG, JPEG, GIF, WebP, AVIF, ICO, SVG and PDF (for a resume). The type is checked from the file's bytes, not its name. SVGs containing scripts or event handlers are rejected.
- **Size limit:** `MAX_UPLOAD_MB` (default 5 MB) per file.
- **`folder`** is optional and only organizes files. Suggested values: `avatars`, `icons`, `logos`, `projects`, `gallery`, `documents`.
- **Serving:** files are public at `/uploads/<folder>/<uuid>.<ext>`, with CORS and `Cross-Origin-Resource-Policy: cross-origin`, so a frontend on another domain can show them. They are cached for a year, which is safe because every upload gets a new name.
- **Fields that take an uploaded URL:**

  | Model | Fields |
  |---|---|
  | Profile | `avatarUrl`, `coverUrl`, `resumeUrl` |
  | Projects | `imageUrl`, `gallery[]` |
  | Experience / Education | `logoUrl` |
  | Certifications | `imageUrl` |
  | Testimonials | `avatarUrl` |
  | Services, custom sections, section items | `icon`, `imageUrl` |
  | Skills, social links | `icon` |

  `icon` fields accept either an uploaded file URL or an icon-library name such as `"FaGithub"`. The frontend decides which one it is, for example by checking whether the value starts with `http` or `/`.
- **Absolute URLs:** set `PUBLIC_URL` (e.g. `https://api.example.com`) in production so URLs use your real domain. Behind a proxy, also set `TRUST_PROXY=true`.
- **Deleting** a media record also deletes the file. Records that still point at its URL are not changed.
- **Hosting:** files are saved to local disk (`UPLOAD_DIR`). On hosts with temporary disks, such as Render's free tier or Heroku, use a persistent volume. Otherwise replace `src/storage/local.storage.js` with an S3 or Cloudinary module that has the same `save` / `remove` / `publicPath` functions.

## Responses

```json
{ "success": true, "message": "Project created", "data": { ... } }
{ "success": false, "message": "Validation failed", "details": [{ "path": "title", "message": "..." }] }
```
