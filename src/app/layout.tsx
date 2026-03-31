import type { Metadata } from 'next';
import { Lora, Nunito } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });

export const metadata: Metadata = {
  title: 'Confidentia — AI-Powered Well-being Platform',
  description: 'Private, AI-guided mental and emotional well-being support for individuals and organizations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${nunito.variable} ${lora.variable}`}>
      <body className="min-h-screen bg-bg text-text font-sans antialiased transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
