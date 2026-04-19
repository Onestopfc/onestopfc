import { useLocation } from "wouter";
import { getCustomer, logout } from "@/lib/auth";

export default function Profile() {
  const [, nav] = useLocation();
  const customer = getCustomer();

  if (!customer) { nav("/login"); return null; }

  const initials = customer.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const fields = [
    { label: "Full Name", value: customer.full_name },
    { label: "Email Address", value: customer.email },
    { label: "Phone Number", value: customer.phone },
    { label: "Date of Birth", value: customer.date_of_birth },
    { label: "Gender", value: customer.gender },
    { label: "Home Address", value: customer.home_address },
    { label: "City", value: customer.city },
    { label: "State", value: customer.state },
    { label: "ID Type", value: customer.id_type },
    { label: "ID Number", value: customer.id_number },
    { label: "Next of Kin", value: customer.nok_name },
    { label: "NOK Phone", value: customer.nok_phone },
    { label: "NOK Relationship", value: customer.nok_relationship },
    { label: "Member Since", value: new Date(customer.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => nav("/dashboard")} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <h1 className="font-bold text-foreground text-base">My Profile</h1>
          <button onClick={() => { logout(); nav("/"); }} className="text-xs text-muted-foreground hover:text-destructive transition-colors font-semibold">
            Logout
          </button>
        </div>

        {/* Avatar card */}
        <div className="gradient-card rounded-2xl p-5 flex items-center gap-4 green-glow">
          <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-lg leading-tight">{customer.full_name}</p>
            <p className="text-white/60 text-xs mt-0.5">{customer.email}</p>
            <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white/80">
              VERIFIED MEMBER
            </span>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="px-5 flex-1 pb-8">
        <div className="elite-card overflow-hidden">
          {fields.map((f, i) => (
            <div key={f.label} className={`px-4 py-3.5 flex justify-between items-start gap-4 ${i < fields.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">{f.label}</span>
              <span className="text-sm font-semibold text-foreground text-right leading-snug">{f.value}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          To update your details, contact One Stop FC directly.
        </p>
      </div>
    </div>
  );
}
