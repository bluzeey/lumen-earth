import BoundaryPage from "@/pages/Boundary";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/boundary")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BoundaryPage />;
}
