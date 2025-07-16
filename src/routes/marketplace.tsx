import Marketplace from "@/pages/Marketplace";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/marketplace")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Marketplace />;
}
