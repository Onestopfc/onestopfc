import { useState } from "react";
import { useLocation } from "wouter";
import { setStaff } from "@/lib/auth";
import { LogoWordmark } from "@/components/Logo";
import { Eye, EyeOff } from "lucide-react";

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

  const inputCls = "w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10"><LogoWordmark size={48}/></div>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-xs text-primary text-center mb-4 font-semibold tracking-wide">STAFF PORTAL — ONE STOP FC</div>
        <div className="bg-card border border-border rounded-xl p-3 mb-6 space-y-1">
          <p className="text-xs text-muted-foreground">Your login details:</p>
          <p className="text-xs font-bold text-foreground">Email: aekwenibe@gmail.com</p>
          <p className="text-xs font-bold text-foreground">Password: onestop2024</p>
        </div>
        <div className="space-y-4">
          <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Staff Email</label>
            <input data-testid="input-email" className={inputCls} type="email" placeholder="staff email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}/></div>
          <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Password</label>
            <div className="relative">
              <input data-testid="input-password" className={inputCls + " pr-12"} type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()}/>
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div></div>
        </div>
        {error && <p className="text-xs text-destructive mt-3 text-center bg-destructive/10 border border-destructive/20 rounded-xl p-2">{error}</p>}
        <button data-testid="button-staff-login" disabled={!email || !password || loading} onClick={handleLogin}
          className="w-full mt-6 bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? "Signing in…" : "Staff Sign In"}
        </button>
        <div className="mt-6 text-center"><button onClick={() => nav("/")} className="text-xs text-muted-foreground/50 hover:text-muted-foreground">← Customer App</button></div>
      </div>
    </div>
  );
}
