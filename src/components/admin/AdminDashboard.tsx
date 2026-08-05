"use client";

import { useEffect, useState } from "react";

type Stats = {
  users: number;
  bookings: number;
  reviews: number;
  pendingBookings: number;
  pendingReviews: number;
};

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    void fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data: { stats?: Stats }) => setStats(data.stats ?? null));
  }, []);

  if (!stats) {
    return <p className="text-sm text-beautiro-muted">Loading dashboard…</p>;
  }

  const cards = [
    { label: "Users", value: stats.users },
    { label: "Bookings", value: stats.bookings },
    { label: "Reviews", value: stats.reviews },
    { label: "Pending bookings", value: stats.pendingBookings },
    { label: "Pending reviews", value: stats.pendingReviews },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-beautiro-border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-beautiro-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
