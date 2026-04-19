import { useLocation } from "wouter";
import { getCustomer, logout } from "@/lib/auth";
import { getLoansByCustomer } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";
import { type LoanRequest } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full status-${status}`}>{status.toUpperCase()}</span>;
}

function NavBar({ active }: { active: string }) {
  const [, nav] = useLocation();
  const items = [
    { icon: "🏠", label: "Home", path: "/dashboard" },
    { icon: "📋", label: "My Loans", path: "/loans" },
    { icon: "➕", label: "Request", path: "/loan/new" },
    { icon: "👤", label: "Profile", path: "/profile" },
  ];
  return (
    <div className="sticky bottom-0 bg-card border-t border-border px-4 pt-3 pb-6 flex justify-around">
      {items.map(item => (
        <button key={item.label} onClick={() => nav(item.path)} data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
          className={`flex flex-col items-center gap-1 ${active === item.label ? "text-primary" : "text-muted-foreground"}`}>
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-semibold">{item.label}</span>
        </button>
      ))}
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{initials}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Welcome back,</p>
            <p className="font-bold text-foreground text-sm">{customer.full_name.split(" ")[0]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <button onClick={() => { logout(); nav("/"); }} className="text-xs text-muted-foreground hover:text-foreground" data-testid="button-logout">Logout</button>
        </div>
      </div>

      {/* Balance / status card */}
      {!loading && activeLoans.length > 0 ? (
        <div className="px-5 mb-4">
          <div className="gradient-card rounded-2xl p-5 text-white">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20">ACTIVE LOAN</span>
            <p className="text-xs text-white/60 mt-3 mb-1">Total Balance Due</p>
            <p className="text-3xl font-bold">₦{totalOwed.toLocaleString()}</p>
            <p className="text-xs text-white/60 mt-3">{activeLoans.length} active loan{activeLoans.length > 1 ? "s" : ""} · 5% per month</p>
          </div>
        </div>
      ) : (
        <div className="px-5 mb-4">
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <p className="text-3xl mb-2">💰</p>
            <p className="font-bold text-foreground text-sm">No active loans</p>
            <p className="text-xs text-muted-foreground mt-1">Submit a pawn request to get started</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-5 mb-5">
        <button data-testid="button-new-request" onClick={() => nav("/loan/new")}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 flex items-center justify-center gap-2 font-bold text-sm hover:opacity-90 transition-opacity">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Submit New Pawn Request
        </button>
      </div>

      {/* Stats */}
      <div className="px-5 mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "Total Requests", value: loans.length },
          { label: "Pending Review", value: pendingLoans.length },
          { label: "Active Loans", value: activeLoans.length },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{loading ? "…" : s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent requests */}
      <div className="px-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-foreground text-sm">Recent Requests</h2>
          <button onClick={() => nav("/loans")} className="text-xs text-primary font-semibold">SEE ALL</button>
        </div>
        {loading ? (
          <div className="text-center py-10 text-muted-foreground text-sm">Loading…</div>
        ) : loans.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-3xl mb-2">📦</p>
            <p className="text-sm">No requests yet. Submit one above.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {loans.slice(0, 4).map(loan => (
              <div key={loan.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg flex-shrink-0">📦</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{loan.item_name}</p>
                  <p className="text-xs text-muted-foreground">₦{loan.requested_amount.toLocaleString()} requested</p>
                </div>
                <StatusBadge status={loan.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-2">
        <div className="bg-card border border-border rounded-2xl p-3 flex items-center gap-2 text-xs text-muted-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(183 70% 50%)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          All items insured · Max ₦20,000,000 · 5%/month flat rate
        </div>
      </div>

      <NavBar active="Home" />
    </div>
  );
}
