import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      navigate({ to: `/dashboard` });
    } catch (err: any) {
      toast.error("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-16">
        {/* Illustration */}
        <div className="w-full md:w-1/2 flex justify-center bg-lightgreen/40 p-6 rounded-2xl">
          <img
            src="/login.png"
            alt="Login Illustration"
            className="max-w-md w-full h-auto object-contain"
          />
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="w-full md:w-1/2 bg-white border border-lightgreen rounded-2xl shadow-xl p-10 space-y-6"
        >
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Lumen Logo"
              className="h-10 md:h-12 object-contain"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <a href="/forgot-password" className="text-yellow hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Signup Link */}
          <p className="text-sm text-center text-charcoal/70">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
