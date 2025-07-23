import ComingSoon from "@/components/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/credits/offset")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComingSoon title="INCCTS Offset" />;
}
