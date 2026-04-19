import { useLocation } from "wouter";
import { LogoWordmark } from "@/components/Logo";

export default function Landing() {
  const [, nav] = useLocation();
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* Ambient glow top */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse at center, hsl(152 60% 42%) 0%, transparent 70%)" }} />

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-20 pb-10 relative">
        <LogoWordmark size={60} />

        {/* Tagline chip */}
        <div className="mt-7 mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot flex-shrink-0" />
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Enugu's Premier Pawn Service</span>
        </div>

        <h1 className="text-4xl font-bold text-foreground leading-tight mb-4 max-w-xs mx-auto">
          Get Cash<br/>
          <span style={{ color: "hsl(152 60% 50%)" }}>Instantly</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed mb-10">
          Secure loans against your valuables. Simple online request — assessed by our team within 24 hours.
        </p>

        {/* CTAs */}
        <div className="w-full max-w-xs space-y-3 mb-12">
          <button
            data-testid="button-get-started"
            onClick={() => nav("/register")}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
            style={{ boxShadow: "0 8px 32px hsl(152 60% 42% / 0.35)" }}
          >
            Apply Now — It's Free
          </button>
          <button
            data-testid="button-login"
            onClick={() => nav("/login")}
            className="w-full bg-card border border-border text-foreground rounded-2xl py-4 font-semibold text-sm hover:border-primary/40 hover:bg-accent/30 transition-colors"
          >
            Sign In to My Account
          </button>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-12">
          {[
            { icon: "⚡", label: "Fast", sub: "Under 24h" },
            { icon: "🔒", label: "Secure", sub: "Items insured" },
            { icon: "💰", label: "5%/mo", sub: "Flat rate" },
          ].map(b => (
            <div key={b.label} className="elite-card p-3 text-center">
              <span className="text-xl block mb-1">{b.icon}</span>
              <p className="text-xs font-bold text-foreground">{b.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{b.sub}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="w-full max-w-xs text-left">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-5">How It Works</p>
          <div className="space-y-4">
            {[
              { step: "1", title: "Create your profile", desc: "Quick KYC verification — 2 minutes" },
              { step: "2", title: "Submit your item", desc: "Describe + estimated value of what you want to pawn" },
              { step: "3", title: "Get an offer", desc: "Our team appraises and sends you a loan offer" },
              { step: "4", title: "Collect your cash", desc: "Visit us, hand over item, walk out with funds" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground text-xs font-bold"
                  style={{ background: "hsl(152 60% 42%)", boxShadow: "0 0 12px hsl(152 60% 42% / 0.4)" }}>
                  {s.step}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                {i < 3 && (
                  <div className="absolute left-0 h-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 w-full max-w-xs">
          <div className="elite-card p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "hsl(152 55% 10%)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(152 60% 48%)" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              All items fully insured · Max ₦20,000,000<br/>
              <span className="text-foreground font-semibold">One Stop FC · Enugu, Nigeria</span>
            </p>
          </div>
        </div>
      </div>

      {/* Staff footer */}
      <div className="text-center pb-8">
        <button onClick={() => nav("/staff")} className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors" data-testid="link-staff">
          Staff Portal →
        </button>
      </div>
    </div>
  );
}
