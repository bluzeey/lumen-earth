import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.errors) {
          const errors = Array.isArray(data.errors)
            ? data.errors
            : Object.values(data.errors).flat();
          errors.forEach((msg: any) => toast.error(String(msg)));
        } else if (data?.message) {
          toast.error(data.message);
        } else {
          toast.error("Registration failed");
        }
        return;
      }

      toast.success("Registration successful");
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-16">
        {/* Left illustration */}
        <div className="w-full md:w-1/2 flex justify-center bg-lightgreen/40 p-6 rounded-2xl">
          <img
            src="/register.png"
            alt="Register Illustration"
            className="max-w-md w-full h-auto object-contain"
          />
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleRegister}
          className="w-full md:w-1/2 bg-white border border-lightgreen rounded-2xl shadow-xl p-10 space-y-6"
        >
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Lumen Logo"
              className="h-24 object-contain"
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-charcoal">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-charcoal">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-charcoal">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-charcoal">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
