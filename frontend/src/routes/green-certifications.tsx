import GreenCertifications from "@/pages/GreenCertifications";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/green-certifications")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GreenCertifications />;
}
