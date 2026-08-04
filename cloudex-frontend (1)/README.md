# CLOudex — Frontend

React + Tailwind frontend wired to your existing Express backend (`New folder2`).
No backend files were touched — this only adds a `src/api/endpoints.js` layer
that calls the routes already defined in `routes/SignupRoute.js`.

## 1. Run the backend

```bash
cd "New folder2"
npm install
# make sure .env has DB_URL, JWT_SECRET, JWT_EXPIRES_IN, PORT (defaults to 9090)
npm run dev   # or: node index.js
```

Your backend's CORS config already allows `http://localhost:5173`, which is
this frontend's dev port — no changes needed there.

## 2. Run the frontend

```bash
npm install
cp .env.example .env   # edit VITE_API_URL if your backend isn't on localhost:9090
npm run dev
```

Open http://localhost:5173.

## What's wired up

Every route in `routes/SignupRoute.js` has a matching call in
`src/api/endpoints.js` and a page/action in the UI:

| Route | Used in |
|---|---|
| `POST /auth/api/signup` | Signup page |
| `POST /auth/api/login` | Login page |
| `PATCH /auth/api/updatepassword` | Settings page |
| `POST /auth/api/upload` | My Files → drag-and-drop uploader |
| `GET /auth/api/files` | My Files (paginated, sortable list) |
| `GET /auth/api/getall` | available via `api.getAllFiles()` |
| `GET /auth/api/search` | My Files search bar |
| `GET /auth/api/filestrashed` | Trash page |
| `DELETE /auth/api/delete/:id` | My Files → move to trash |
| `PATCH /auth/api/restore/:id` | Trash → restore |
| `DELETE /auth/api/trash/:id` | Trash → delete forever |
| `POST /auth/api/rename/:id` | My Files → rename |
| `GET /auth/api/download/:id` | My Files → download |
| `POST /auth/api/share/:id` | My Files → share link |
| `GET /auth/api/sharedonwload/:token` | Share modal → copyable public link |
| `GET /auth/api/apidashboard` | Dashboard page |

Auth: the JWT returned by signup/login is stored in `localStorage` and sent
as `Authorization: Bearer <token>` on every request (see
`src/api/axios.js`). A 401 response anywhere logs the user out automatically.

## Two backend quirks to know about (not changed, just flagged)

- `PATCH /updatepassword` isn't listed behind `verifyJwt` in
  `routes/SignupRoute.js`, so `req.user` will be `undefined` in that
  controller. The Settings page calls it exactly as defined; if it 500s,
  add `verifyJwt` to that route.
- `ShareFile.js` builds its `shareLink` using `/share/:token`, but the
  actual public download route is `/sharedonwload/:token`. The Share modal
  works around this by extracting the token and building the correct
  `/sharedonwload/:token` URL for the copy button, without touching the
  backend.
