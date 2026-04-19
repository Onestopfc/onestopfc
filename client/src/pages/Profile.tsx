import { useLocation } from "wouter";
import { getCustomer, logout } from "@/lib/auth";

function NavBar({ active }: { active: string }) {
  const [, nav] = useLocation();
  const items = [
    { label: "Home", path: "/dashboard", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { label: "My Loans", path: "/loans", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg> },
    { label: "Request", path: "/loan/new", icon: null },
    { label: "Profile", path: "/profile", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];
  return (
    <div className="sticky bottom-0 border-t border-border px-2 pt-2 pb-6 flex justify-around" style={{ background: "hsl(158 18% 6%)" }}>
      {items.map(item => {
        const isActive = active === item.label;
        return (
          <button key={item.label} onClick={() => nav(item.path)}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-colors"
            style={isActive ? { color: "hsl(152 60% 48%)" } : { color: "hsl(140 8% 40%)" }}>
            {item.label === "Request" ? (
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center -mt-6 shadow-lg"
                style={{ background: "hsl(152 60% 42%)", boxShadow: "0 0 20px hsl(152 60% 42% / 0.5)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
            ) : item.icon}
            <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Profile() {
  const [, nav] = useLocation();
  const customer = getCustomer();

  if (!customer) { nav("/login"); return null; }

  const initials = customer.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const sections = [
    {
      title: "Personal",
      icon: "👤",
      fields: [
        { label: "Full Name", value: customer.full_name },
        { label: "Email", value: customer.email },
        { label: "Phone", value: customer.phone },
        { label: "Date of Birth", value: customer.date_of_birth },
        { label: "Gender", value: customer.gender },
      ]
    },
    {
      title: "Address",
      icon: "🏠",
      fields: [
        { label: "Home Address", value: customer.home_address },
        { label: "City", value: customer.city },
        { label: "State", value: customer.state },
      ]
    },
    {
      title: "Identification",
      icon: "🪪",
      fields: [
        { label: "ID Type", value: customer.id_type },
        { label: "ID Number", value: customer.id_number },
      ]
    },
    {
      title: "Next of Kin",
      icon: "👨‍👩‍👦",
      fields: [
        { label: "Full Name", value: customer.nok_name },
        { label: "Phone", value: customer.nok_phone },
        { label: "Relationship", value: customer.nok_relationship },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-5 flex items-center justify-between">
        <button onClick={() => nav("/dashboard")}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
          style={{ background: "hsl(158 16% 8%)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <p className="font-bold text-foreground text-base">My Profile</p>
        <button onClick={() => { logout(); nav("/"); }}
          className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors">
          Logout
        </button>
      </div>

      {/* Avatar hero card */}
      <div className="px-5 mb-6">
        <div className="gradient-card rounded-3xl p-5 green-glow">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.18)" }}>
              <span className="text-white font-bold text-xl">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-lg leading-tight truncate">{customer.full_name}</p>
              <p className="text-white/55 text-xs mt-0.5 truncate">{customer.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/12 text-white/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  VERIFIED MEMBER
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-white/45 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Member since {new Date(customer.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Sectioned fields */}
      <div className="px-5 flex-1 space-y-4 pb-4">
        {sections.map(sec => (
          <div key={sec.title} className="elite-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
              <span className="text-sm">{sec.icon}</span>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{sec.title}</p>
            </div>
            {sec.fields.map((f, i) => (
              <div key={f.label} className={`px-4 py-3 flex justify-between items-center gap-4 ${i < sec.fields.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-xs text-muted-foreground flex-shrink-0">{f.label}</span>
                <span className="text-sm font-semibold text-foreground text-right leading-snug">{f.value}</span>
              </div>
            ))}
          </div>
        ))}

        <p className="text-center text-xs text-muted-foreground pb-2">
          To update your details, contact One Stop FC directly.
        </p>
      </div>

      <NavBar active="Profile" />
    </div>
  );
}
