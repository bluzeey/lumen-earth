import ComingSoon from "@/components/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/registry")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComingSoon title="Registry" />;
}
