import { useLocation } from "wouter";
import { getIsStaff } from "@/lib/auth";
import { getAllCustomers } from "@/lib/store";
import { type Customer } from "@shared/schema";
import { useEffect, useState } from "react";
import { StaffNav } from "./StaffDashboard";

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
      {/* Header */}
      <div className="px-5 pt-10 pb-5 flex items-center gap-3">
        <button onClick={() => nav("/staff/dashboard")}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
          style={{ background: "hsl(158 16% 8%)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Staff Portal</p>
          <h1 className="font-bold text-foreground text-base">Registered Customers</h1>
        </div>
        {!loading && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "hsl(152 55% 10%)", color: "hsl(152 60% 48%)", border: "1px solid hsl(152 35% 18%)" }}>
            {customers.length} total
          </span>
        )}
      </div>

      <div className="px-5 flex-1">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="shimmer h-16 rounded-2xl" />)}
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
              style={{ background: "hsl(152 55% 10%)", border: "1px solid hsl(152 35% 18%)" }}>👥</div>
            <p className="text-sm font-bold text-foreground mb-1">No customers yet</p>
            <p className="text-xs text-muted-foreground">Share the app link to get started!</p>
          </div>
        ) : (
          <div className="space-y-2.5 pb-6">
            {customers.map(c => (
              <div key={c.id} className="elite-card overflow-hidden">
                <button onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="w-full p-4 flex items-center gap-3 text-left">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, hsl(152 60% 28%), hsl(152 60% 42%))" }}>
                    <span className="text-white font-bold text-sm">{initials(c.full_name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground leading-tight">{c.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{c.email} · {c.phone}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${expanded === c.id ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {expanded === c.id && (
                  <div className="border-t border-border">
                    {[
                      ["Date of Birth", c.date_of_birth],
                      ["Gender", c.gender],
                      ["Address", `${c.home_address}, ${c.city}, ${c.state}`],
                      ["Government ID", `${c.id_type} · ${c.id_number}`],
                      ["Next of Kin", `${c.nok_name} (${c.nok_relationship})`],
                      ["NOK Phone", c.nok_phone],
                      ["Registered", new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
                    ].map(([k, v], i, arr) => (
                      <div key={k} className={`px-4 py-2.5 flex justify-between gap-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{k}</span>
                        <span className="text-xs text-foreground font-semibold text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <StaffNav active="Customers" />
    </div>
  );
}
