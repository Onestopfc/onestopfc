import { useState } from "react";
import { useLocation } from "wouter";
import { setCustomer } from "@/lib/auth";
import { loginCustomer } from "@/lib/store";
import { LogoWordmark } from "@/components/Logo";

export default function Login() {
  const [, nav] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setError("");

    const result = await loginCustomer(email, password);
    if (!result.ok || !result.customer) {
      setError(result.error || "Login failed. Please try again.");
      setLoading(false);
      return;
    }
    setCustomer(result.customer);
    nav("/dashboard");
  };

  const inputCls = "w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <LogoWordmark size={48} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">Sign in to your One Stop FC account</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Email Address</label>
            <input data-testid="input-email" className={inputCls} type="email" placeholder="you@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Password</label>
            <input data-testid="input-password" className={inputCls} type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()}/>
          </div>
        </div>

        {error && (
          <div className="mt-3 bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-xs text-destructive font-medium">
            {error}
          </div>
        )}

        <button
          data-testid="button-login"
          disabled={!email || !password || loading}
          onClick={handleLogin}
          className="w-full mt-6 bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account?{" "}
          <button onClick={() => nav("/register")} className="text-primary font-semibold" data-testid="link-register">
            Create one
          </button>
        </p>

        <div className="mt-8 text-center">
          <button onClick={() => nav("/")} className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
