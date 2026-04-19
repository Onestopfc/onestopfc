import { useState } from "react";
import { useLocation } from "wouter";
import { setCustomer } from "@/lib/auth";
import { registerCustomer } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Personal Info", "Address & ID", "Next of Kin", "Set Password"];
const nigerianStates = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

export default function Register() {
  const [, nav] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const inputCls = "w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-10 pb-4 flex items-center gap-4">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : nav("/")} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center" data-testid="button-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div>
          <p className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
          <p className="font-bold text-foreground text-base">{STEPS[step]}</p>
        </div>
        <div className="ml-auto"><Logo size={32} /></div>
      </div>

      <div className="px-5 mb-6 flex gap-1.5">
        {STEPS.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-muted"}`}/>)}
      </div>

      <div className="px-5 flex-1 space-y-4 overflow-y-auto pb-4">
        {step === 0 && (
          <>
            <div><label className={labelCls}>Full Name</label><input data-testid="input-full-name" className={inputCls} placeholder="e.g. Chidi Okoro" value={form.fullName} onChange={e => set("fullName", e.target.value)}/></div>
            <div><label className={labelCls}>Email Address</label><input data-testid="input-email" className={inputCls} type="email" placeholder="you@email.com" value={form.email} onChange={e => set("email", e.target.value)}/></div>
            <div><label className={labelCls}>Phone Number</label><input data-testid="input-phone" className={inputCls} type="tel" placeholder="080XXXXXXXX" value={form.phone} onChange={e => set("phone", e.target.value)}/></div>
            <div><label className={labelCls}>Date of Birth</label><input data-testid="input-dob" className={inputCls} type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)}/></div>
            <div>
              <label className={labelCls}>Gender</label>
              <select data-testid="select-gender" className={inputCls} value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="">Select gender</option>
                <option>Male</option><option>Female</option><option>Prefer not to say</option>
              </select>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div><label className={labelCls}>Home Address</label><input data-testid="input-address" className={inputCls} placeholder="House no, Street name" value={form.homeAddress} onChange={e => set("homeAddress", e.target.value)}/></div>
            <div><label className={labelCls}>City</label><input data-testid="input-city" className={inputCls} placeholder="e.g. Enugu" value={form.city} onChange={e => set("city", e.target.value)}/></div>
            <div>
              <label className={labelCls}>State</label>
              <select data-testid="select-state" className={inputCls} value={form.state} onChange={e => set("state", e.target.value)}>
                <option value="">Select state</option>
                {nigerianStates.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Government ID Type</label>
              <select data-testid="select-id-type" className={inputCls} value={form.idType} onChange={e => set("idType", e.target.value)}>
                <option value="">Select ID type</option>
                <option>NIN (National ID)</option>
                <option>International Passport</option>
                <option>Driver's Licence</option>
                <option>Voter's Card</option>
              </select>
            </div>
            <div><label className={labelCls}>ID Number</label><input data-testid="input-id-number" className={inputCls} placeholder="Enter your ID number" value={form.idNumber} onChange={e => set("idNumber", e.target.value)}/></div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-xs text-primary">
              Your next of kin will be contacted if we are unable to reach you regarding your loan.
            </div>
            <div><label className={labelCls}>Next of Kin — Full Name</label><input data-testid="input-nok-name" className={inputCls} placeholder="Full name" value={form.nokName} onChange={e => set("nokName", e.target.value)}/></div>
            <div><label className={labelCls}>Next of Kin — Phone</label><input data-testid="input-nok-phone" className={inputCls} type="tel" placeholder="080XXXXXXXX" value={form.nokPhone} onChange={e => set("nokPhone", e.target.value)}/></div>
            <div>
              <label className={labelCls}>Relationship</label>
              <select data-testid="select-nok-rel" className={inputCls} value={form.nokRelationship} onChange={e => set("nokRelationship", e.target.value)}>
                <option value="">Select relationship</option>
                <option>Spouse</option><option>Parent</option><option>Sibling</option><option>Child</option><option>Friend</option><option>Other</option>
              </select>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="bg-card border border-border rounded-2xl p-4 mb-2 space-y-1.5">
              <p className="text-xs font-bold text-foreground mb-2">Review your details</p>
              {[["Name", form.fullName], ["Email", form.email], ["Phone", form.phone], ["Address", `${form.homeAddress}, ${form.city}, ${form.state}`], ["ID", `${form.idType} — ${form.idNumber}`], ["Next of Kin", `${form.nokName} (${form.nokRelationship})`]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs gap-3">
                  <span className="text-muted-foreground flex-shrink-0">{k}</span>
                  <span className="text-foreground font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
            <div><label className={labelCls}>Create Password (min 6 characters)</label><input data-testid="input-password" className={inputCls} type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)}/></div>
            <div>
              <label className={labelCls}>Confirm Password</label>
              <input data-testid="input-confirm-password" className={inputCls} type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}/>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords do not match</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="px-5 pb-8 pt-4">
        <button
          data-testid="button-next-submit"
          disabled={!canNext() || loading}
          onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : handleSubmit()}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account…" : step < STEPS.length - 1 ? "Continue →" : "Create My Account →"}
        </button>
        {step === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            Already have an account?{" "}
            <button onClick={() => nav("/login")} className="text-primary font-semibold" data-testid="link-login">Sign in</button>
          </p>
        )}
      </div>
    </div>
  );
}
