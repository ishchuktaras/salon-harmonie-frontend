import Cookies from 'js-cookie';

// Typ pro objekt se souhlasy
export type Consents = Record<string, boolean>;

/**
 * Získá stav souhlasu s cookies z 'cookie_consent'.
 * @returns {Consents} Objekt s aktuálními souhlasy, např. { analytics: true }.
 */
export const getCookieConsent = (): Consents => {
  const cookie = Cookies.get('cookie_consent');
  if (cookie) {
    try {
      return JSON.parse(cookie) as Consents;
    } catch (e) {
      return {};
    }
  }
  return {};
};

/**
 * Uloží stav souhlasu do 'cookie_consent'.
 * @param {Consents} consents - Objekt se souhlasy k uložení.
 */
export const setCookieConsent = (consents: Consents): void => {
  Cookies.set('cookie_consent', JSON.stringify(consents), { expires: 365, path: '/' });
};