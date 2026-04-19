import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { getIsStaff } from "@/lib/auth";
import { getLoanById, getCustomerById, updateLoan } from "@/lib/store";
import { type LoanRequest, type Customer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

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
  if (pageLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading…</p></div>;
  if (!loan) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Request not found.</p></div>;

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

  const inputCls = "w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <button onClick={() => nav("/staff/dashboard")} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <h1 className="font-bold text-foreground text-base">Assess Request</h1>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full status-${loan.status}`}>{loan.status.toUpperCase()}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-4">
        {/* Customer */}
        {customer && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Customer</p>
            <p className="text-sm font-bold text-foreground">{customer.full_name}</p>
            <p className="text-xs text-muted-foreground">{customer.email} · {customer.phone}</p>
            <p className="text-xs text-muted-foreground">{customer.home_address}, {customer.city}, {customer.state}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{customer.id_type}: {customer.id_number}</p>
          </div>
        )}

        {/* Item */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Item Details</p>
          <p className="text-base font-bold text-foreground">{loan.item_name}</p>
          <p className="text-xs text-muted-foreground">{loan.item_category} · {loan.item_condition} condition</p>
          <p className="text-sm text-foreground mt-2">{loan.item_description}</p>
          <div className="flex gap-4 mt-3">
            <div><p className="text-xs text-muted-foreground">Est. Value</p><p className="text-sm font-bold text-foreground">₦{loan.estimated_value.toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Requested</p><p className="text-sm font-bold text-foreground">₦{loan.requested_amount.toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Duration</p><p className="text-sm font-bold text-foreground">{loan.preferred_duration}</p></div>
          </div>
        </div>

        {/* Assessment form — only for pending */}
        {!isReadOnly && (
          <>
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Your Assessment</p>
            <div>
              <label className={labelCls}>Appraised Market Value (₦)</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₦</span>
                <input className={inputCls + " pl-9"} type="number" placeholder="0.00" value={appraisedValue} onChange={e => setAppraisedValue(e.target.value)}/></div>
              {appraisedValue && <p className="text-xs text-muted-foreground mt-1">Recommended LTV (60%): ₦{(parseFloat(appraisedValue) * 0.6).toLocaleString()}</p>}
            </div>
            <div>
              <label className={labelCls}>Offered Loan Amount (₦)</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₦</span>
                <input className={inputCls + " pl-9"} type="number" placeholder="0.00" value={offeredAmount} onChange={e => setOfferedAmount(e.target.value)}/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Interest Rate (%/mo)</label>
                <input className={inputCls} type="number" step="0.5" value={interestRate} onChange={e => setInterestRate(e.target.value)}/></div>
              <div><label className={labelCls}>Duration (Days)</label>
                <select className={inputCls} value={duration} onChange={e => setDuration(e.target.value)}>
                  <option value="30">30 Days</option><option value="60">60 Days</option><option value="90">90 Days</option><option value="180">6 Months</option><option value="365">12 Months</option>
                </select></div>
            </div>
            {offeredAmount && (
              <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Interest Amount</span><span className="font-bold text-foreground">₦{Number(interestAmt).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Repayment</span><span className="font-bold text-primary">₦{Number(totalRepayment).toLocaleString()}</span></div>
              </div>
            )}
            <div><label className={labelCls}>Notes / Reason</label>
              <textarea className={inputCls} rows={3} placeholder="Condition notes, reason for approval or rejection…" value={notes} onChange={e => setNotes(e.target.value)} style={{resize:"none"}}/></div>
          </>
        )}

        {/* Read-only result */}
        {isReadOnly && loan.offered_amount && (
          <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Assessment Result</p>
            {[["Offered Amount", `₦${loan.offered_amount.toLocaleString()}`], ["Interest Rate", `${loan.interest_rate}%/month`], ["Total Repayment", `₦${(loan.total_repayment||0).toLocaleString()}`], ["Notes", loan.staff_notes || "—"]].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm gap-3"><span className="text-muted-foreground flex-shrink-0">{k}</span><span className="font-medium text-foreground text-right">{v}</span></div>
            ))}
          </div>
        )}
      </div>

      {!isReadOnly && (
        <div className="px-5 pb-8 pt-4 border-t border-border flex gap-3">
          <button onClick={() => setModal("reject")} className="flex-1 bg-card border border-border text-foreground rounded-2xl py-4 font-bold text-sm hover:bg-muted/30 transition-colors" data-testid="button-reject">Reject</button>
          <button onClick={() => setModal("approve")} disabled={!offeredAmount || !appraisedValue}
            className="flex-[2] bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed" data-testid="button-approve">
            Approve Loan →
          </button>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-foreground text-base">{modal === "approve" ? "Confirm Approval" : "Confirm Rejection"}</h3>
            <p className="text-sm text-muted-foreground">
              {modal === "approve" ? `Approve ₦${Number(offeredAmount).toLocaleString()} at ${interestRate}%/month for ${duration} days?` : "Reject this pawn request?"}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 bg-muted text-foreground rounded-xl py-3 font-semibold text-sm">Cancel</button>
              <button onClick={() => { setModal(null); handleDecision(modal); }} disabled={loading}
                className={`flex-[2] rounded-xl py-3 font-bold text-sm text-white ${modal === "approve" ? "bg-primary" : "bg-destructive"}`}>
                {loading ? "Processing…" : modal === "approve" ? "Confirm" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
