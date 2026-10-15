import { LoadingSpinner } from "@/components/feedback/loading-spinner";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <LoadingSpinner className="text-foreground/60" />
    </div>
  );
}
