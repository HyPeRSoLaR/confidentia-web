import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trouver un thérapeute | Confidentia',
  description: 'Parcourez et réservez des séances avec des professionnels de santé mentale certifiés.',
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
