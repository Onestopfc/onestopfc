import { useLocation } from "wouter";
import { getCustomer, logout } from "@/lib/auth";
import { getLoansByCustomer } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";
import { type LoanRequest } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full status-${status}`}>{status.toUpperCase()}</span>;
}

function NavBar({ active }: { active: string }) {
  const [, nav] = useLocation();
  const items = [
    {
      label: "Home", path: "/dashboard",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    {
      label: "My Loans", path: "/loans",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg>
    },
    {
      label: "Request", path: "/loan/new",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    },
    {
      label: "Profile", path: "/profile",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
  ];
  return (
    <div className="sticky bottom-0 border-t border-border px-2 pt-2 pb-6 flex justify-around" style={{ background: "hsl(158 18% 6%)" }}>
      {items.map(item => {
        const isActive = active === item.label;
        return (
          <button key={item.label} onClick={() => nav(item.path)}
            data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-colors"
            style={isActive ? { color: "hsl(152 60% 48%)" } : { color: "hsl(140 8% 40%)" }}>
            {item.label === "Request" ? (
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center -mt-6 shadow-lg"
                style={{ background: "hsl(152 60% 42%)", boxShadow: "0 0 20px hsl(152 60% 42% / 0.5)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
            ) : item.icon}
            <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function CustomerDashboard() {
  const [, nav] = useLocation();
  const customer = getCustomer();
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) { nav("/login"); return; }
    getLoansByCustomer(customer.id).then(data => { setLoans(data); setLoading(false); });
  }, [customer]);

  if (!customer) return null;

  const activeLoans = loans.filter(l => l.status === "active" || l.status === "approved");
  const pendingLoans = loans.filter(l => l.status === "pending");
  const totalOwed = activeLoans.reduce((sum, l) => sum + (l.total_repayment || 0), 0);
  const initials = customer.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const firstName = customer.full_name.split(" ")[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="px-5 pt-12 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(152 60% 30%), hsl(152 60% 44%))", boxShadow: "0 0 14px hsl(152 60% 42% / 0.3)" }}>
            <span className="text-white font-bold text-sm">{initials}</span>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Welcome back</p>
            <p className="font-bold text-foreground text-base leading-tight">{firstName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Logo size={30} />
          <button onClick={() => { logout(); nav("/"); }}
            className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors" data-testid="button-logout">
            Logout
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="px-5 mb-5">
        {!loading && activeLoans.length > 0 ? (
          <div className="gradient-card rounded-3xl p-5 green-glow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/15 text-white/80 uppercase tracking-widest">Active Loan</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <p className="text-white/50 text-xs mb-1">Total Balance Due</p>
            <p className="text-4xl font-bold text-white tracking-tight">₦{totalOwed.toLocaleString()}</p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-white/50 text-xs">{activeLoans.length} active loan{activeLoans.length > 1 ? "s" : ""}</p>
              <p className="text-white/50 text-xs">5%/month flat</p>
            </div>
          </div>
        ) : (
          <div className="elite-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "hsl(152 55% 10%)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 48%)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">No active loans</p>
              <p className="text-xs text-muted-foreground mt-0.5">Submit a pawn request to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="px-5 mb-5">
        <button data-testid="button-new-request" onClick={() => nav("/loan/new")}
          className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 font-bold text-sm text-white hover:opacity-90 active:scale-[0.98] transition-all"
          style={{ background: "hsl(152 60% 42%)", boxShadow: "0 6px 24px hsl(152 60% 42% / 0.3)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Pawn Request
        </button>
      </div>

      {/* Stats */}
      <div className="px-5 mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: loans.length, icon: "📦" },
          { label: "Pending", value: pendingLoans.length, icon: "⏳" },
          { label: "Active", value: activeLoans.length, icon: "✅" },
        ].map(s => (
          <div key={s.label} className="elite-card p-3 text-center">
            <p className="text-base mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-foreground">{loading ? "…" : s.value}</p>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="px-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-foreground text-sm">Recent Requests</p>
          <button onClick={() => nav("/loans")} className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "hsl(152 60% 48%)" }}>See All</button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="shimmer h-16 rounded-2xl" />)}
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm">No requests yet. Submit one above.</p>
          </div>
        ) : (
          <div className="space-y-2.5 pb-4">
            {loans.slice(0, 4).map(loan => (
              <div key={loan.id} className="elite-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "hsl(155 14% 12%)" }}>📦</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{loan.item_name}</p>
                  <p className="text-xs text-muted-foreground">₦{loan.requested_amount.toLocaleString()}</p>
                </div>
                <StatusBadge status={loan.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info strip */}
      <div className="px-5 pb-2">
        <div className="elite-card p-3 flex items-center gap-2 text-xs text-muted-foreground">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 42%)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          All items insured · Max ₦20,000,000 · 5%/month
        </div>
      </div>

      <NavBar active="Home" />
    </div>
  );
}
