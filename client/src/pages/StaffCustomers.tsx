import { useLocation } from "wouter";
import { getIsStaff } from "@/lib/auth";
import { getAllCustomers } from "@/lib/store";
import { type Customer } from "@shared/schema";
import { useEffect, useState } from "react";

function StaffNav({ active }: { active: string }) {
  const [, nav] = useLocation();
  return (
    <div className="sticky bottom-0 bg-card border-t border-border px-4 pt-3 pb-6 flex justify-around">
      {[{ label: "Requests", icon: "📋", path: "/staff/dashboard" }, { label: "Customers", icon: "👥", path: "/staff/customers" }].map(item => (
        <button key={item.label} onClick={() => nav(item.path)} className={`flex flex-col items-center gap-1 ${active === item.label ? "text-primary" : "text-muted-foreground"}`}>
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-semibold">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function StaffCustomers() {
  const [, nav] = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const isStaff = getIsStaff();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isStaff) { nav("/staff"); return; }
    getAllCustomers().then(data => { setCustomers(data); setLoading(false); });
  }, [isStaff]);

  if (!isStaff) return null;

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-10 pb-4 flex items-center gap-4">
        <button onClick={() => nav("/staff/dashboard")} className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <h1 className="font-bold text-foreground text-lg">Registered Customers</h1>
        <span className="ml-auto text-xs font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">{loading ? "…" : customers.length}</span>
      </div>

      <div className="px-5 flex-1">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Loading customers…</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-sm">No customers registered yet.</p>
            <p className="text-xs mt-1">Share the app link to get started!</p>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {customers.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="w-full p-4 flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{initials(c.full_name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{c.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.email} · {c.phone}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`flex-shrink-0 transition-transform ${expanded === c.id ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {expanded === c.id && (
                  <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
                    {[
                      ["Date of Birth", c.date_of_birth],
                      ["Gender", c.gender],
                      ["Address", `${c.home_address}, ${c.city}, ${c.state}`],
                      ["Government ID", `${c.id_type} — ${c.id_number}`],
                      ["Next of Kin", `${c.nok_name} (${c.nok_relationship})`],
                      ["NOK Phone", c.nok_phone],
                      ["Registered", new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs gap-4">
                        <span className="text-muted-foreground flex-shrink-0">{k}</span>
                        <span className="text-foreground font-medium text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <StaffNav active="Customers"/>
    </div>
  );
}
