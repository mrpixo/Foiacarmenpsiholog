import { useLanguage } from "../../i18n";
import { LegalLayout } from "./LegalLayout";

const UPDATED = "11 iunie 2026";
const UPDATED_EN = "11 June 2026";

export function PrivacyPolicy() {
  const { language } = useLanguage();
  return language === "ro" ? <PrivacyRO /> : <PrivacyEN />;
}

function PrivacyRO() {
  return (
    <LegalLayout eyebrow="Confidențialitate" title="Politica de confidențialitate" updated={UPDATED}>
      <p>
        Această politică de confidențialitate explică modul în care <strong>Cabinet Individual
        Psihologie Carmen Foia</strong> („Cabinetul", „noi") colectează, utilizează și protejează
        datele cu caracter personal ale persoanelor care vizitează acest site sau care folosesc
        serviciile noastre, în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și cu legislația
        română aplicabilă.
      </p>

      <h2>1. Operatorul de date</h2>
      <ul>
        <li><strong>Denumire:</strong> Cabinet Individual Psihologie Carmen Foia</li>
        <li><strong>CUI:</strong> 54513889</li>
        <li><strong>Adresă:</strong> Str. Vasile Alecsandri nr. 7, Oradea, România</li>
        <li><strong>Email:</strong> contact@psihologcarmenfoia.ro</li>
        <li><strong>Telefon / WhatsApp:</strong> +40 7949 514 255</li>
      </ul>

      <h2>2. Ce date colectăm</h2>
      <ul>
        <li><strong>Date de identificare și contact:</strong> nume, prenume, adresă de email, număr de telefon.</li>
        <li><strong>Date privind programările:</strong> motivul ședinței ales, data și ora, eventuale mențiuni adăugate de tine.</li>
        <li><strong>Date de plată:</strong> procesate exclusiv de furnizorul de plăți (Stripe). Nu stocăm și nu avem acces la datele complete ale cardului.</li>
        <li><strong>Date privind sănătatea:</strong> informațiile dezvăluite în cadrul ședințelor de psihoterapie sunt categorii speciale de date, prelucrate pe baza consimțământului și protejate de secretul profesional.</li>
        <li><strong>Date tehnice:</strong> adresă IP, tip de browser și date de utilizare colectate de furnizorii noștri de servicii pentru funcționarea și securitatea site-ului.</li>
      </ul>

      <h2>3. Scopurile și temeiurile prelucrării</h2>
      <ul>
        <li><strong>Programarea și furnizarea ședințelor</strong> — executarea contractului (art. 6 alin. 1 lit. b GDPR).</li>
        <li><strong>Procesarea plăților și emiterea documentelor fiscale</strong> — obligație legală și executarea contractului (art. 6 alin. 1 lit. b și c).</li>
        <li><strong>Prelucrarea datelor privind sănătatea în cadrul terapiei</strong> — consimțământ explicit și asistență medicală (art. 9 alin. 2 lit. a și h).</li>
        <li><strong>Răspunsul la mesajele tale de contact</strong> — interesul legitim de a comunica cu persoanele interesate (art. 6 alin. 1 lit. f).</li>
        <li><strong>Trimiterea confirmărilor, a memento-urilor și a chitanțelor</strong> — executarea contractului.</li>
      </ul>

      <h2>4. Furnizori de servicii (persoane împuternicite)</h2>
      <p>Pentru a furniza serviciile, folosim furnizori terți care prelucrează date în numele nostru:</p>
      <ul>
        <li><strong>Cal.com</strong> — sistemul de programări și gestionarea intervalelor disponibile.</li>
        <li><strong>Stripe</strong> — procesarea plăților cu cardul și emiterea chitanțelor.</li>
        <li><strong>Google Calendar</strong> — sincronizarea disponibilității și a programărilor.</li>
        <li><strong>Supabase</strong> — găzduirea bazei de date a blogului și a secțiunii de administrare.</li>
        <li><strong>DeepL</strong> — traducerea automată a articolelor de blog (procesează doar textul articolelor, nu datele vizitatorilor).</li>
        <li><strong>Google Analytics</strong> — statistici privind utilizarea site-ului (vezi secțiunea Cookie-uri).</li>
        <li><strong>Furnizorul de găzduire web</strong> — livrarea site-ului.</li>
      </ul>
      <p>
        Unii furnizori pot prelucra date în afara Spațiului Economic European. În aceste cazuri,
        transferurile sunt protejate prin clauze contractuale standard aprobate de Comisia Europeană
        sau prin alte garanții adecvate.
      </p>

      <h2>5. Cât timp păstrăm datele</h2>
      <p>
        Păstrăm datele doar atât timp cât este necesar scopurilor de mai sus: datele privind
        programările și ședințele pe durata relației terapeutice și ulterior conform obligațiilor
        legale și deontologice; documentele financiare pe perioada impusă de legislația fiscală (în
        general 10 ani); mesajele de contact pe o perioadă rezonabilă pentru a răspunde solicitării.
      </p>

      <h2>6. Drepturile tale</h2>
      <p>În conformitate cu GDPR, ai dreptul de:</p>
      <ul>
        <li>acces la datele tale;</li>
        <li>rectificare a datelor inexacte;</li>
        <li>ștergere („dreptul de a fi uitat"), în limitele obligațiilor legale;</li>
        <li>restricționare a prelucrării;</li>
        <li>portabilitate a datelor;</li>
        <li>opoziție la prelucrare;</li>
        <li>retragere a consimțământului în orice moment, fără a afecta legalitatea prelucrării anterioare.</li>
      </ul>
      <p>
        Pentru exercitarea acestor drepturi, ne poți contacta la contact@psihologcarmenfoia.ro. Ai,
        de asemenea, dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a
        Prelucrării Datelor cu Caracter Personal (ANSPDCP), www.dataprotection.ro.
      </p>

      <h3>Cum soliciți ștergerea datelor tale</h3>
      <p>
        Poți solicita oricând ștergerea datelor tale cu caracter personal trimițând un email la{" "}
        <strong>contact@psihologcarmenfoia.ro</strong>, cu subiectul „Ștergere date". Vom da curs
        cererii fără întârzieri nejustificate și, în orice caz, în termen de cel mult{" "}
        <strong>30 de zile</strong> (o lună) de la primire. Te putem ruga să îți confirmi identitatea
        pentru a preveni cererile neautorizate. Reține că anumite date pot fi păstrate atunci când
        legea ne obligă (de ex. documentele financiare/fiscale) sau pentru constatarea ori apărarea
        unui drept în justiție; în aceste cazuri îți vom explica temeiul păstrării.
      </p>

      <h2>7. Securitatea datelor</h2>
      <p>
        Aplicăm măsuri tehnice și organizatorice adecvate pentru a proteja datele împotriva
        accesului neautorizat, pierderii sau divulgării. Plățile sunt procesate prin conexiuni
        securizate, iar accesul la date este restricționat.
      </p>

      <h2>8. Cookie-uri și analiză (Google Analytics)</h2>
      <p>Folosim următoarele categorii de cookie-uri:</p>
      <ul>
        <li><strong>Esențiale</strong> — strict necesare pentru funcționarea site-ului și a programărilor. Sunt mereu active și nu pot fi dezactivate.</li>
        <li><strong>Analiză</strong> — ne ajută să înțelegem cum este folosit site-ul (de ex. Google Analytics). Active doar cu acordul tău.</li>
        <li><strong>Marketing</strong> — pentru personalizarea conținutului și a reclamelor. Active doar cu acordul tău.</li>
      </ul>
      <p>
        Cookie-urile opționale (analiză, marketing) <strong>nu sunt încărcate înainte de acordul
        tău</strong>. La prima vizită îți afișăm un banner prin care poți accepta toate cookie-urile,
        păstra doar pe cele esențiale sau personaliza alegerea pe categorii. Îți poți modifica sau
        retrage consimțământul oricând, folosind opțiunea <strong>„Setări cookie-uri"</strong> din
        subsolul site-ului, fără ca acest lucru să afecteze legalitatea prelucrării anterioare.
      </p>
      <p>
        De asemenea, folosim <strong>Google Analytics</strong>, un serviciu de analiză web furnizat
        de Google, pentru a înțelege cum este utilizat site-ul (de ex. pagini vizitate, durata
        vizitei, tipul de dispozitiv). Google Analytics utilizează cookie-uri și poate colecta
        adresa IP (în formă anonimizată/trunchiată) și identificatori de utilizare. Aceste date ne
        ajută să îmbunătățim site-ul. Prelucrarea se face pe baza consimțământului tău, exprimat
        prin bannerul de cookie-uri sau prin setările browserului. Îți poți retrage consimțământul
        oricând, poți bloca cookie-urile din setările browserului sau poți instala modulul de
        renunțare Google Analytics (tools.google.com/dlpage/gaoptout). Google poate transfera date
        în afara SEE, cu garanții adecvate.
      </p>

      <h2>9. Confidențialitatea ședințelor</h2>
      <p>
        Informațiile împărtășite în cadrul ședințelor de psihologie sunt confidențiale și protejate
        de secretul profesional, în conformitate cu Codul deontologic al profesiei de psiholog.
        Excepțiile sunt cele prevăzute de lege (de ex. existența unui pericol iminent).
      </p>

      <h2>10. Modificări ale acestei politici</h2>
      <p>
        Putem actualiza periodic această politică. Versiunea curentă este publicată pe această
        pagină, cu data ultimei actualizări.
      </p>
    </LegalLayout>
  );
}

function PrivacyEN() {
  return (
    <LegalLayout eyebrow="Privacy" title="Privacy Policy" updated={UPDATED_EN}>
      <p>
        This privacy policy explains how <strong>Cabinet Individual Psihologie Carmen Foia</strong>{" "}
        ("the Practice", "we") collects, uses, and protects the personal data of people who visit
        this website or use our services, in accordance with Regulation (EU) 2016/679 (GDPR) and
        applicable Romanian law.
      </p>

      <h2>1. Data controller</h2>
      <ul>
        <li><strong>Name:</strong> Cabinet Individual Psihologie Carmen Foia</li>
        <li><strong>Tax ID (CUI):</strong> 54513889</li>
        <li><strong>Address:</strong> Str. Vasile Alecsandri nr. 7, Oradea, Romania</li>
        <li><strong>Email:</strong> contact@psihologcarmenfoia.ro</li>
        <li><strong>Phone / WhatsApp:</strong> +40 7949 514 255</li>
      </ul>

      <h2>2. What data we collect</h2>
      <ul>
        <li><strong>Identification and contact data:</strong> name, email address, phone number.</li>
        <li><strong>Booking data:</strong> chosen session reason, date and time, and any notes you add.</li>
        <li><strong>Payment data:</strong> processed solely by our payment provider (Stripe). We do not store or have access to your full card details.</li>
        <li><strong>Health data:</strong> information disclosed during psychotherapy sessions is a special category of data, processed on the basis of consent and protected by professional confidentiality.</li>
        <li><strong>Technical data:</strong> IP address, browser type, and usage data collected by our service providers to operate and secure the website.</li>
      </ul>

      <h2>3. Purposes and legal bases</h2>
      <ul>
        <li><strong>Booking and delivering sessions</strong> — performance of a contract (Art. 6(1)(b) GDPR).</li>
        <li><strong>Processing payments and issuing fiscal documents</strong> — legal obligation and contract (Art. 6(1)(b) and (c)).</li>
        <li><strong>Processing health data within therapy</strong> — explicit consent and provision of health care (Art. 9(2)(a) and (h)).</li>
        <li><strong>Responding to your contact messages</strong> — legitimate interest in communicating with interested individuals (Art. 6(1)(f)).</li>
        <li><strong>Sending confirmations, reminders, and receipts</strong> — performance of a contract.</li>
      </ul>

      <h2>4. Service providers (processors)</h2>
      <p>To provide our services, we use third-party providers that process data on our behalf:</p>
      <ul>
        <li><strong>Cal.com</strong> — booking system and availability management.</li>
        <li><strong>Stripe</strong> — card payment processing and receipts.</li>
        <li><strong>Google Calendar</strong> — synchronising availability and bookings.</li>
        <li><strong>Supabase</strong> — hosting the blog database and admin section.</li>
        <li><strong>DeepL</strong> — automatic translation of blog articles (processes only article text, not visitor data).</li>
        <li><strong>Google Analytics</strong> — website usage statistics (see the Cookies section).</li>
        <li><strong>Web hosting provider</strong> — delivering the website.</li>
      </ul>
      <p>
        Some providers may process data outside the European Economic Area. In such cases, transfers
        are protected by Standard Contractual Clauses approved by the European Commission or other
        appropriate safeguards.
      </p>

      <h2>5. How long we keep data</h2>
      <p>
        We keep data only as long as necessary for the purposes above: booking and session data for
        the duration of the therapeutic relationship and thereafter as required by legal and
        professional obligations; financial documents for the period required by tax law (generally
        10 years); contact messages for a reasonable period to respond to your request.
      </p>

      <h2>6. Your rights</h2>
      <p>Under the GDPR, you have the right to:</p>
      <ul>
        <li>access your data;</li>
        <li>rectify inaccurate data;</li>
        <li>erasure ("right to be forgotten"), within the limits of legal obligations;</li>
        <li>restrict processing;</li>
        <li>data portability;</li>
        <li>object to processing;</li>
        <li>withdraw consent at any time, without affecting the lawfulness of prior processing.</li>
      </ul>
      <p>
        To exercise these rights, contact us at contact@psihologcarmenfoia.ro. You also have the
        right to lodge a complaint with the Romanian Data Protection Authority (ANSPDCP),
        www.dataprotection.ro.
      </p>

      <h3>How to request deletion of your data</h3>
      <p>
        You can request deletion of your personal data at any time by emailing{" "}
        <strong>contact@psihologcarmenfoia.ro</strong> with the subject "Data deletion". We will act
        on your request without undue delay and in any case within <strong>30 days</strong> (one
        month) of receipt. We may ask you to confirm your identity to prevent unauthorised requests.
        Note that some data may be retained where the law requires it (e.g. financial/tax records) or
        for the establishment or defence of legal claims; in such cases we will explain the basis for
        retention.
      </p>

      <h2>7. Data security</h2>
      <p>
        We apply appropriate technical and organisational measures to protect data against
        unauthorised access, loss, or disclosure. Payments are processed over secure connections and
        access to data is restricted.
      </p>

      <h2>8. Cookies and analytics (Google Analytics)</h2>
      <p>We use the following categories of cookies:</p>
      <ul>
        <li><strong>Essential</strong> — strictly necessary for the site and bookings to work. Always on and cannot be disabled.</li>
        <li><strong>Analytics</strong> — help us understand how the site is used (e.g. Google Analytics). Active only with your consent.</li>
        <li><strong>Marketing</strong> — used to personalise content and ads. Active only with your consent.</li>
      </ul>
      <p>
        Optional cookies (analytics, marketing) <strong>are not loaded before you consent</strong>.
        On your first visit we show a banner where you can accept all cookies, keep only the essential
        ones, or customise your choice by category. You can change or withdraw your consent at any
        time using the <strong>"Cookie settings"</strong> option in the site footer, without affecting
        the lawfulness of prior processing.
      </p>
      <p>
        We also use <strong>Google Analytics</strong>, a web analytics service provided by Google, to
        understand how the website is used (e.g. pages visited, visit duration, device type). Google
        Analytics uses cookies and may collect your IP address (in anonymised/truncated form) and
        usage identifiers. This data helps us improve the website. Processing is based on your
        consent, given via the cookie banner or your browser settings. You can withdraw consent at
        any time, block cookies in your browser settings, or install the Google Analytics opt-out
        add-on (tools.google.com/dlpage/gaoptout). Google may transfer data outside the EEA, with
        appropriate safeguards.
      </p>

      <h2>9. Session confidentiality</h2>
      <p>
        Information shared during psychology sessions is confidential and protected by professional
        secrecy, in line with the code of ethics of the psychology profession. Exceptions are those
        provided by law (e.g. an imminent danger).
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The current version is published on this page
        with the date of the last update.
      </p>
    </LegalLayout>
  );
}
