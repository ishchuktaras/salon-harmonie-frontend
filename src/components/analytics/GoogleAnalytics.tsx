// Soubor: src/components/analytics/GoogleAnalytics.tsx
'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';
import Script from 'next/script';

/**
 * Komponenta pro Google Analytics (GA4).
 * Načítá a spouští měřicí skripty pouze v případě, že uživatel udělil
 * souhlas s analytickými cookies.
 */
const GoogleAnalytics = () => {
  const { consents } = useCookieConsent();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // 1. Zkontrolujeme, zda máme ID a zda uživatel souhlasil.
  if (!gaMeasurementId || !consents.analytics) {
    return null; // Pokud ne, komponenta nic nevykreslí a skripty se nenačtou.
  }

  // 2. Pokud je vše v pořádku, vykreslíme potřebné skripty.
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;