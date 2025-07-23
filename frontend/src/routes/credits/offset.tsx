import AppLayout from "@/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/credits/offset")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout title="INCCTS Offset">
      <div className="flex justify-center items-center m-auto text-3xl font-bold h-full w-full">
        Coming Soon!
      </div>
    </AppLayout>
  );
}
