import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, expect } from "vitest";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

import LoginPage from "../Login";

test("submits login form and navigates", async () => {
  render(<LoginPage />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "secret" },
  });

  fireEvent.submit(screen.getByRole("button", { name: /login/i }).closest("form")!);

  await waitFor(() =>
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/material-flow-tracer" })
  );
});
