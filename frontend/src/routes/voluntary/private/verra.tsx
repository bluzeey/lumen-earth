import VerraPage from "@/pages/voluntary/private/Verra";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/voluntary/private/verra")({
  component: RouteComponent,
});

function RouteComponent() {
  return <VerraPage />;
}
