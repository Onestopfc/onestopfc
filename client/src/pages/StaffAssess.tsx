import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { getIsStaff } from "@/lib/auth";
import { getLoanById, getCustomerById, updateLoan } from "@/lib/store";
import { type LoanRequest, type Customer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

function StatusBadge({ status }: { status: string }) {
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full status-${status}`}>{status.toUpperCase()}</span>;
}

export default function StaffAssess() {
  const [, nav] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isStaff = getIsStaff();

  const [loan, setLoan] = useState<LoanRequest | undefined>();
  const [customer, setCustomer] = useState<Customer | undefined>();
  const [appraisedValue, setAppraisedValue] = useState("");
  const [offeredAmount, setOfferedAmount] = useState("");
  const [interestRate, setInterestRate] = useState("5");
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");
  const [modal, setModal] = useState<"approve" | "reject" | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!isStaff) { nav("/staff"); return; }
    getLoanById(id).then(async (l) => {
      if (l) {
        setLoan(l);
        const cust = await getCustomerById(l.customer_id);
        setCustomer(cust);
      }
      setPageLoading(false);
    });
  }, [isStaff, id]);

  if (!isStaff) return null;
  if (pageLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="shimmer w-8 h-8 rounded-full" />
    </div>
  );
  if (!loan) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Request not found.</p>
    </div>
  );

  const interestAmt = offeredAmount ? (parseFloat(offeredAmount) * parseFloat(interestRate) / 100).toFixed(0) : "0";
  const totalRepayment = offeredAmount ? (parseFloat(offeredAmount) + parseFloat(interestAmt)).toFixed(0) : "0";
  const isReadOnly = loan.status !== "pending";

  const handleDecision = async (decision: "approved" | "rejected") => {
    setLoading(true);
    const updates: Partial<LoanRequest> = { status: decision, staff_notes: notes };
    if (decision === "approved") {
      updates.appraised_value = parseFloat(appraisedValue);
      updates.offered_amount = parseFloat(offeredAmount);
      updates.interest_rate = parseFloat(interestRate);
      updates.duration_days = parseInt(duration);
      updates.total_repayment = parseFloat(totalRepayment);
    }
    await updateLoan(loan.id, updates);
    toast({ title: decision === "approved" ? "Loan Approved ✅" : "Request Rejected", description: "Decision recorded." });
    setLoading(false);
    nav("/staff/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => nav("/staff/dashboard")}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
          style={{ background: "hsl(158 16% 8%)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Staff Portal</p>
          <p className="font-bold text-foreground text-base">Assess Request</p>
        </div>
        <StatusBadge status={loan.status} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-4">

        {/* Customer card */}
        {customer && (
          <div className="elite-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(152 60% 28%), hsl(152 60% 42%))" }}>
                <span className="text-white font-bold text-sm">
                  {customer.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{customer.full_name}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-border">
              {[
                ["Phone", customer.phone],
                ["Address", `${customer.home_address}, ${customer.city}, ${customer.state}`],
                ["ID", `${customer.id_type}: ${customer.id_number}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs gap-3">
                  <span className="text-muted-foreground flex-shrink-0">{k}</span>
                  <span className="text-foreground font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item card */}
        <div className="elite-card p-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Item Details</p>
          <p className="text-lg font-bold text-foreground">{loan.item_name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{loan.item_category} · {loan.item_condition} condition</p>
          <p className="text-sm text-foreground mt-2 leading-relaxed">{loan.item_description}</p>
          <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-3">
            {[
              { label: "Est. Value", value: `₦${loan.estimated_value.toLocaleString()}` },
              { label: "Requested", value: `₦${loan.requested_amount.toLocaleString()}` },
              { label: "Duration", value: loan.preferred_duration },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-2.5" style={{ background: "hsl(155 14% 11%)" }}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">{s.label}</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment form */}
        {!isReadOnly && (
          <>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Assessment</p>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Appraised Market Value (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₦</span>
                <input className="input-premium pl-9" type="number" placeholder="0" value={appraisedValue} onChange={e => setAppraisedValue(e.target.value)}/>
              </div>
              {appraisedValue && (
                <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                  Recommended LTV (60%): <span className="font-bold" style={{ color: "hsl(152 60% 48%)" }}>₦{(parseFloat(appraisedValue) * 0.6).toLocaleString()}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Offered Loan Amount (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₦</span>
                <input className="input-premium pl-9" type="number" placeholder="0" value={offeredAmount} onChange={e => setOfferedAmount(e.target.value)}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Interest Rate (%/mo)</label>
                <input className="input-premium" type="number" step="0.5" value={interestRate} onChange={e => setInterestRate(e.target.value)}/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Duration (Days)</label>
                <select className="input-premium" value={duration} onChange={e => setDuration(e.target.value)}>
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">6 Months</option>
                  <option value="365">12 Months</option>
                </select>
              </div>
            </div>

            {offeredAmount && (
              <div className="elite-card p-4 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Repayment Summary</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Loan Amount</span>
                  <span className="font-bold text-foreground">₦{Number(offeredAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Interest</span>
                  <span className="font-bold text-foreground">₦{Number(interestAmt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground font-bold">Total Repayment</span>
                  <span className="font-bold" style={{ color: "hsl(152 60% 48%)" }}>₦{Number(totalRepayment).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Notes / Reason</label>
              <textarea className="input-premium" rows={3} placeholder="Condition notes, reason for approval or rejection…"
                value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: "none" }}/>
            </div>
          </>
        )}

        {/* Read-only result */}
        {isReadOnly && loan.offered_amount && (
          <div className="elite-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Assessment Result</p>
            </div>
            {[
              ["Offered Amount", `₦${loan.offered_amount.toLocaleString()}`],
              ["Interest Rate", `${loan.interest_rate}%/month`],
              ["Total Repayment", `₦${(loan.total_repayment||0).toLocaleString()}`],
              ["Notes", loan.staff_notes || "—"],
            ].map(([k, v]) => (
              <div key={k} className="px-4 py-2.5 flex justify-between gap-3 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground flex-shrink-0">{k}</span>
                <span className="text-xs font-semibold text-foreground text-right">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isReadOnly && (
        <div className="px-5 pb-8 pt-4 border-t border-border flex gap-3">
          <button onClick={() => setModal("reject")}
            className="flex-1 rounded-2xl py-4 font-bold text-sm text-foreground hover:opacity-80 transition-colors border border-border"
            style={{ background: "hsl(158 16% 8%)" }} data-testid="button-reject">
            Reject
          </button>
          <button onClick={() => setModal("approve")} disabled={!offeredAmount || !appraisedValue}
            className="flex-[2] rounded-2xl py-4 font-bold text-sm text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "hsl(152 60% 42%)", boxShadow: "0 4px 16px hsl(152 60% 42% / 0.3)" }}
            data-testid="button-approve">
            Approve Loan →
          </button>
        </div>
      )}

      {/* Confirm modal */}
      {modal && (
        <div className="fixed inset-0 flex items-end justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
          <div className="elite-card p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: modal === "approve" ? "hsl(152 55% 10%)" : "hsl(0 65% 12%)", border: `1px solid ${modal === "approve" ? "hsl(152 35% 18%)" : "hsl(0 45% 20%)"}` }}>
                {modal === "approve"
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 48%)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(0 70% 58%)" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                }
              </div>
              <h3 className="font-bold text-foreground text-base">{modal === "approve" ? "Confirm Approval" : "Confirm Rejection"}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {modal === "approve"
                ? `Approve ₦${Number(offeredAmount).toLocaleString()} at ${interestRate}%/month for ${duration} days?`
                : "Reject this pawn request? This cannot be undone."}
            </p>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setModal(null)}
                className="flex-1 rounded-xl py-3 font-semibold text-sm text-foreground border border-border"
                style={{ background: "hsl(155 14% 11%)" }}>
                Cancel
              </button>
              <button onClick={() => { setModal(null); handleDecision(modal); }} disabled={loading}
                className="flex-[2] rounded-xl py-3 font-bold text-sm text-white disabled:opacity-50"
                style={{ background: modal === "approve" ? "hsl(152 60% 42%)" : "hsl(0 70% 48%)" }}>
                {loading ? "Processing…" : modal === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
