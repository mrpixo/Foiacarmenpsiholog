import { useLanguage } from "../../i18n";
import { LegalLayout } from "./LegalLayout";

const UPDATED = "11 iunie 2026";
const UPDATED_EN = "11 June 2026";

export function TermsOfUse() {
  const { language } = useLanguage();
  return language === "ro" ? <TermsRO /> : <TermsEN />;
}

function TermsRO() {
  return (
    <LegalLayout eyebrow="Termeni" title="Termeni și condiții" updated={UPDATED}>
      <p>
        Acești termeni și condiții reglementează utilizarea site-ului și a serviciilor oferite de{" "}
        <strong>Cabinet Individual Psihologie Carmen Foia</strong> („Cabinetul", „noi"). Prin
        utilizarea site-ului și prin efectuarea unei programări, ești de acord cu acești termeni.
      </p>

      <h2>1. Identitatea furnizorului</h2>
      <ul>
        <li><strong>Denumire:</strong> Cabinet Individual Psihologie Carmen Foia</li>
        <li><strong>CUI:</strong> 54513889</li>
        <li><strong>Adresă:</strong> Str. Vasile Alecsandri nr. 7, Oradea, România</li>
        <li><strong>Email:</strong> contact@psihologcarmenfoia.ro</li>
        <li><strong>Telefon / WhatsApp:</strong> +40 7949 514 255</li>
      </ul>

      <h2>2. Serviciile oferite</h2>
      <p>
        Cabinetul oferă servicii de psihologie și consiliere (de ex. psihologie sportivă, orientare
        vocațională, anxietate de performanță, terapie individuală, terapie de cuplu, dezvoltare
        personală), în ședințe individuale sau de cuplu, online sau la cabinet, conform programării.
      </p>

      <h2>3. Programări</h2>
      <ul>
        <li>Programările se efectuează prin sistemul online de pe site, alegând motivul ședinței și un interval disponibil.</li>
        <li>O programare se consideră confirmată numai după efectuarea cu succes a plății.</li>
        <li>Vei primi pe email o confirmare a programării și o chitanță pentru plată.</li>
        <li>Memento-uri sunt trimise înainte de ședință.</li>
      </ul>

      <h2>4. Prețuri și plată</h2>
      <ul>
        <li>Prețul standard al unei ședințe este de <strong>150 RON</strong>.</li>
        <li>Plata se efectuează online, cu cardul, prin procesatorul de plăți Stripe. Nu sunt acceptate alte metode de plată online.</li>
        <li>Pe extrasul de cont / pe statementul cardului, tranzacția va apărea sub denumirea <strong>psihologcarmenfoia.ro</strong>.</li>
        <li>Prețurile includ taxele aplicabile conform legislației în vigoare.</li>
      </ul>

      <h2>5. Politica de anulare și reprogramare</h2>
      <p>
        Te rugăm să anulezi sau să reprogramezi o ședință cu cel puțin <strong>2 zile lucrătoare</strong>{" "}
        înainte de ora programată. Anulările efectuate cu mai puțin de 2 zile lucrătoare înainte sau
        neprezentarea la ședință („no-show") pot atrage pierderea integrală a sumei plătite, întrucât
        intervalul rezervat nu mai poate fi oferit altcuiva. Solicitările de anulare sau reprogramare
        se transmit la contact@psihologcarmenfoia.ro.
      </p>

      <h2>6. Rambursări</h2>
      <ul>
        <li>Pentru anulările efectuate cu cel puțin 2 zile lucrătoare înainte de ședință, poți alege reprogramarea sau rambursarea integrală a sumei plătite.</li>
        <li>Rambursările se efectuează prin Stripe, către același card folosit la plată.</li>
        <li>După aprobarea rambursării, suma ajunge de regulă în contul tău în <strong>5–10 zile lucrătoare</strong>, în funcție de banca emitentă a cardului.</li>
        <li>Nu se percep taxe suplimentare pentru rambursare din partea noastră.</li>
      </ul>

      <h2>7. Natura serviciilor și limitarea răspunderii</h2>
      <ul>
        <li>Serviciile de psihologie nu reprezintă un substitut pentru asistență medicală de urgență. În situații de urgență, apelează 112.</li>
        <li>Rezultatele terapiei depind de mai mulți factori și nu pot fi garantate.</li>
        <li>Informațiile de pe site, inclusiv articolele de blog, au caracter informativ general și nu constituie sfaturi medicale sau psihologice personalizate.</li>
      </ul>

      <h2>8. Obligațiile utilizatorului și utilizarea acceptabilă</h2>
      <ul>
        <li>Să furnizezi informații corecte și complete la programare.</li>
        <li>
          Să nu folosești site-ul sau serviciile în scopuri ilegale, frauduloase sau neautorizate
          și să nu desfășori, prin intermediul lor, nicio activitate care încalcă legea sau drepturile
          altor persoane.
        </li>
        <li>Să nu încerci să accesezi neautorizat, să perturbi sau să compromiți funcționarea ori securitatea site-ului (de ex. prin viruși, atacuri automate sau extragerea neautorizată de date).</li>
        <li>Să nu publici conținut ilegal, ofensator sau care încalcă drepturile de proprietate intelectuală.</li>
        <li>Să respecti intervalul programat și regulile de desfășurare a ședințelor.</li>
      </ul>
      <p>
        Ne rezervăm dreptul de a refuza sau de a întrerupe accesul la servicii în cazul încălcării
        acestor obligații.
      </p>

      <h2>9. Proprietate intelectuală</h2>
      <p>
        Conținutul site-ului (texte, articole, imagini, logo, design) aparține Cabinetului sau este
        utilizat cu drept de licență și este protejat de legislația privind drepturile de autor.
        Reproducerea fără acord scris nu este permisă.
      </p>

      <h2>10. Confidențialitate și ștergerea datelor</h2>
      <p>
        Prelucrarea datelor cu caracter personal este descrisă în{" "}
        <a href="/privacy">Politica de confidențialitate</a>. Informațiile împărtășite în ședințe sunt
        protejate de secretul profesional. Poți solicita ștergerea datelor tale trimițând un email la{" "}
        contact@psihologcarmenfoia.ro; detaliile și termenele sunt explicate în Politica de
        confidențialitate.
      </p>

      <h2>11. Dreptul de retragere (servicii digitale)</h2>
      <p>
        Pentru serviciile care încep, cu acordul tău, înainte de expirarea termenului legal de
        retragere, dreptul de retragere poate înceta odată cu prestarea integrală a serviciului,
        conform legislației privind protecția consumatorilor.
      </p>

      <h2>12. Soluționarea litigiilor</h2>
      <p>
        Acești termeni sunt guvernați de legea română. Eventualele litigii se soluționează pe cale
        amiabilă sau, în caz contrar, de instanțele competente din România. Poți utiliza și platforma
        UE de soluționare online a litigiilor: ec.europa.eu/consumers/odr.
      </p>

      <h2>13. Modificări</h2>
      <p>
        Putem actualiza acești termeni periodic. Versiunea aplicabilă este cea publicată pe această
        pagină la momentul programării.
      </p>
    </LegalLayout>
  );
}

function TermsEN() {
  return (
    <LegalLayout eyebrow="Terms" title="Terms &amp; Conditions" updated={UPDATED_EN}>
      <p>
        These terms and conditions govern the use of the website and the services provided by{" "}
        <strong>Cabinet Individual Psihologie Carmen Foia</strong> ("the Practice", "we"). By using
        the website and making a booking, you agree to these terms.
      </p>

      <h2>1. Provider identity</h2>
      <ul>
        <li><strong>Name:</strong> Cabinet Individual Psihologie Carmen Foia</li>
        <li><strong>Tax ID (CUI):</strong> 54513889</li>
        <li><strong>Address:</strong> Str. Vasile Alecsandri nr. 7, Oradea, Romania</li>
        <li><strong>Email:</strong> contact@psihologcarmenfoia.ro</li>
        <li><strong>Phone / WhatsApp:</strong> +40 7949 514 255</li>
      </ul>

      <h2>2. Services offered</h2>
      <p>
        The Practice offers psychology and counselling services (e.g. sports psychology, vocational
        guidance, performance anxiety, individual therapy, couples therapy, personal development), in
        individual or couples sessions, online or at the office, as booked.
      </p>

      <h2>3. Bookings</h2>
      <ul>
        <li>Bookings are made through the online system on the website by choosing a session reason and an available time slot.</li>
        <li>A booking is confirmed only after payment has been completed successfully.</li>
        <li>You will receive a booking confirmation and a payment receipt by email.</li>
        <li>Reminders are sent before the session.</li>
      </ul>

      <h2>4. Pricing and payment</h2>
      <ul>
        <li>The standard price of a session is <strong>150 RON</strong>.</li>
        <li>Payment is made online by card through the payment processor Stripe. No other online payment methods are accepted.</li>
        <li>On your bank/card statement, the transaction will appear under the name <strong>psihologcarmenfoia.ro</strong>.</li>
        <li>Prices include applicable taxes under current legislation.</li>
      </ul>

      <h2>5. Cancellation and rescheduling policy</h2>
      <p>
        Please cancel or reschedule a session at least <strong>2 working days</strong> before the
        scheduled time. Cancellations made less than 2 working days in advance, or no-shows, may
        result in forfeiture of the full amount paid, since the reserved slot can no longer be offered
        to someone else. Cancellation or rescheduling requests should be sent to
        contact@psihologcarmenfoia.ro.
      </p>

      <h2>6. Refunds</h2>
      <ul>
        <li>For cancellations made at least 2 working days before the session, you may choose to reschedule or receive a full refund of the amount paid.</li>
        <li>Refunds are issued through Stripe, back to the same card used for payment.</li>
        <li>Once a refund is approved, the amount typically reaches your account within <strong>5–10 working days</strong>, depending on your card-issuing bank.</li>
        <li>We do not charge any additional fees for a refund.</li>
      </ul>

      <h2>7. Nature of services and limitation of liability</h2>
      <ul>
        <li>Psychology services are not a substitute for emergency medical care. In an emergency, call 112.</li>
        <li>Therapy outcomes depend on many factors and cannot be guaranteed.</li>
        <li>Information on the website, including blog articles, is general information and does not constitute personalised medical or psychological advice.</li>
      </ul>

      <h2>8. User obligations and acceptable use</h2>
      <ul>
        <li>Provide accurate and complete information when booking.</li>
        <li>
          Do not use the website or services for any unlawful, fraudulent, or unauthorised purpose,
          and do not carry out, through them, any activity that breaches the law or the rights of
          others.
        </li>
        <li>Do not attempt to gain unauthorised access to, disrupt, or compromise the operation or security of the website (e.g. via viruses, automated attacks, or unauthorised data scraping).</li>
        <li>Do not post content that is illegal, offensive, or infringes intellectual property rights.</li>
        <li>Respect the booked time slot and the rules for conducting sessions.</li>
      </ul>
      <p>
        We reserve the right to refuse or suspend access to the services if these obligations are
        breached.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        The website content (texts, articles, images, logo, design) belongs to the Practice or is
        used under licence and is protected by copyright law. Reproduction without written consent is
        not permitted.
      </p>

      <h2>10. Privacy and data deletion</h2>
      <p>
        The processing of personal data is described in our{" "}
        <a href="/privacy">Privacy Policy</a>. Information shared during sessions is protected by
        professional confidentiality. You can request deletion of your data by emailing
        contact@psihologcarmenfoia.ro; the details and timelines are explained in the Privacy Policy.
      </p>

      <h2>11. Right of withdrawal (digital services)</h2>
      <p>
        For services that begin, with your consent, before the end of the statutory withdrawal
        period, the right of withdrawal may end once the service has been fully performed, in
        accordance with consumer protection legislation.
      </p>

      <h2>12. Dispute resolution</h2>
      <p>
        These terms are governed by Romanian law. Any disputes are resolved amicably or, failing
        that, by the competent courts in Romania. You may also use the EU online dispute resolution
        platform: ec.europa.eu/consumers/odr.
      </p>

      <h2>13. Changes</h2>
      <p>
        We may update these terms from time to time. The applicable version is the one published on
        this page at the time of booking.
      </p>
    </LegalLayout>
  );
}
