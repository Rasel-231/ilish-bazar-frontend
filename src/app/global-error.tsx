"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="bn">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-10 text-center font-sans">
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
        <p className="max-w-md text-sm text-neutral-500">
          A critical error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
