import { useLocation } from "wouter";
import { getIsStaff, logout } from "@/lib/auth";
import { getAllLoans, getAllCustomers } from "@/lib/store";
import { type LoanRequest, type Customer } from "@shared/schema";
import { LogoWordmark } from "@/components/Logo";
import { useEffect, useState } from "react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full status-${status}`}>{status.toUpperCase()}</span>;
}

export function StaffNav({ active }: { active: string }) {
  const [, nav] = useLocation();
  const items = [
    {
      label: "Requests", path: "/staff/dashboard",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg>
    },
    {
      label: "Customers", path: "/staff/customers",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
  ];
  return (
    <div className="sticky bottom-0 border-t border-border px-2 pt-2 pb-6 flex justify-around" style={{ background: "hsl(158 18% 6%)" }}>
      {items.map(item => {
        const isActive = active === item.label;
        return (
          <button key={item.label} onClick={() => nav(item.path)}
            className="flex flex-col items-center gap-1 px-6 py-1.5 rounded-2xl transition-colors"
            style={isActive ? { color: "hsl(152 60% 48%)" } : { color: "hsl(140 8% 40%)" }}>
            {item.icon}
            <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function StaffDashboard() {
  const [, nav] = useLocation();
  const isStaff = getIsStaff();
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isStaff) { nav("/staff"); return; }
    Promise.all([getAllLoans(), getAllCustomers()]).then(([l, c]) => {
      setLoans(l);
      setCustomers(c);
      setLoading(false);
    });
  }, [isStaff]);

  if (!isStaff) return null;

  const pending = loans.filter(l => l.status === "pending");
  const active = loans.filter(l => l.status === "active" || l.status === "approved");

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <div>
          <LogoWordmark size={32} />
          <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold uppercase tracking-widest">Staff Portal</p>
        </div>
        <button onClick={() => { logout(); nav("/staff"); }}
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-xl px-3 py-2"
          style={{ background: "hsl(158 16% 8%)" }}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="px-5 mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "Customers", value: customers.length, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 48%)" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
          { label: "Pending", value: pending.length, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(40 80% 55%)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
          { label: "Approved", value: active.length, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 48%)" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
        ].map(s => (
          <div key={s.label} className="elite-card p-3 text-center">
            <div className="flex justify-center mb-1.5">{s.icon}</div>
            <p className="text-2xl font-bold text-foreground">{loading ? "…" : s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending alert */}
      {!loading && pending.length > 0 && (
        <div className="px-5 mb-4">
          <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "hsl(40 70% 10%)", border: "1px solid hsl(40 50% 20%)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(40 70% 15%)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(40 80% 55%)" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p className="text-xs font-semibold" style={{ color: "hsl(40 80% 62%)" }}>
              {pending.length} request{pending.length > 1 ? "s" : ""} awaiting your review
            </p>
          </div>
        </div>
      )}

      {/* Loan list */}
      <div className="px-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-foreground text-sm">All Requests</p>
          {!loading && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{loans.length} total</p>}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="shimmer h-20 rounded-2xl" />)}
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
              style={{ background: "hsl(152 55% 10%)", border: "1px solid hsl(152 35% 18%)" }}>📭</div>
            <p className="text-sm font-semibold text-foreground mb-1">No requests yet</p>
            <p className="text-xs">Share the app link to get customers!</p>
          </div>
        ) : (
          <div className="space-y-2.5 pb-6">
            {loans.map(loan => {
              const cust = customers.find(c => c.id === loan.customer_id);
              return (
                <div key={loan.id} className="elite-card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">{loan.item_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cust?.full_name || "Unknown"} · {loan.item_category}</p>
                    </div>
                    <StatusBadge status={loan.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Requested</p>
                      <p className="text-base font-bold text-foreground">₦{loan.requested_amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(loan.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                      <button onClick={() => nav(`/staff/assess/${loan.id}`)}
                        className="px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
                        style={loan.status === "pending"
                          ? { background: "hsl(152 60% 42%)", color: "white" }
                          : { background: "hsl(155 14% 14%)", color: "hsl(140 8% 50%)" }}>
                        {loan.status === "pending" ? "Assess →" : "View"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <StaffNav active="Requests" />
    </div>
  );
}
