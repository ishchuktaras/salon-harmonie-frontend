import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], weight: "700", variable: "--font-playfair-display" });

export const metadata: Metadata = {
  title: "Salon Harmonie - Systém Řízení",
  description: "Interní systém pro správu Salonu Harmonie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, playfairDisplay.variable)}>
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
