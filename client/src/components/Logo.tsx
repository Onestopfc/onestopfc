export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="One Stop FC Logo">
      <rect width="48" height="48" rx="13" fill="hsl(183 70% 42%)"/>
      {/* Letter O shape */}
      <path d="M24 10C16.27 10 10 16.27 10 24C10 31.73 16.27 38 24 38C31.73 38 38 31.73 38 24C38 16.27 31.73 10 24 10Z" stroke="white" strokeWidth="3" fill="none"/>
      <path d="M24 16C19.58 16 16 19.58 16 24C16 28.42 19.58 32 24 32C28.42 32 32 28.42 32 24C32 19.58 28.42 16 24 16Z" fill="white" opacity="0.25"/>
      <circle cx="24" cy="24" r="4" fill="white"/>
    </svg>
  );
}

export function LogoWordmark({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={size} />
      <div>
        <p className="font-bold text-foreground leading-tight text-lg" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>One Stop FC</p>
        <p className="text-xs text-muted-foreground leading-tight">Enugu, Nigeria</p>
      </div>
    </div>
  );
}
