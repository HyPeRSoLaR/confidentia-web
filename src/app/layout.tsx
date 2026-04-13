import type { Metadata } from 'next';
import { Lora, Nunito } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });

export const metadata: Metadata = {
  title: 'Confidentia — Plateforme IA de Bien-être',
  description: 'Soutien au bien-être mental et émotionnel, guidé par l\'IA, privé et confidentiel pour les individus et les organisations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${nunito.variable} ${lora.variable}`}>
      <body className="min-h-screen bg-bg text-text font-sans antialiased transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
