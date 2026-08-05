import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="container-babitalk pb-16 pt-8">
      <Suspense fallback={<p className="text-sm text-beautiro-muted">…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
