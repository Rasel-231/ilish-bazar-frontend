"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
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
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="max-w-md text-sm text-foreground/60">
        An unexpected error occurred while rendering this page.
      </p>
      <Button onClick={() => retry()}>Try again</Button>
    </div>
  );
}
