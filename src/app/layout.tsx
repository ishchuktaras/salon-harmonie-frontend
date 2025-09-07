// Soubor: src/app/layout.tsx
// Popis: Hlavní layout aplikace. Zde integrujeme náš AuthProvider.

// Importujeme AuthProvider z jeho nového, odděleného umístění.
import { AuthProvider } from '@/providers/auth-provider';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Salón Harmonie',
  description: 'Administrační systém',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        {/*
          Obalením celé aplikace (reprezentované proměnnou `children`)
          do AuthProvideru zajistíme, že každá komponenta níže v hierarchii
          bude mít přístup k autentizačnímu kontextu.
        */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

