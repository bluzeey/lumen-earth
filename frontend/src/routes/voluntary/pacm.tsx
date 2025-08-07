import PACMPage from "@/pages/voluntary/PACM";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/voluntary/pacm")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PACMPage />;
}
