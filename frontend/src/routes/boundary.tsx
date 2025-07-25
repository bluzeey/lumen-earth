import ComingSoon from "@/components/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/boundary")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComingSoon title="Boundary" />;
}
