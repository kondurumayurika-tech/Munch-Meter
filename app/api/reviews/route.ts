import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

type ReviewInput = {
  restaurantId?: unknown;
  rating?: unknown;
  comment?: unknown;
};

export async function POST(request: Request) {
  let body: ReviewInput;

  try {
    const parsed: unknown = await request.json();
    body = parsed && typeof parsed === "object" ? (parsed as ReviewInput) : {};
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!Number.isInteger(body.rating) || Number(body.rating) < 1 || Number(body.rating) > 5) {
    return NextResponse.json({ error: "Rating must be a whole number from 1 to 5." }, { status: 400 });
  }

  if (typeof body.comment !== "string" || body.comment.trim().length === 0) {
    return NextResponse.json({ error: "Comment must not be empty." }, { status: 400 });
  }

  const restaurantId = Number(body.restaurantId);
  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json({ error: "Restaurant does not exist." }, { status: 400 });
  }

  const sql = getSql();
  const restaurant = await sql`SELECT id FROM restaurants WHERE id = ${restaurantId} LIMIT 1`;
  if (restaurant.length === 0) {
    return NextResponse.json({ error: "Restaurant does not exist." }, { status: 400 });
  }

  const inserted = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${Number(body.rating)}, ${body.comment.trim()})
    RETURNING id
  `;

  return NextResponse.json({ success: true, reviewId: inserted[0].id }, { status: 201 });
}

