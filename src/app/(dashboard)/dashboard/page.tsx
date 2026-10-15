export const metadata = {
  title: "Dashboard | Ilish Bazar",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-foreground/60">
          Welcome back. Here is a summary of your activity.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Orders", "Products", "Revenue"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-foreground/10 p-5"
          >
            <p className="text-sm text-foreground/60">{label}</p>
            <p className="mt-2 text-2xl font-semibold">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
