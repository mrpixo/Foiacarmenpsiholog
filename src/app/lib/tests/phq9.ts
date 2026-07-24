import type { ScreeningTest } from "./types";

// PHQ-9 — Patient Health Questionnaire-9 (Kroenke & Spitzer; Pfizer). Free to
// use. 9 items, each 0–3; sum → 0–27. Item 9 is the self-harm item and drives
// the safety protocol.
const scale = [
  { value: 0, label: { ro: "Deloc", en: "Not at all" } },
  { value: 1, label: { ro: "Câteva zile", en: "Several days" } },
  { value: 2, label: { ro: "Mai mult de jumătate dintre zile", en: "More than half the days" } },
  { value: 3, label: { ro: "Aproape în fiecare zi", en: "Nearly every day" } },
];

export const phq9: ScreeningTest = {
  slug: "phq-9",
  name: { ro: "PHQ-9", en: "PHQ-9" },
  measures: { ro: "Simptome depresive", en: "Depressive symptoms" },
  durationMin: { ro: "2–3 minute", en: "2–3 minutes" },
  intro: {
    ro: "Nouă întrebări despre cum te-ai simțit în ultimele două săptămâni. Răspunde sincer — nu există răspunsuri corecte sau greșite, iar rezultatul rămâne confidențial.",
    en: "Nine questions about how you've felt over the last two weeks. Answer honestly — there are no right or wrong answers, and your result stays confidential.",
  },
  timeframe: {
    ro: "În ultimele două săptămâni, cât de des te-au deranjat următoarele probleme?",
    en: "Over the last two weeks, how often have you been bothered by the following problems?",
  },
  disclaimer: {
    ro: "Acest test are caracter orientativ și informativ — nu este un diagnostic și nu confirmă ori exclude o afecțiune. Pentru un rezultat formal și un diagnostic, adresează-te unui specialist.",
    en: "This test is indicative and for information only — it is not a diagnosis and neither confirms nor rules out any condition. For a formal result and a diagnosis, please consult a specialist.",
  },
  scale,
  items: [
    { text: { ro: "Interes sau plăcere scăzute pentru a face lucruri.", en: "Little interest or pleasure in doing things." } },
    { text: { ro: "Te-ai simțit deprimat(ă), trist(ă) sau fără speranță.", en: "Feeling down, depressed, or hopeless." } },
    { text: { ro: "Ai avut probleme cu somnul — ai adormit greu, te-ai trezit des sau ai dormit prea mult.", en: "Trouble falling or staying asleep, or sleeping too much." } },
    { text: { ro: "Te-ai simțit obosit(ă) sau fără energie.", en: "Feeling tired or having little energy." } },
    { text: { ro: "Ai avut poftă de mâncare scăzută sau, dimpotrivă, ai mâncat prea mult.", en: "Poor appetite or overeating." } },
    { text: { ro: "Te-ai simțit prost în legătură cu tine — sau că ești un eșec ori că ți-ai dezamăgit familia.", en: "Feeling bad about yourself — or that you are a failure, or have let yourself or your family down." } },
    { text: { ro: "Ai avut dificultăți de concentrare, de exemplu când citeai sau te uitai la televizor.", en: "Trouble concentrating on things, such as reading the newspaper or watching television." } },
    { text: { ro: "Te-ai mișcat sau ai vorbit atât de încet încât alții ar fi putut observa — sau, dimpotrivă, ai fost atât de agitat(ă) încât te-ai mișcat mult mai mult decât de obicei.", en: "Moving or speaking so slowly that other people could have noticed — or the opposite, being so fidgety or restless that you were moving around a lot more than usual." } },
    { text: { ro: "Ai avut gânduri că ar fi mai bine să nu mai fii sau să îți faci rău în vreun fel.", en: "Thoughts that you would be better off dead, or of hurting yourself in some way." } },
  ],
  score: (a) => a.reduce((sum, v) => sum + v, 0),
  scoreMax: 27,
  bands: [
    {
      min: 0,
      max: 4,
      label: { ro: "Simptome minime", en: "Minimal symptoms" },
      tone: "good",
      message: {
        ro: "Scorul tău sugerează simptome depresive minime — un semn bun. Dacă vrei, poți explora și celelalte teste disponibile.",
        en: "Your score suggests minimal depressive symptoms — a good sign. If you'd like, explore the other available tests too.",
      },
    },
    {
      min: 5,
      max: 9,
      label: { ro: "Depresie ușoară", en: "Mild depression" },
      tone: "moderate",
      message: {
        ro: "Scorul tău indică simptome ușoare. Merită să fii atent(ă) la starea ta. Dacă persistă câteva săptămâni sau îți afectează viața de zi cu zi, o discuție cu un psiholog poate ajuta.",
        en: "Your score indicates mild symptoms. It's worth paying attention to how you feel. If it lasts a few weeks or affects your daily life, talking to a psychologist can help.",
      },
    },
    {
      min: 10,
      max: 14,
      label: { ro: "Depresie moderată", en: "Moderate depression" },
      tone: "concern",
      message: {
        ro: "Scorul tău indică simptome depresive moderate. Îți recomand să discuți cu un specialist. Programează o ședință cu Carmen pentru a explora împreună ce se întâmplă.",
        en: "Your score indicates moderate depressive symptoms. I'd recommend talking to a specialist. Book a session with Carmen so we can explore what's going on together.",
      },
    },
    {
      min: 15,
      max: 19,
      label: { ro: "Depresie moderat-severă", en: "Moderately severe depression" },
      tone: "concern",
      message: {
        ro: "Scorul tău indică simptome moderat-severe. Este important să primești sprijin de specialitate. Te încurajez să programezi o ședință cu Carmen cât mai curând.",
        en: "Your score indicates moderately severe symptoms. It's important to get professional support. I'd encourage you to book a session with Carmen soon.",
      },
    },
    {
      min: 20,
      max: 27,
      label: { ro: "Depresie severă", en: "Severe depression" },
      tone: "concern",
      message: {
        ro: "Scorul tău indică simptome depresive severe. Nu trebuie să treci prin asta singur(ă). Te încurajez să contactezi un specialist cât mai curând — programează o ședință cu Carmen.",
        en: "Your score indicates severe depressive symptoms. You don't have to go through this alone. I'd encourage you to reach out to a specialist soon — book a session with Carmen.",
      },
    },
  ],
  safety: {
    itemIndex: 8, // item 9 (self-harm)
    triggerAbove: 0,
    title: {
      ro: "Ai indicat gânduri de a nu mai fi sau de a-ți face rău.",
      en: "You indicated thoughts of not being here anymore, or of hurting yourself.",
    },
    body: {
      ro: "Aceste gânduri contează și meriți sprijin acum. Nu ești singur(ă). Dacă ești în pericol imediat, sună la 112. Poți vorbi oricând, confidențial și gratuit, cu linia de urgență Antisuicid.",
      en: "These thoughts matter and you deserve support right now. You're not alone. If you're in immediate danger, call 112. You can talk any time, confidentially and free of charge, to the Antisuicide crisis line.",
    },
    resources: [
      { label: { ro: "Telefonul Antisuicid (gratuit)", en: "Antisuicide line (free)" }, value: "0800 801 200", href: "tel:0800801200" },
      { label: { ro: "Urgențe", en: "Emergency" }, value: "112", href: "tel:112" },
    ],
  },
};
