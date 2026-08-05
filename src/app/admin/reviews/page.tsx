import { AdminReviewsTable } from "@/components/admin/AdminReviewsTable";

export default function AdminReviewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <div className="mt-6">
        <AdminReviewsTable />
      </div>
    </div>
  );
}
