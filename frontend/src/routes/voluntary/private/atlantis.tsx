import AtlantisP2PPage from "@/pages/voluntary/private/AtlantisP2P";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/voluntary/private/atlantis")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AtlantisP2PPage />;
}
