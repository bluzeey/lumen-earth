import MaterialBatchesPage from "@/pages/material/MaterialBatches";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/material/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MaterialBatchesPage />;
}
