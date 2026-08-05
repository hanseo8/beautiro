"use client";

import { useEffect, useState } from "react";

type UserRow = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  _count: { bookings: number; reviews: number };
};

export function AdminUsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data: { users?: UserRow[] }) => {
        setUsers(data.users ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-sm text-beautiro-muted">Loading users…</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-beautiro-border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-beautiro-border bg-beautiro-surface/70">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Verified</th>
            <th className="px-4 py-3">Bookings</th>
            <th className="px-4 py-3">Reviews</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-beautiro-border/70">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3">{user.emailVerified ? "Yes" : "No"}</td>
              <td className="px-4 py-3">{user._count.bookings}</td>
              <td className="px-4 py-3">{user._count.reviews}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
