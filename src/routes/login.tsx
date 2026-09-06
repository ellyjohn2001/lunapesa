// ===== login.tsx =====
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/mockApi";
import { Mail, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Lunapesa" },
      {
        name: "description",
        content:
          "Sign in to your Lunapesa account to play crash and manage your M-Pesa wallet.",
      },
      { property: "og:title", content: "Log in — Lunapesa" },
      {
        property: "og:description",
        content:
          "Sign in to your Lunapesa account to play crash and manage your M-Pesa wallet.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    const res = await authApi.login(email, password);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    toast.success(`Welcome back, ${res.session.user.displayName || res.session.user.username}`);
    navigate({ to: "/" });
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in with your email address."
      footer={
        <>
          New to Lunapesa?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-muted-foreground">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-elevated border-border focus:border-primary focus:ring-primary rounded-full pl-12"
              autoComplete="email"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-muted-foreground">Password</Label>
            <span className="text-xs text-muted-foreground opacity-50 cursor-not-allowed">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-elevated border-border focus:border-primary focus:ring-primary rounded-full pl-12"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full font-display font-extrabold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30 transition-all rounded-full"
        >
          {loading ? "Signing in..." : "Log in"}
        </Button>
        <p className="rounded-2xl bg-elevated p-3 text-xs text-muted-foreground border border-border/50">
          Demo accounts: <span className="font-semibold text-primary">user1 … user200</span>, shared
          password <span className="font-semibold text-primary">demo1234</span>.
          <br />
          <span className="text-[10px] text-muted-foreground/70">
            Or sign up with your own email and username.
          </span>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <Logo className="h-8" />
          </Link>
        </div>
        <div className="panel-surface p-6 sm:p-8">
          <h1 className="font-display text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">{subtitle}</p>
          {children}
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        )}
      </div>
    </div>
  );
}