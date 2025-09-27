import { useContext } from 'react';
import { GDPRContext, GDPRContextType } from '@/components/gdpr/GDPRProvider';

/**
 * Hook pro snadný přístup k GDPR kontextu (souhlasy a akce).
 * Musí být použit uvnitř komponenty, která je obalena GDPRProviderem.
 */
export const useCookieConsent = (): GDPRContextType => {
  const context = useContext(GDPRContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a GDPRProvider');
  }
  return context;
};