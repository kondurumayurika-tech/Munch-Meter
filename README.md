# Munch Meter

A small restaurant review app for Ludhiana Burrito, built with Next.js 15, Tailwind CSS, and Neon Postgres. The backend stores restaurant and review facts; it computes the average and review count when the restaurant page is requested.

## Run locally

1. Install Node.js 20 or newer.
2. Create `.env.local` in this folder with `DATABASE_URL=your-Neon-connection-string`.
3. Run `npm run db:setup` to create and seed the two database tables.
4. Run `npm run dev` and open <http://localhost:3000>.

Never commit `.env.local`; it contains the database password and is ignored by `.gitignore`.

## Routes

- `/restaurant/1` shows the restaurant summary, latest review, and older reviews.
- `/review/1` collects a rating and comment.
- `GET /api/restaurants/1` returns the restaurant page data, with the average and count computed in SQL.
- `POST /api/reviews` validates and saves one review.

## Database

`db/schema.sql` creates the `restaurants` and `reviews` tables. `db/seed.sql` adds Ludhiana Burrito and three sample reviews. No average or latest-review value is stored; those are computed when the API is called.

