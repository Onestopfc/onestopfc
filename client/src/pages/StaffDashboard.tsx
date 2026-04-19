import { useLocation } from "wouter";
import { getIsStaff, logout } from "@/lib/auth";
import { getAllLoans, getAllCustomers } from "@/lib/store";
import { type LoanRequest, type Customer } from "@shared/schema";
import { LogoWordmark } from "@/components/Logo";
import { useEffect, useState } from "react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full status-${status}`}>{status.toUpperCase()}</span>;
}

function StaffNav({ active }: { active: string }) {
  const [, nav] = useLocation();
  return (
    <div className="sticky bottom-0 bg-card border-t border-border px-4 pt-3 pb-6 flex justify-around">
      {[{ label: "Requests", icon: "📋", path: "/staff/dashboard" }, { label: "Customers", icon: "👥", path: "/staff/customers" }].map(item => (
        <button key={item.label} onClick={() => nav(item.path)} className={`flex flex-col items-center gap-1 ${active === item.label ? "text-primary" : "text-muted-foreground"}`}>
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-semibold">{item.label}</span>
        </button>
      ))}
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
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <LogoWordmark size={36}/>
        <button onClick={() => { logout(); nav("/staff"); }} className="text-xs text-muted-foreground hover:text-foreground">Logout</button>
      </div>

      <div className="px-5 mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "Customers", value: customers.length, icon: "👥" },
          { label: "Pending", value: pending.length, icon: "⏳" },
          { label: "Approved", value: active.length, icon: "✅" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-lg mb-0.5">{s.icon}</p>
            <p className="text-2xl font-bold text-foreground">{loading ? "…" : s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-foreground text-sm">Loan Requests</h2>
          {!loading && pending.length > 0 && <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{pending.length} Pending</span>}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading requests…</div>
        ) : loans.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">No requests yet.</p>
            <p className="text-xs mt-1">Share your link to get customers!</p>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {loans.map(loan => {
              const cust = customers.find(c => c.id === loan.customer_id);
              return (
                <div key={loan.id} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold text-foreground">{loan.item_name}</p>
                      <p className="text-xs text-muted-foreground">{cust?.full_name || "Unknown"} · {loan.item_category}</p>
                    </div>
                    <StatusBadge status={loan.status} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Requested</p>
                      <p className="text-sm font-bold text-foreground">₦{loan.requested_amount.toLocaleString()}</p>
                    </div>
                    <button onClick={() => nav(`/staff/assess/${loan.id}`)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity ${loan.status === "pending" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {loan.status === "pending" ? "Assess →" : "View"}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(loan.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <StaffNav active="Requests"/>
    </div>
  );
}
