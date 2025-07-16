import UserInputPage from "@/pages/UserInputs";
import UserInputsPage from "@/pages/UserInputsV2";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user-inputs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserInputsPage />;
}
