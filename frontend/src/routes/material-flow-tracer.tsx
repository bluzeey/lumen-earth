import MaterialFlowTracer from "@/pages/MaterialFlowTracer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/material-flow-tracer")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MaterialFlowTracer />;
}
