"use client";

import { useEffect, useState } from "react";

type ReviewRow = {
  id: string;
  status: string;
  guestName: string;
  procedureName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

const statuses = ["PENDING", "APPROVED", "REJECTED"];

export function AdminReviewsTable() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    const data = (await res.json()) as { reviews?: ReviewRow[] };
    setReviews(data.reviews ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  if (loading) return <p className="text-sm text-beautiro-muted">Loading reviews…</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-beautiro-border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-beautiro-border bg-beautiro-surface/70">
          <tr>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Procedure</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Review</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="border-b border-beautiro-border/70 align-top">
              <td className="px-4 py-3">{review.guestName}</td>
              <td className="px-4 py-3">{review.procedureName}</td>
              <td className="px-4 py-3">{review.rating}/5</td>
              <td className="max-w-sm px-4 py-3 text-xs text-beautiro-muted">{review.reviewText}</td>
              <td className="px-4 py-3">
                <select
                  value={review.status}
                  onChange={(e) => void updateStatus(review.id, e.target.value)}
                  className="rounded-lg border border-beautiro-border px-2 py-1 text-xs"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
