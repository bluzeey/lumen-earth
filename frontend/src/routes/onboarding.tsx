import OnboardingPage from "@/pages/Onboarding";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OnboardingPage />;
}
