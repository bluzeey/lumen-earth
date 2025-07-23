import ComingSoon from "@/components/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/credits/comply")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComingSoon title="INCCTS Comply" />;
}
