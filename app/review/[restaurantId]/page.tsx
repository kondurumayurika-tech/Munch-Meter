"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RestaurantSummary = { name: string };

export default function ReviewPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("Restaurant");
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: RestaurantSummary) => { if (data.name) setRestaurantName(data.name); })
      .catch(() => undefined);
  }, [restaurantId]);

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId: Number(restaurantId), rating, comment }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error);
        return;
      }
      router.push(`/restaurant/${restaurantId}`);
    } catch {
      setError("Could not send your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-[560px] px-6 py-12 sm:py-20">
      <Link href={`/restaurant/${restaurantId}`} className="text-sm text-[#77736c] underline decoration-[#c9c1b6] underline-offset-4">&larr; Back to restaurant</Link>
      <header className="mt-10">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#77736c]">Write a review</p>
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{restaurantName}</h1>
      </header>

      <form className="mt-10 space-y-8" onSubmit={submitReview}>
        <fieldset>
          <legend className="mb-3 text-sm font-medium">Your rating</legend>
          <div className="flex gap-2" role="group" aria-label="Choose a rating from 1 to 5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                aria-pressed={rating === value}
                onClick={() => setRating(value)}
                className={`flex size-12 items-center justify-center rounded-lg border text-xl transition-colors ${rating === value ? "border-[#b84c32] bg-[#b84c32] text-white" : "border-[#d9d2c7] bg-[#fcfbf8] text-[#b84c32] hover:border-[#b84c32]"}`}
              >&#9733;</button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="comment" className="mb-3 block text-sm font-medium">Your comment</label>
          <textarea
            id="comment"
            rows={5}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What should someone know before they go?"
            className="w-full resize-y rounded-xl border border-[#d9d2c7] bg-[#fcfbf8] px-4 py-3 leading-6 outline-none transition focus:border-[#b84c32]"
          />
        </div>

        {error && <p role="alert" className="text-sm text-[#a03725]">{error}</p>}

        <button
          type="submit"
          disabled={rating === null || comment.trim().length === 0 || submitting}
          className="min-h-12 w-full rounded-full bg-[#b84c32] px-6 text-sm font-medium text-white transition hover:bg-[#963b27] disabled:cursor-not-allowed disabled:bg-[#c9c1b6]"
        >
          {submitting ? "Sending..." : "Submit review"}
        </button>
      </form>
    </main>
  );
}

