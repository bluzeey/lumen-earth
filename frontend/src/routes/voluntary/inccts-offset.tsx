import INCCTSOffsetPage from "@/pages/voluntary/INCCTSOffset";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/voluntary/inccts-offset")({
  component: RouteComponent,
});

function RouteComponent() {
  return <INCCTSOffsetPage />;
}
