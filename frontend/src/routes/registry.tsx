import RegistryPage from "@/pages/Registry";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/registry")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegistryPage />;
}
