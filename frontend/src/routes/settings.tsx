import ComingSoon from "@/components/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComingSoon title="Settings" />;
}
