import KlimaDAOPage from "@/pages/voluntary/private/KlimaDAO";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/voluntary/private/klimadao")({
  component: RouteComponent,
});

function RouteComponent() {
  return <KlimaDAOPage />;
}
