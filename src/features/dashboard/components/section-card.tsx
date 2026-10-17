import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  flush?: boolean;
};

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  flush = false,
}: SectionCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-navy">
            {title}
          </h3>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0 self-start sm:self-auto">{action}</div> : null}
      </CardHeader>

      <CardContent
        className={cn(flush ? "px-0" : undefined, "flex-1", contentClassName)}
      >
        {children}
      </CardContent>
    </Card>
  );
}
