import { Suspense } from "react";
import { VerifyEmailStatus } from "@/components/auth/VerifyEmailStatus";

export default function VerifyEmailPage() {
  return (
    <div className="container-babitalk pb-16 pt-8">
      <Suspense fallback={<p className="text-sm text-beautiro-muted">…</p>}>
        <VerifyEmailStatus />
      </Suspense>
    </div>
  );
}
