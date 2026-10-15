import { Suspense } from "react";

import { LoadingSpinner } from "@/components/feedback/loading-spinner";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Sign in | Ilish Bazar",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
