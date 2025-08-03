import InventoryTracker from "@/pages/Inventory&OrderTracker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/inventory-and-order-tracker")({
  component: RouteComponent,
});

function RouteComponent() {
  return <InventoryTracker />;
}
