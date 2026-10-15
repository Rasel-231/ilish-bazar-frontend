import type { ReactNode } from "react";

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <h3 className="text-base font-semibold text-red-600">{title}</h3>
      {description ? (
        <p className="max-w-md text-sm text-foreground/60">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
