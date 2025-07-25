import InventoryTracker from "@/pages/InventoryTracker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/inventory-tracker")({
  component: RouteComponent,
});

function RouteComponent() {
  return <InventoryTracker />;
}
