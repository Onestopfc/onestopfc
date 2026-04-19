import { useState } from "react";
import { useLocation } from "wouter";
import { setStaff } from "@/lib/auth";
import { LogoWordmark } from "@/components/Logo";

const STAFF_EMAIL = "aekwenibe@gmail.com";
const STAFF_PASSWORD = "onestop2024";

export default function StaffLogin() {
  const [, nav] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    setLoading(true); setError("");
    setTimeout(() => {
      if (email.toLowerCase().trim() === STAFF_EMAIL && password === STAFF_PASSWORD) {
        setStaff(true);
        nav("/staff/dashboard");
      } else {
        setError("Invalid staff credentials.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full opacity-10"
        style={{ background: "radial-gradient(ellipse at center, hsl(152 60% 42%) 0%, transparent 70%)" }} />

      <div className="w-full max-w-sm relative">
        <div className="flex justify-center mb-10">
          <LogoWordmark size={48} />
        </div>

        {/* Staff badge */}
        <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/25 bg-primary/10 w-fit mx-auto">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 48%)" strokeWidth="2.5" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Staff Portal</span>
        </div>

        <h1 className="text-xl font-bold text-foreground mb-1 text-center">Staff Sign In</h1>
        <p className="text-xs text-muted-foreground text-center mb-8">One Stop FC · Enugu</p>

        {/* Credentials hint */}
        <div className="elite-card p-4 mb-6">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Login</p>
          <p className="text-xs text-foreground font-semibold">{STAFF_EMAIL}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Password: onestop2024</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Staff Email</label>
            <input
              data-testid="input-email"
              className="input-premium"
              type="email"
              placeholder="staff@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Password</label>
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
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-destructive/10 border border-destructive/25 rounded-2xl p-3 text-xs text-destructive font-medium text-center">
            {error}
          </div>
        )}

        <button
          data-testid="button-staff-login"
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
          ) : "Staff Sign In"}
        </button>

        <div className="mt-8 text-center">
          <button onClick={() => nav("/")} className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
            ← Customer App
          </button>
        </div>
      </div>
    </div>
  );
}
