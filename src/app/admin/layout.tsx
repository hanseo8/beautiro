import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import "../globals.css";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/en/book?tab=account");
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f4f6f8] text-beautiro-charcoal antialiased">
        <header className="border-b border-beautiro-border bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-beautiro-primary">
                Beautiro Admin
              </p>
              <p className="text-sm text-beautiro-muted">{user.email}</p>
            </div>
            <Link href="/en" className="text-sm font-medium text-beautiro-primary hover:underline">
              Back to site
            </Link>
          </div>
          <nav className="mx-auto flex max-w-6xl gap-2 px-6 pb-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-beautiro-muted hover:bg-beautiro-surface hover:text-beautiro-charcoal"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
