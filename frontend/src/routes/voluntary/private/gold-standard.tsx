import GoldStandardPage from "@/pages/voluntary/private/GoldStandard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/voluntary/private/gold-standard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GoldStandardPage />;
}
