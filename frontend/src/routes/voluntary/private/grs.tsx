import GRSCreditsPage from "@/pages/voluntary/private/GRS";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/voluntary/private/grs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GRSCreditsPage />;
}
