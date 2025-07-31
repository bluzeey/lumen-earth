import GRSCreditsPage from "@/pages/credits/GRSCredits";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/credits/grs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GRSCreditsPage />;
}
