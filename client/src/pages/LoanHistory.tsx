import { useLocation } from "wouter";
import { getCustomer } from "@/lib/auth";
import { getLoansByCustomer } from "@/lib/store";
import { type LoanRequest } from "@shared/schema";
import { useEffect, useState } from "react";

function StatusBadge({ status }: { status: string }) {
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full status-${status}`}>{status.toUpperCase()}</span>;
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
      <div className="px-5 pt-10 pb-4 flex items-center gap-4">
        <button onClick={() => nav("/dashboard")} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <h1 className="font-bold text-foreground text-lg">My Loan Requests</h1>
      </div>

      <div className="px-5 flex-1">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Loading…</div>
        ) : loans.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-sm font-semibold text-foreground mb-1">No requests yet</p>
            <p className="text-xs">Submit a pawn request to get started.</p>
            <button onClick={() => nav("/loan/new")} className="mt-6 bg-primary text-primary-foreground rounded-2xl px-6 py-3 text-sm font-bold">Submit Request</button>
          </div>
        ) : (
          <div className="space-y-3 pb-8 mt-2">
            {loans.map(loan => (
              <div key={loan.id} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">{loan.item_name}</p>
                    <p className="text-xs text-muted-foreground">{loan.item_category} · {loan.item_condition}</p>
                  </div>
                  <StatusBadge status={loan.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-muted/50 rounded-xl p-2.5">
                    <p className="text-xs text-muted-foreground">Requested</p>
                    <p className="text-sm font-bold text-foreground">₦{loan.requested_amount.toLocaleString()}</p>
                  </div>
                  {loan.offered_amount ? (
                    <div className="bg-primary/10 rounded-xl p-2.5">
                      <p className="text-xs text-primary">Offered</p>
                      <p className="text-sm font-bold text-foreground">₦{loan.offered_amount.toLocaleString()}</p>
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-xl p-2.5">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-bold text-foreground">{loan.preferred_duration}</p>
                    </div>
                  )}
                </div>
                {loan.staff_notes && (
                  <div className="mt-3 bg-muted/40 rounded-xl p-2.5">
                    <p className="text-xs text-muted-foreground font-semibold mb-0.5">Staff Note</p>
                    <p className="text-xs text-foreground">{loan.staff_notes}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">{new Date(loan.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
