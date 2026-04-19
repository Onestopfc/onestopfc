import { useLocation } from "wouter";
import { getCustomer } from "@/lib/auth";
import { getLoansByCustomer } from "@/lib/store";
import { type LoanRequest } from "@shared/schema";
import { useEffect, useState } from "react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full status-${status}`}>{status.toUpperCase()}</span>;
}

export default function LoanHistory() {
  const [, nav] = useLocation();
  const customer = getCustomer();
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) { nav("/login"); return; }
    getLoansByCustomer(customer.id).then(data => { setLoans(data); setLoading(false); });
  }, [customer]);

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-5 flex items-center gap-3">
        <button onClick={() => nav("/dashboard")}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
          style={{ background: "hsl(158 16% 8%)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">One Stop FC</p>
          <h1 className="font-bold text-foreground text-base leading-tight">My Loan Requests</h1>
        </div>
        {!loading && loans.length > 0 && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "hsl(152 55% 10%)", color: "hsl(152 60% 48%)", border: "1px solid hsl(152 35% 18%)" }}>
            {loans.length} total
          </span>
        )}
      </div>

      <div className="px-5 flex-1">
        {loading ? (
          <div className="space-y-3 mt-2">
            {[1,2,3].map(i => <div key={i} className="shimmer h-24 rounded-2xl" />)}
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl"
              style={{ background: "hsl(152 55% 10%)", border: "1px solid hsl(152 35% 18%)" }}>📋</div>
            <p className="text-sm font-bold text-foreground mb-1">No requests yet</p>
            <p className="text-xs text-muted-foreground mb-6">Submit a pawn request to get started.</p>
            <button onClick={() => nav("/loan/new")}
              className="rounded-2xl px-6 py-3 text-sm font-bold text-white hover:opacity-90"
              style={{ background: "hsl(152 60% 42%)" }}>
              Submit Request
            </button>
          </div>
        ) : (
          <div className="space-y-3 pb-8 mt-1">
            {loans.map(loan => (
              <div key={loan.id} className="elite-card p-4">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "hsl(155 14% 12%)" }}>📦</div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">{loan.item_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{loan.item_category} · {loan.item_condition}</p>
                    </div>
                  </div>
                  <StatusBadge status={loan.status} />
                </div>

                {/* Amount tiles */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-xl p-2.5" style={{ background: "hsl(155 14% 11%)" }}>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Requested</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">₦{loan.requested_amount.toLocaleString()}</p>
                  </div>
                  {loan.offered_amount ? (
                    <div className="rounded-xl p-2.5" style={{ background: "hsl(152 55% 10%)", border: "1px solid hsl(152 35% 18%)" }}>
                      <p className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "hsl(152 60% 48%)" }}>Offered</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">₦{loan.offered_amount.toLocaleString()}</p>
                    </div>
                  ) : (
                    <div className="rounded-xl p-2.5" style={{ background: "hsl(155 14% 11%)" }}>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Duration</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{loan.preferred_duration}</p>
                    </div>
                  )}
                </div>

                {/* Staff note */}
                {loan.staff_notes && (
                  <div className="rounded-xl p-3 mb-3" style={{ background: "hsl(152 55% 10%)", border: "1px solid hsl(152 35% 18%)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "hsl(152 60% 48%)" }}>Staff Note</p>
                    <p className="text-xs text-foreground">{loan.staff_notes}</p>
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground">
                  {new Date(loan.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
