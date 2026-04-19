import { useState } from "react";
import { useLocation } from "wouter";
import { getCustomer } from "@/lib/auth";
import { createLoanRequest } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const categories = ["Electronics", "Luxury Watches", "Jewelry & Gold", "Vehicles", "Fashion & Bags", "Musical Instruments", "Art & Collectibles", "Real Estate Documents", "Other"];
const conditions = ["Excellent", "Good", "Fair", "Poor"];
const durations = ["30 Days", "60 Days", "90 Days", "6 Months", "12 Months"];
const STEPS = ["Item Details", "Loan Terms", "Review & Submit"];
const CONDITION_ICONS: Record<string, string> = { Excellent: "⭐", Good: "✅", Fair: "🔶", Poor: "⚠️" };

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
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: "hsl(152 55% 10%)", border: "2px solid hsl(152 60% 42%)", boxShadow: "0 0 30px hsl(152 60% 42% / 0.25)" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 48%)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Request Submitted</p>
      <h2 className="text-2xl font-bold text-foreground mb-3">You're all set!</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
        One Stop FC will review your pawn request and contact you within <strong className="text-foreground">24 hours</strong> via email and phone.
      </p>
      <button onClick={() => nav("/dashboard")}
        className="rounded-2xl px-8 py-4 font-bold text-sm text-white hover:opacity-90 transition-opacity"
        style={{ background: "hsl(152 60% 42%)", boxShadow: "0 6px 20px hsl(152 60% 42% / 0.3)" }}
        data-testid="button-back-dashboard">
        Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : nav("/dashboard")}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
          style={{ background: "hsl(158 16% 8%)" }} data-testid="button-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Step {step + 1} of {STEPS.length}</p>
          <p className="font-bold text-foreground text-base">{STEPS[step]}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 mb-6 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= step ? "hsl(152 60% 42%)" : "hsl(155 14% 14%)" }} />
        ))}
      </div>

      <div className="px-5 flex-1 space-y-4 overflow-y-auto pb-4">

        {step === 0 && (
          <>
            <Field label="Item Name">
              <input data-testid="input-item-name" className="input-premium" placeholder="e.g. iPhone 15 Pro Max" value={form.itemName} onChange={e => set("itemName", e.target.value)}/>
            </Field>
            <Field label="Category">
              <select data-testid="select-category" className="input-premium" value={form.itemCategory} onChange={e => set("itemCategory", e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Description (brand, model, condition details)">
              <textarea data-testid="input-description" className="input-premium" rows={4}
                placeholder="Brand, model, year, colour, any defects or scratches…"
                value={form.itemDescription} onChange={e => set("itemDescription", e.target.value)} style={{ resize: "none" }}/>
            </Field>
            <Field label="Item Condition">
              <div className="grid grid-cols-2 gap-2">
                {conditions.map(c => (
                  <button key={c} onClick={() => set("itemCondition", c)} data-testid={`condition-${c.toLowerCase()}`}
                    className="py-3 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-center gap-2"
                    style={form.itemCondition === c
                      ? { background: "hsl(152 60% 42%)", color: "white", borderColor: "hsl(152 60% 42%)", boxShadow: "0 4px 12px hsl(152 60% 42% / 0.3)" }
                      : { background: "hsl(158 16% 8%)", color: "hsl(120 12% 72%)", borderColor: "hsl(155 14% 13%)" }}>
                    <span className="text-base">{CONDITION_ICONS[c]}</span>
                    {c}
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <div className="elite-card p-3.5 flex gap-2.5 items-start">
              <span className="text-base mt-0.5">💡</span>
              <p className="text-xs text-muted-foreground leading-relaxed">Our team appraises all items and typically offers <strong className="text-foreground">60–70%</strong> of market value.</p>
            </div>
            <Field label="Estimated Market Value (₦)">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₦</span>
                <input data-testid="input-estimated-value" className="input-premium pl-9" type="number" placeholder="0" value={form.estimatedValue} onChange={e => set("estimatedValue", e.target.value)}/>
              </div>
            </Field>
            <Field label="Amount You Need (₦)">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₦</span>
                <input data-testid="input-requested-amount" className="input-premium pl-9" type="number" placeholder="0" value={form.requestedAmount} onChange={e => set("requestedAmount", e.target.value)}/>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">Maximum: ₦20,000,000</p>
            </Field>
            <Field label="Preferred Loan Duration">
              <div className="grid grid-cols-3 gap-2">
                {durations.map(d => (
                  <button key={d} onClick={() => set("preferredDuration", d)} data-testid={`duration-${d}`}
                    className="py-3 rounded-2xl border text-xs font-bold transition-all"
                    style={form.preferredDuration === d
                      ? { background: "hsl(152 60% 42%)", color: "white", borderColor: "hsl(152 60% 42%)" }
                      : { background: "hsl(158 16% 8%)", color: "hsl(120 12% 72%)", borderColor: "hsl(155 14% 13%)" }}>
                    {d}
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="elite-card overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Request Summary</p>
              </div>
              {[
                ["Item", form.itemName],
                ["Category", form.itemCategory],
                ["Condition", form.itemCondition],
                ["Description", form.itemDescription],
                ["Est. Value", `₦${Number(form.estimatedValue||0).toLocaleString()}`],
                ["Amount Needed", `₦${Number(form.requestedAmount||0).toLocaleString()}`],
                ["Duration", form.preferredDuration],
                ["Interest Rate", "5% per month (flat)"],
              ].map(([k, v]) => (
                <div key={k} className="px-4 py-2.5 flex justify-between gap-4 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground flex-shrink-0">{k}</span>
                  <span className="text-xs text-foreground font-semibold text-right">{v}</span>
                </div>
              ))}
            </div>
            <div className="elite-card p-3.5 flex gap-2.5 items-start">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 48%)" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <p className="text-xs text-muted-foreground leading-relaxed">By submitting, you confirm these details are accurate. Final approval is subject to item inspection.</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-8 pt-4">
        <button data-testid="button-next-submit" disabled={!canNext() || loading}
          onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : handleSubmit()}
          className="w-full rounded-2xl py-4 font-bold text-base text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "hsl(152 60% 42%)", boxShadow: "0 6px 24px hsl(152 60% 42% / 0.28)" }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Submitting…
            </span>
          ) : step < STEPS.length - 1 ? "Continue →" : "Submit Request →"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</label>
      {children}
    </div>
  );
}
