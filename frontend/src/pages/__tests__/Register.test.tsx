import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, expect } from "vitest";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import RegisterPage from "../Register";
import { toast } from "sonner";

 test("shows error when passwords mismatch", () => {
  render(<RegisterPage />);
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Alice" },
  });
  fireEvent.change(screen.getByLabelText(/^email$/i), {
    target: { value: "alice@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { value: "secret" },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: "different" },
  });

  fireEvent.submit(screen.getByRole("button", { name: /register/i }).closest("form")!);
  expect(toast.error).toHaveBeenCalledWith("Passwords do not match");
});

 test("registers and navigates on success", async () => {
  render(<RegisterPage />);
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Alice" },
  });
  fireEvent.change(screen.getByLabelText(/^email$/i), {
    target: { value: "alice@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { value: "secret" },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: "secret" },
  });

  fireEvent.submit(screen.getByRole("button", { name: /register/i }).closest("form")!);

  await waitFor(() =>
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/onboarding" })
  );
});
