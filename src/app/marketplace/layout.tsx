import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find a Therapist | Confidentia',
  description: 'Browse and book sessions with verified mental health professionals.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-glow">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
