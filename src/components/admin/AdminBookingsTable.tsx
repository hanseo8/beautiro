"use client";

import { useEffect, useState } from "react";

type BookingRow = {
  id: string;
  status: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  createdAt: string;
  services: string[];
};

const statuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export function AdminBookingsTable() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    const data = (await res.json()) as { bookings?: BookingRow[] };
    setBookings(data.bookings ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  if (loading) return <p className="text-sm text-beautiro-muted">Loading bookings…</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-beautiro-border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-beautiro-border bg-beautiro-surface/70">
          <tr>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Services</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-beautiro-border/70">
              <td className="px-4 py-3">{booking.guestName}</td>
              <td className="px-4 py-3">
                <div>{booking.guestEmail}</div>
                <div className="text-xs text-beautiro-muted">{booking.guestPhone}</div>
              </td>
              <td className="px-4 py-3 text-xs">{booking.services.join(", ")}</td>
              <td className="px-4 py-3">
                <select
                  value={booking.status}
                  onChange={(e) => void updateStatus(booking.id, e.target.value)}
                  className="rounded-lg border border-beautiro-border px-2 py-1 text-xs"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-xs text-beautiro-muted">
                {new Date(booking.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
