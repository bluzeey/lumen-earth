import FinancializationPage from "@/pages/Financialization";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/financialization")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FinancializationPage />;
}
