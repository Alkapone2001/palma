# Palma 5 Restaurant Website

Next.js app for the Palma 5 restaurant, room booking, table booking, and admin dashboard.

## Local Development

```bash
npm install
npm run dev
```

Or run the app with local MongoDB through Docker:

```bash
docker compose up --build
```

## Deploy To Vercel

This app can run on Vercel, but the Docker Compose MongoDB service must be replaced by a hosted MongoDB database such as MongoDB Atlas.

1. Create a MongoDB Atlas cluster and copy its connection string.
2. Import this Git repository into Vercel as a Next.js project.
3. Set the production environment variables from `.env.example` in Vercel Project Settings.
4. Create a Vercel Blob store and connect it to the project if admin room photo uploads should persist in production.
5. Deploy.

Required production variables:

```bash
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
PALMA_ADMIN_PASSWORD=
PALMA_ADMIN_SESSION_TOKEN=
PALMA_AGENCY_PASSWORD=
PALMA_AGENCY_SESSION_TOKEN=
```

Recommended production variables:

```bash
BLOB_READ_WRITE_TOKEN=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
RESERVATION_EMAIL_TO=
RESERVATION_EMAIL_FROM=
```

## Production Notes

Vercel does not run `docker-compose.yml`; it builds the Next.js app directly from `package.json`.

Room image uploads use Vercel Blob when `BLOB_READ_WRITE_TOKEN` is configured. Without that variable, uploads fall back to `public/uploads/rooms`, which is only suitable for local development.

Use strong, unique `PALMA_ADMIN_PASSWORD`, `PALMA_ADMIN_SESSION_TOKEN`, `PALMA_AGENCY_PASSWORD`, and `PALMA_AGENCY_SESSION_TOKEN` values in production. The agency login can only access the shared room calendar.
