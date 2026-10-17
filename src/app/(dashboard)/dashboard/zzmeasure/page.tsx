import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { DevMeasure } from "@/features/dashboard/components/_dev-measure";

export default function MeasurePage() {
  return (
    <>
      <DevMeasure />
      <DashboardOverview />
    </>
  );
}
