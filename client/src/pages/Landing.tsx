import { useLocation } from "wouter";
import { LogoWordmark } from "@/components/Logo";

export default function Landing() {
  const [, nav] = useLocation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-16 pb-10">
        <LogoWordmark size={64} />

        <div className="mt-10 mb-8">
          <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
            Fast & Secure<br/>Pawn Loans
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            Get instant loans against your valuables. Submit your request online, get assessed by our team in under 24 hours.
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3 mb-10 w-full max-w-xs">
          {[
            { icon: "⚡", label: "Fast Approval", sub: "Under 24h" },
            { icon: "🔒", label: "Secure", sub: "Insured items" },
            { icon: "💰", label: "5% /month", sub: "Flat rate" },
          ].map(b => (
            <div key={b.label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <span className="text-xl block mb-1">{b.icon}</span>
              <p className="text-xs font-semibold text-foreground">{b.label}</p>
              <p className="text-xs text-muted-foreground">{b.sub}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="w-full max-w-xs space-y-3">
          <button
            data-testid="button-get-started"
            onClick={() => nav("/register")}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold text-base hover:opacity-90 transition-opacity"
          >
            Get Started — Apply Now
          </button>
          <button
            data-testid="button-login"
            onClick={() => nav("/login")}
            className="w-full bg-card border border-border text-foreground rounded-2xl py-4 font-semibold text-sm hover:bg-muted/30 transition-colors"
          >
            I already have an account
          </button>
        </div>

        {/* How it works */}
        <div className="mt-12 w-full max-w-xs text-left">
          <h2 className="font-bold text-foreground text-sm mb-4 text-center">How It Works</h2>
          <div className="space-y-3">
            {[
              { step: "1", title: "Create your profile", desc: "Quick KYC — takes 2 minutes" },
              { step: "2", title: "Submit your item", desc: "Photos + description of what you want to pawn" },
              { step: "3", title: "Get assessed", desc: "Our team reviews and offers you a loan amount" },
              { step: "4", title: "Receive your funds", desc: "Come in, hand over item, collect cash" },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground text-xs font-bold">{s.step}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Max loan: ₦20,000,000 · 5% flat interest/month
        </p>
      </div>

      {/* Staff footer link */}
      <div className="text-center pb-6">
        <button onClick={() => nav("/staff")} className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors" data-testid="link-staff">
          Staff Portal →
        </button>
      </div>
    </div>
  );
}
