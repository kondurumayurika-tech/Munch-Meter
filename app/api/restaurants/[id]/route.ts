import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const sql = getSql();
  const restaurants = await sql`
    SELECT
      restaurant.id,
      restaurant.name,
      restaurant.cuisine,
      restaurant.area,
      ROUND(AVG(review.rating)::numeric, 1)::float AS "averageRating",
      COUNT(review.id)::int AS "totalReviews"
    FROM restaurants AS restaurant
    LEFT JOIN reviews AS review ON review.restaurant_id = restaurant.id
    WHERE restaurant.id = ${restaurantId}
    GROUP BY restaurant.id
  `;

  if (restaurants.length === 0) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurant = restaurants[0];
  const reviews = await sql`
    SELECT id, rating, comment, created_at AS "createdAt"
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC, id DESC
  `;
  const latestReview = reviews[0] ?? null;

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating: restaurant.averageRating,
    totalReviews: restaurant.totalReviews,
    latestReview,
    reviews: latestReview ? reviews.slice(1) : [],
  });
}

