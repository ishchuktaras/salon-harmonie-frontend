import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext'; // Import AuthProvider

// Načtení fontů podle strategického dokumentu
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Salon Harmonie - Rezervační Systém',
  description: 'Vítejte v digitálním prostředí Salonu Harmonie.',
};

// Hlavní layout komponenta
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Tento layout je nyní jednodušší. Obaluje celou aplikaci
  // AuthProviderem, aby byl přihlašovací stav dostupný všude.
  // Specifické layouty (jako admin panel nebo přihlašovací stránka)
  // si řeší své vlastní zobrazení samy.
  return (
    <html lang="cs">
      <body className={`${inter.variable} font-sans bg-brand-accent`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}