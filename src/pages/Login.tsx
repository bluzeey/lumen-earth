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
      // Replace with real auth API call
      const res = await fakeLogin(email, password);
      const role = res.role; // 'admin', 'recycler', 'brand', 'supplier'

      toast.success("Login successful");
      navigate({ to: `/${role}` });
    } catch (err: any) {
      toast.error("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 bg-white p-8 shadow-md rounded-xl"
      >
        <h1 className="text-2xl font-bold text-center">Login to Lumen</h1>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="text-right text-sm">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}

// Fake login function (replace with actual API call)
async function fakeLogin(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 1000));
  if (email === "admin@lumen.com") return { role: "admin" };
  if (email === "recycler@lumen.com") return { role: "recycler" };
  if (email === "brand@lumen.com") return { role: "brand" };
  if (email === "supplier@lumen.com") return { role: "supplier" };
  throw new Error("Invalid credentials");
}
