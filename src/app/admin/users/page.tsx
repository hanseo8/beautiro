import { AdminUsersTable } from "@/components/admin/AdminUsersTable";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>
      <div className="mt-6">
        <AdminUsersTable />
      </div>
    </div>
  );
}
