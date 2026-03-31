export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 2L4 5.5V11c0 4.5 3.4 8.7 8 9.9 4.6-1.2 8-5.4 8-9.9V5.5L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 12c0-1.1.9-2 2-2s2 .9 2 2-2 3-2 3-2-1.9-2-3z" fill="white"/>
            </svg>
          </div>
          <span className="font-bold font-serif text-text text-xl">Confidentia</span>
        </div>
      </header>

      {/* Wizard Content */}
      <main className="w-full max-w-2xl mx-auto pt-20">
        {children}
      </main>
    </div>
  );
}
