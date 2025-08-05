import MaterialFlowTracer from "@/pages/MaterialFlowTracer";
import { createFileRoute } from "@tanstack/react-router";
import ProtectedRoute from "@/components/ProtectedRoute";

export const Route = createFileRoute("/material-flow-tracer")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <MaterialFlowTracer />
    </ProtectedRoute>
  );
}
