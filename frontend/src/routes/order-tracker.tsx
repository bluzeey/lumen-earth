import OrderTracker from "@/pages/OrderTracker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/order-tracker")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderTracker />;
}
