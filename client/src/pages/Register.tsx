import { useState } from "react";
import { useLocation } from "wouter";
import { setCustomer } from "@/lib/auth";
import { registerCustomer } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Personal Info", "Address & ID", "Next of Kin", "Set Password"];
const nigerianStates = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];
const STEP_ICONS = ["👤", "🏠", "👨‍👩‍👦", "🔐"];

export default function Register() {
  const [, nav] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", dateOfBirth: "", gender: "",
    homeAddress: "", city: "", state: "",
    idType: "", idNumber: "",
    nokName: "", nokPhone: "", nokRelationship: "",
    password: "", confirmPassword: "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.fullName && form.email && form.phone && form.dateOfBirth && form.gender;
    if (step === 1) return form.homeAddress && form.city && form.state && form.idType && form.idNumber;
    if (step === 2) return form.nokName && form.nokPhone && form.nokRelationship;
    if (step === 3) return form.password.length >= 6 && form.password === form.confirmPassword;
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await registerCustomer({
        full_name: form.fullName.trim(),
        email: form.email.toLowerCase().trim(),
        phone: form.phone.trim(),
        date_of_birth: form.dateOfBirth,
        gender: form.gender,
        home_address: form.homeAddress.trim(),
        city: form.city.trim(),
        state: form.state,
        id_type: form.idType,
        id_number: form.idNumber.trim(),
        nok_name: form.nokName.trim(),
        nok_phone: form.nokPhone.trim(),
        nok_relationship: form.nokRelationship,
        password: form.password,
      });
      if (!result.ok || !result.customer) {
        toast({ title: "Registration Failed", description: result.error, variant: "destructive" });
        return;
      }
      setCustomer(result.customer);
      toast({ title: "Welcome to One Stop FC!", description: "Your account has been created successfully." });
      nav("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : nav("/")}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          style={{ background: "hsl(158 16% 8%)" }} data-testid="button-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Step {step + 1} of {STEPS.length}</p>
          <p className="font-bold text-foreground text-base leading-tight">{STEPS[step]}</p>
        </div>
        <Logo size={30} />
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-6 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= step ? "hsl(152 60% 42%)" : "hsl(155 14% 14%)" }} />
        ))}
      </div>

      {/* Step icon */}
      <div className="px-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: "hsl(152 55% 10%)", border: "1px solid hsl(152 35% 18%)" }}>
            {STEP_ICONS[step]}
          </div>
          <p className="text-xs text-muted-foreground">
            {step === 0 && "Your basic personal information"}
            {step === 1 && "Address and government ID verification"}
            {step === 2 && "Emergency contact details"}
            {step === 3 && "Review your info and create a password"}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="px-5 flex-1 space-y-4 overflow-y-auto pb-4">

        {step === 0 && (
          <>
            <Field label="Full Name"><input data-testid="input-full-name" className="input-premium" placeholder="e.g. Chidi Okoro" value={form.fullName} onChange={e => set("fullName", e.target.value)}/></Field>
            <Field label="Email Address"><input data-testid="input-email" className="input-premium" type="email" placeholder="you@email.com" value={form.email} onChange={e => set("email", e.target.value)}/></Field>
            <Field label="Phone Number"><input data-testid="input-phone" className="input-premium" type="tel" placeholder="080XXXXXXXX" value={form.phone} onChange={e => set("phone", e.target.value)}/></Field>
            <Field label="Date of Birth"><input data-testid="input-dob" className="input-premium" type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)}/></Field>
            <Field label="Gender">
              <select data-testid="select-gender" className="input-premium" value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="">Select gender</option>
                <option>Male</option><option>Female</option><option>Prefer not to say</option>
              </select>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Home Address"><input data-testid="input-address" className="input-premium" placeholder="House no, Street name" value={form.homeAddress} onChange={e => set("homeAddress", e.target.value)}/></Field>
            <Field label="City"><input data-testid="input-city" className="input-premium" placeholder="e.g. Enugu" value={form.city} onChange={e => set("city", e.target.value)}/></Field>
            <Field label="State">
              <select data-testid="select-state" className="input-premium" value={form.state} onChange={e => set("state", e.target.value)}>
                <option value="">Select state</option>
                {nigerianStates.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Government ID Type">
              <select data-testid="select-id-type" className="input-premium" value={form.idType} onChange={e => set("idType", e.target.value)}>
                <option value="">Select ID type</option>
                <option>NIN (National ID)</option>
                <option>International Passport</option>
                <option>Driver's Licence</option>
                <option>Voter's Card</option>
              </select>
            </Field>
            <Field label="ID Number"><input data-testid="input-id-number" className="input-premium" placeholder="Enter your ID number" value={form.idNumber} onChange={e => set("idNumber", e.target.value)}/></Field>
          </>
        )}

        {step === 2 && (
          <>
            <div className="elite-card p-3.5 flex gap-2.5 items-start">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 48%)" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-xs text-muted-foreground leading-relaxed">Your next of kin will only be contacted if we cannot reach you about your loan.</p>
            </div>
            <Field label="Next of Kin — Full Name"><input data-testid="input-nok-name" className="input-premium" placeholder="Full name" value={form.nokName} onChange={e => set("nokName", e.target.value)}/></Field>
            <Field label="Next of Kin — Phone"><input data-testid="input-nok-phone" className="input-premium" type="tel" placeholder="080XXXXXXXX" value={form.nokPhone} onChange={e => set("nokPhone", e.target.value)}/></Field>
            <Field label="Relationship">
              <select data-testid="select-nok-rel" className="input-premium" value={form.nokRelationship} onChange={e => set("nokRelationship", e.target.value)}>
                <option value="">Select relationship</option>
                <option>Spouse</option><option>Parent</option><option>Sibling</option><option>Child</option><option>Friend</option><option>Other</option>
              </select>
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            {/* Summary */}
            <div className="elite-card overflow-hidden mb-2">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Review Your Details</p>
              </div>
              {[
                ["Name", form.fullName],
                ["Email", form.email],
                ["Phone", form.phone],
                ["Address", `${form.homeAddress}, ${form.city}, ${form.state}`],
                ["ID", `${form.idType} · ${form.idNumber}`],
                ["Next of Kin", `${form.nokName} (${form.nokRelationship})`],
              ].map(([k, v]) => (
                <div key={k} className="px-4 py-2.5 flex justify-between gap-4 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground flex-shrink-0">{k}</span>
                  <span className="text-xs text-foreground font-semibold text-right">{v}</span>
                </div>
              ))}
            </div>

            <Field label="Create Password (min 6 characters)">
              <div className="relative">
                <input data-testid="input-password" className="input-premium pr-12" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)}/>
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </Field>
            <Field label="Confirm Password">
              <input data-testid="input-confirm-password" className="input-premium" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}/>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Passwords do not match
                </p>
              )}
            </Field>
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-8 pt-4">
        <button
          data-testid="button-next-submit"
          disabled={!canNext() || loading}
          onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : handleSubmit()}
          className="w-full rounded-2xl py-4 font-bold text-base text-white hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "hsl(152 60% 42%)", boxShadow: "0 6px 24px hsl(152 60% 42% / 0.28)" }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Creating account…
            </span>
          ) : step < STEPS.length - 1 ? "Continue →" : "Create My Account →"}
        </button>
        {step === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            Already have an account?{" "}
            <button onClick={() => nav("/login")} className="font-bold" style={{ color: "hsl(152 60% 48%)" }} data-testid="link-login">Sign in</button>
          </p>
        )}
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
