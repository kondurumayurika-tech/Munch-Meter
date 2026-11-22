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
    WITH ordered_reviews AS MATERIALIZED (
      SELECT
        id,
        rating,
        comment,
        created_at,
        ROW_NUMBER() OVER (ORDER BY created_at DESC, id DESC) AS position
      FROM reviews
      WHERE restaurant_id = ${restaurantId}
    ), review_summary AS (
      SELECT
        ROUND(AVG(rating)::numeric, 1)::float AS average_rating,
        COUNT(*)::int AS total_reviews
      FROM ordered_reviews
    )
    SELECT
      restaurant.name,
      restaurant.cuisine,
      restaurant.area,
      review_summary.average_rating AS "averageRating",
      review_summary.total_reviews AS "totalReviews",
      (
        SELECT jsonb_build_object(
          'id', id,
          'rating', rating,
          'comment', comment,
          'createdAt', created_at
        )
        FROM ordered_reviews
        WHERE position = 1
      ) AS "latestReview",
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', id,
              'rating', rating,
              'comment', comment,
              'createdAt', created_at
            )
            ORDER BY position
          )
          FROM ordered_reviews
          WHERE position > 1
        ),
        '[]'::jsonb
      ) AS reviews
    FROM restaurants AS restaurant
    CROSS JOIN review_summary
    WHERE restaurant.id = ${restaurantId}
  `;

  if (restaurants.length === 0) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurant = restaurants[0];

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating: restaurant.averageRating,
    totalReviews: restaurant.totalReviews,
    latestReview: restaurant.latestReview,
    reviews: restaurant.reviews,
  });
}

