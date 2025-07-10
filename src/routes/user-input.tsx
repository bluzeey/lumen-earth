import UserInputPage from "@/pages/UserInputs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user-input")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserInputPage />;
}
