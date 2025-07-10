import BatchDetailsPage from "@/pages/material/BatchDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/material/$batchId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BatchDetailsPage />;
}
