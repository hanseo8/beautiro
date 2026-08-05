import { AdminBookingsTable } from "@/components/admin/AdminBookingsTable";

export default function AdminBookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Bookings</h1>
      <div className="mt-6">
        <AdminBookingsTable />
      </div>
    </div>
  );
}
