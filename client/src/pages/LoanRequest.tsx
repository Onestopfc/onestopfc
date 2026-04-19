import { useState } from "react";
import { useLocation } from "wouter";
import { getCustomer } from "@/lib/auth";
import { createLoanRequest } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const categories = ["Electronics", "Luxury Watches", "Jewelry & Gold", "Vehicles", "Fashion & Bags", "Musical Instruments", "Art & Collectibles", "Real Estate Documents", "Other"];
const conditions = ["Excellent", "Good", "Fair", "Poor"];
const durations = ["30 Days", "60 Days", "90 Days", "6 Months", "12 Months"];
const STEPS = ["Item Details", "Loan Terms", "Review & Submit"];

export default function LoanRequest() {
  const [, nav] = useLocation();
  const { toast } = useToast();
  const customer = getCustomer();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    itemName: "", itemCategory: "", itemDescription: "", itemCondition: "",
    estimatedValue: "", requestedAmount: "", preferredDuration: "30 Days",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.itemName && form.itemCategory && form.itemDescription && form.itemCondition;
    if (step === 1) return form.estimatedValue && form.requestedAmount && form.preferredDuration;
    return true;
  };

  const handleSubmit = async () => {
    if (!customer) { nav("/login"); return; }
    setLoading(true);
    try {
      await createLoanRequest({
        customer_id: customer.id,
        item_name: form.itemName.trim(),
        item_category: form.itemCategory,
        item_description: form.itemDescription.trim(),
        item_condition: form.itemCondition,
        estimated_value: parseFloat(form.estimatedValue),
        requested_amount: parseFloat(form.requestedAmount),
        preferred_duration: form.preferredDuration,
      });
      setSubmitted(true);
    } catch (e: unknown) {
      toast({ title: "Submission Failed", description: e instanceof Error ? e.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!customer) { nav("/login"); return null; }

  if (submitted) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="hsl(183 70% 42%)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Request Submitted!</h2>
      <p className="text-muted-foreground text-sm mb-1 max-w-xs">Our team at One Stop FC will review your request and respond within 24 hours.</p>
      <p className="text-xs text-muted-foreground mt-1 mb-8">You'll be contacted via email and phone.</p>
      <button onClick={() => nav("/dashboard")} className="bg-primary text-primary-foreground rounded-2xl px-8 py-4 font-bold text-sm hover:opacity-90" data-testid="button-back-dashboard">Back to Dashboard</button>
    </div>
  );

  const inputCls = "w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-10 pb-4 flex items-center gap-4">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : nav("/dashboard")} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center" data-testid="button-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div>
          <p className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
          <p className="font-bold text-foreground text-base">{STEPS[step]}</p>
        </div>
      </div>

      <div className="px-5 mb-6 flex gap-1.5">
        {STEPS.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-muted"}`}/>)}
      </div>

      <div className="px-5 flex-1 space-y-4 overflow-y-auto pb-4">
        {step === 0 && (
          <>
            <div><label className={labelCls}>Item Name</label><input data-testid="input-item-name" className={inputCls} placeholder="e.g. iPhone 15 Pro Max" value={form.itemName} onChange={e => set("itemName", e.target.value)}/></div>
            <div>
              <label className={labelCls}>Category</label>
              <select data-testid="select-category" className={inputCls} value={form.itemCategory} onChange={e => set("itemCategory", e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Description (brand, model, condition details)</label>
              <textarea data-testid="input-description" className={inputCls} rows={4} placeholder="Brand, model, year, colour, any defects or scratches…" value={form.itemDescription} onChange={e => set("itemDescription", e.target.value)} style={{resize:"none"}}/></div>
            <div>
              <label className={labelCls}>Item Condition</label>
              <div className="grid grid-cols-2 gap-2">
                {conditions.map(c => (
                  <button key={c} onClick={() => set("itemCondition", c)} data-testid={`condition-${c.toLowerCase()}`}
                    className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${form.itemCondition === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:bg-muted/30"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-400">
              Be honest about your estimated value — our team appraises all items and offers 60–70% of market value.
            </div>
            <div>
              <label className={labelCls}>Estimated Market Value (₦)</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₦</span>
                <input data-testid="input-estimated-value" className={inputCls + " pl-9"} type="number" placeholder="0.00" value={form.estimatedValue} onChange={e => set("estimatedValue", e.target.value)}/></div>
            </div>
            <div>
              <label className={labelCls}>Amount You Need (₦)</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₦</span>
                <input data-testid="input-requested-amount" className={inputCls + " pl-9"} type="number" placeholder="0.00" value={form.requestedAmount} onChange={e => set("requestedAmount", e.target.value)}/></div>
              <p className="text-xs text-muted-foreground mt-1">Maximum: ₦20,000,000</p>
            </div>
            <div>
              <label className={labelCls}>Preferred Loan Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {durations.map(d => (
                  <button key={d} onClick={() => set("preferredDuration", d)} data-testid={`duration-${d}`}
                    className={`py-2.5 rounded-xl border text-xs font-semibold transition-colors ${form.preferredDuration === d ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:bg-muted/30"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-2xl p-4 space-y-2.5">
              {[["Item", form.itemName], ["Category", form.itemCategory], ["Condition", form.itemCondition], ["Description", form.itemDescription], ["Est. Value", `₦${Number(form.estimatedValue||0).toLocaleString()}`], ["Amount Needed", `₦${Number(form.requestedAmount||0).toLocaleString()}`], ["Duration", form.preferredDuration], ["Interest Rate", "5% per month (flat)"]].map(([k,v]) => (
                <div key={k} className="flex justify-between text-sm gap-4">
                  <span className="text-muted-foreground flex-shrink-0">{k}</span>
                  <span className="text-foreground font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-xs text-primary leading-relaxed">
              By submitting, you confirm these details are accurate. One Stop FC will contact you within 24 hours. Final approval is subject to item inspection.
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-8 pt-4">
        <button data-testid="button-next-submit" disabled={!canNext() || loading}
          onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : handleSubmit()}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? "Submitting…" : step < STEPS.length - 1 ? "Continue →" : "Submit Request →"}
        </button>
      </div>
    </div>
  );
}
