'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCookieConsent, setCookieConsent, Consents } from '@/lib/gdpr/utils';
import CookieConsentBanner from './CookieConsentBanner';

// Definice typů pro hodnotu kontextu
export interface GDPRContextType {
  consents: Consents;
  updateConsent: (key: string, value: boolean) => void;
  acceptAllConsents: () => void;
  isBannerOpen: boolean;
  closeBanner: () => void;
}

export const GDPRContext = createContext<GDPRContextType | undefined>(undefined);

// Typ pro props komponenty
interface GDPRProviderProps {
  children: ReactNode;
}

const GDPRProvider = ({ children }: GDPRProviderProps) => {
  const [consents, setConsents] = useState<Consents>({ necessary: true });
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  useEffect(() => {
    const savedConsents = getCookieConsent();
    if (Object.keys(savedConsents).length === 0) {
      // Žádný souhlas nebyl uložen, zobrazíme banner s výchozím nastavením
      setIsBannerOpen(true);
      setConsents({ necessary: true, analytics: false, marketing: false });
    } else {
      setConsents(savedConsents);
    }
  }, []);

  const updateConsent = (key: string, value: boolean) => {
    if (key === 'necessary') return; // Nezbytné cookies nelze vypnout
    setConsents((prevConsents) => ({ ...prevConsents, [key]: value }));
  };
  
  const acceptAllConsents = () => {
      const allAccepted: Consents = { ...consents, analytics: true, marketing: true };
      setConsents(allAccepted);
      setCookieConsent(allAccepted);
      setIsBannerOpen(false);
  };

  const closeBanner = () => {
    setCookieConsent(consents);
    setIsBannerOpen(false);
  };

  return (
    <GDPRContext.Provider value={{ consents, updateConsent, acceptAllConsents, isBannerOpen, closeBanner }}>
      {children}
      {isBannerOpen && <CookieConsentBanner />}
    </GDPRContext.Provider>
  );
};

export default GDPRProvider;