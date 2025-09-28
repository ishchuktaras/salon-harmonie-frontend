// Soubor: src/app/zasady-ochrany-osobnich-udaju/page.tsx

import Link from 'next/link';

const PrivacyPolicyPage = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <article className="prose max-w-none lg:prose-lg">
        <h1>Zásady ochrany osobních údajů</h1>
        <p>
          <em>Poslední aktualizace: 28. září 2025</em>
        </p>

        <h2>1. Správce osobních údajů</h2>
        <p>
          <strong>Salon Harmonie</strong>
          <br />
          Provozovatel: Taras Ishchuk
          <br />
          IČO: [DOPLNIT IČO]
          <br />
          Sídlo: [DOPLNIT ADRESU, Jihlava]
          <br />
          Email: ishchuktaras@gmail.com
          <br />
          Telefon: [DOPLNIT TELEFON]
        </p>

        <h2>2. Jaké osobní údaje zpracováváme</h2>

        <h3>2.1 Údaje poskytnuté vámi</h3>
        <ul>
          <li>
            <strong>Registrace a rezervace služeb:</strong> Jméno a příjmení,
            e-mailová adresa, telefonní číslo, heslo (bezpečně uloženo).
          </li>
          <li>
            <strong>Při platbě v salonu:</strong> Fakturační údaje (jméno,
            adresa, IČO) pro účely dokladu.
          </li>
          <li>
            <strong>Komunikace:</strong> Obsah zpráv nebo dotazů, které nám
            zašlete.
          </li>
        </ul>

        <h3>2.2 Automaticky sbírané údaje</h3>
        <ul>
          <li>
            <strong>Technické údaje:</strong> IP adresa, typ a verze
            prohlížeče, operační systém.
          </li>
          <li>
            <strong>Cookies a podobné technologie:</strong>
            <ul>
              <li>
                <strong>Nezbytné cookies:</strong> Pro fungování přihlášení a
                rezervačního systému.
              </li>
              <li>
                <strong>Analytické cookies (Google Analytics):</strong> Pro
                sledování návštěvnosti – pouze s vaším souhlasem.
              </li>
              <li>
                <strong>Marketingové cookies:</strong> Pro marketingové účely –
                pouze s vaším souhlasem.
              </li>
            </ul>
          </li>
        </ul>

        <h2>3. Účel a právní základ zpracování</h2>
        <ul>
          <li>
            <strong>Poskytování služeb:</strong> Zpracování je nezbytné pro
            plnění smlouvy (vaší rezervace). Doba uchovávání je po dobu
            trvání vašeho klientského vztahu a následně 3 roky.
          </li>
          <li>
            <strong>Marketing a komunikace:</strong> Na základě vašeho
            souhlasu, který můžete kdykoliv odvolat.
          </li>
          <li>
            <strong>Analýza návštěvnosti:</strong> Na základě vašeho souhlasu
            za účelem vylepšování našich stránek.
          </li>
          <li>
            <strong>Právní povinnosti:</strong> Zejména pro účetnictví a
            daňové účely, kde údaje uchováváme až 10 let.
          </li>
        </ul>

        <h2>4. Předávání osobních údajů</h2>
        <p>
          Vaše osobní údaje mohou být předávány následujícím kategoriím
          zpracovatelů:
        </p>
        <ul>
          <li>
            <strong>Technologičtí partneři:</strong>
            <ul>
              <li>
                <strong>Stormware (POHODA):</strong> Účetní systém, Česká
                republika.
              </li>
              <li>
                <strong>Google Analytics:</strong> Analytický nástroj, USA
                (zabezpečeno standardními smluvními doložkami).
              </li>
              <li>
                <strong>Vercel:</strong> Hosting naší webové aplikace, USA
                (zabezpečeno standardními smluvními doložkami).
              </li>
              <li>
                <strong>WEDOS:</strong> Hosting naší databáze, Česká republika.
              </li>
            </ul>
          </li>
          <li>
            <strong>Obchodní partneři:</strong>
            <ul>
              <li>Účetní a daňové služby, Česká republika.</li>
            </ul>
          </li>
        </ul>

        <h2>5. Vaše práva podle GDPR</h2>
        <p>Máte následující práva:</p>
        <ul>
          <li>Právo na přístup k vašim osobním údajům.</li>
          <li>Právo na opravu nepřesných údajů.</li>
          <li>Právo na výmaz (být zapomenut).</li>
          <li>Právo na omezení zpracování.</li>
          <li>Právo na přenositelnost údajů.</li>
          <li>Právo vznést námitku proti zpracování.</li>
          <li>Právo kdykoli odvolat udělený souhlas.</li>
        </ul>

        <h2>6. Jak uplatnit vaše práva</h2>
        <p>
          Pro uplatnění vašich práv nás kontaktujte na e-mailu{' '}
          <strong>ishchuktaras@gmail.com</strong>. Na vaše žádosti odpovíme
          nejpozději do <strong>30 dnů</strong>.
        </p>

        <h2>7. Zabezpečení osobních údajů</h2>
        <p>
          Přijali jsme vhodná technická a organizační opatření pro zabezpečení
          vašich osobních údajů, včetně šifrování komunikace (SSL/TLS) a
          omezeného přístupu k datům.
        </p>

        <h2>8. Cookies a sledovací technologie</h2>
        <p>
          Používáme nezbytné cookies pro základní funkčnost webu. Analytické a
          marketingové cookies používáme pouze na základě vašeho explicitního
          souhlasu, který můžete spravovat prostřednictvím cookie lišty na našem
          webu.
        </p>

        <h2>9. Změny zásad ochrany osobních údajů</h2>
        <p>
          Tyto zásady můžeme čas od času aktualizovat. O podstatných změnách vás
          budeme informovat na našich webových stránkách nebo e-mailem.
        </p>

        <h2>10. Stížnosti a dozorový úřad</h2>
        <p>
          Pokud nejste spokojeni s naším přístupem, máte právo podat stížnost u
          dozorového úřadu:
        </p>
        <p>
          <strong>Úřad pro ochranu osobních údajů</strong>
          <br />
          Pplk. Sochora 27
          <br />
          170 00 Praha 7
          <br />
          Web: www.uoou.cz
        </p>
        
        <h2>11. Kontakt pro otázky ohledně GDPR</h2>
        <p>
          <strong>Odpovědná osoba</strong>: Taras Ishchuk
          <br />
          <strong>E-mail</strong>: ishchuktaras@gmail.com
          <br />
          <strong>Adresa</strong>: [DOPLNIT ADRESU, Jihlava]
        </p>

        <hr />
        <p className="text-sm text-gray-500">
          Tyto zásady jsou v souladu s nařízením EU 2016/679 (GDPR) a zákonem č.
          110/2019 Sb., o zpracování osobních údajů.
        </p>
      </article>
    </main>
  );
};

export default PrivacyPolicyPage;