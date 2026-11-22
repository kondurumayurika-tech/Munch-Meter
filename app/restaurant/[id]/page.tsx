"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type Restaurant = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function ReviewCard({ review, latest = false }: { review: Review; latest?: boolean }) {
  return (
    <article className={`rounded-xl border p-5 ${latest ? "border-[#e4cfc4] bg-[#f1e9e2]" : "border-[#e5e0d6] bg-[#fcfbf8]"}`}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm tracking-[0.12em] text-[#b84c32]" aria-label={`${review.rating} out of 5 stars`}>
          {String.fromCharCode(9733).repeat(review.rating)}{String.fromCharCode(9734).repeat(5 - review.rating)}
        </span>
        <time className="text-xs text-[#77736c]" dateTime={review.createdAt}>
          {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(review.createdAt))}
        </time>
      </div>
      <p className="leading-7 text-[#36332f]">{review.comment}</p>
    </article>
  );
}

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/restaurants/${id}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load this restaurant.");
        return result as Restaurant;
      })
      .then((result) => { if (active) setRestaurant(result); })
      .catch((reason: Error) => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [id]);

  if (error) {
    return <main className="mx-auto max-w-[560px] px-6 py-20"><p className="text-sm text-[#b84c32]">{error}</p></main>;
  }

  if (!restaurant) {
    return <main className="mx-auto max-w-[560px] px-6 py-20"><p className="text-sm text-[#77736c]">Loading restaurant&hellip;</p></main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-[560px] px-6 py-12 sm:py-20">
      <header className="border-b border-[#e5e0d6] pb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#77736c]">Munch Meter &middot; Restaurant</p>
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{restaurant.name}</h1>
        <p className="mt-3 text-sm text-[#77736c]">{restaurant.cuisine} <span className="px-1">&middot;</span> {restaurant.area}</p>
      </header>

      <section className="flex items-end gap-3 py-9" aria-label="Rating summary">
        <p className="font-serif text-6xl leading-none tracking-tight">{restaurant.averageRating ?? "No rating"}</p>
        <p className="pb-1 text-sm text-[#77736c]">{restaurant.totalReviews} {restaurant.totalReviews === 1 ? "review" : "reviews"}</p>
      </section>

      {restaurant.latestReview ? (
        <section className="space-y-3" aria-labelledby="latest-heading">
          <h2 id="latest-heading" className="text-xs uppercase tracking-[0.16em] text-[#77736c]">Latest review</h2>
          <ReviewCard review={restaurant.latestReview} latest />
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-[#d9d2c7] px-5 py-8 text-center">
          <h2 className="font-serif text-2xl">Be the first to leave a review.</h2>
          <p className="mt-2 text-sm text-[#77736c]">Tell the next person what you thought.</p>
        </section>
      )}

      {restaurant.reviews.length > 0 && (
        <section className="mt-9 space-y-3" aria-labelledby="older-heading">
          <h2 id="older-heading" className="text-xs uppercase tracking-[0.16em] text-[#77736c]">More reviews</h2>
          {restaurant.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </section>
      )}

      <footer className="mt-10 border-t border-[#e5e0d6] pt-6">
        <Link className="inline-flex min-h-11 items-center text-sm font-medium text-[#b84c32] underline decoration-[#d8a392] underline-offset-4" href={`/review/${id}`}>
          Write a review <span aria-hidden="true" className="ml-2">&rarr;</span>
        </Link>
      </footer>
    </main>
  );
}

