import NewMaterialBatchPage from "@/pages/material/AddMaterialBatch";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/material/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NewMaterialBatchPage />;
}
