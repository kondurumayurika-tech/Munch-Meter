# MunchMeter

A small restaurant-review application built from the approved PRD.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Neon Postgres via `@neondatabase/serverless`
- Raw SQL only

## Scope

- Write a review at `/review/1`
- View the restaurant and its reviews at `/restaurant/1`
- `POST /api/reviews`
- `GET /api/restaurants/[id]`

The only restaurant is Ludhiana Burrito (Indian, Sector 32). No authentication, listing/search, editing/deleting, photo uploads, ratings breakdown, ORM, or client-side state library.

## Local setup

Use Node.js 20 or newer and npm. Run `npm install`, then configure `DATABASE_URL` in `.env.local` before database setup.
