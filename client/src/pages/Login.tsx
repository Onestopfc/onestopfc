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
  const [showPass, setShowPass] = useState(false);

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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full opacity-15"
        style={{ background: "radial-gradient(ellipse at center, hsl(152 60% 42%) 0%, transparent 70%)" }} />

      <div className="w-full max-w-sm relative">
        <div className="flex justify-center mb-10">
          <LogoWordmark size={48} />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">Sign in to your One Stop FC account</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              data-testid="input-email"
              className="input-premium"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <input
                data-testid="input-password"
                className="input-premium pr-12"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-destructive/10 border border-destructive/25 rounded-2xl p-3.5 text-xs text-destructive font-medium flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <button
          data-testid="button-login"
          disabled={!email || !password || loading}
          onClick={handleLogin}
          className="w-full mt-6 bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ boxShadow: "0 6px 24px hsl(152 60% 42% / 0.3)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Signing in…
            </span>
          ) : "Sign In"}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account?{" "}
          <button onClick={() => nav("/register")} className="text-primary font-bold hover:underline" data-testid="link-register">
            Create one free
          </button>
        </p>

        <div className="mt-8 text-center">
          <button onClick={() => nav("/")} className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
