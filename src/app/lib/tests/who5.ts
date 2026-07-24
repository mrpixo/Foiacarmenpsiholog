import type { ScreeningTest } from "./types";

// WHO-5 Well-Being Index (World Health Organization, 1998). Free to use.
// 5 items, each 0–5; raw sum (0–25) × 4 → 0–100. Lower = poorer well-being.
const scale = [
  { value: 5, label: { ro: "Tot timpul", en: "All of the time" } },
  { value: 4, label: { ro: "Cea mai mare parte a timpului", en: "Most of the time" } },
  { value: 3, label: { ro: "Mai mult de jumătate din timp", en: "More than half the time" } },
  { value: 2, label: { ro: "Mai puțin de jumătate din timp", en: "Less than half the time" } },
  { value: 1, label: { ro: "Din când în când", en: "Some of the time" } },
  { value: 0, label: { ro: "Niciodată", en: "At no time" } },
];

export const who5: ScreeningTest = {
  slug: "who-5",
  name: { ro: "Indicele de bunăstare WHO-5", en: "WHO-5 Well-Being Index" },
  measures: { ro: "Starea generală de bine", en: "General well-being" },
  durationMin: { ro: "1 minut", en: "1 minute" },
  intro: {
    ro: "Cinci afirmații scurte despre cum te-ai simțit în ultimele două săptămâni. Nu există răspunsuri corecte sau greșite — alege ce ți se potrivește cel mai bine.",
    en: "Five short statements about how you've felt over the last two weeks. There are no right or wrong answers — pick what fits you best.",
  },
  disclaimer: {
    ro: "Acest test are caracter orientativ și informativ — nu este un diagnostic și nu confirmă ori exclude o afecțiune. Pentru un rezultat formal și un diagnostic, adresează-te unui specialist.",
    en: "This test is indicative and for information only — it is not a diagnosis and neither confirms nor rules out any condition. For a formal result and a diagnosis, please consult a specialist.",
  },
  scale,
  items: [
    { text: { ro: "M-am simțit vesel(ă) și bine dispus(ă).", en: "I have felt cheerful and in good spirits." } },
    { text: { ro: "M-am simțit calm(ă) și relaxat(ă).", en: "I have felt calm and relaxed." } },
    { text: { ro: "M-am simțit activ(ă) și plin(ă) de energie.", en: "I have felt active and vigorous." } },
    { text: { ro: "M-am trezit odihnit(ă) și proaspăt(ă).", en: "I woke up feeling fresh and rested." } },
    { text: { ro: "Viața mea de zi cu zi a fost plină de lucruri care mă interesează.", en: "My daily life has been filled with things that interest me." } },
  ],
  score: (a) => a.reduce((sum, v) => sum + v, 0) * 4,
  scoreMax: 100,
  bands: [
    {
      min: 0,
      max: 28,
      label: { ro: "Stare de bine scăzută", en: "Low well-being" },
      tone: "concern",
      message: {
        ro: "Scorul tău sugerează o stare de bine scăzută în ultima perioadă. Nu ești singur(ă), iar o discuție cu un psiholog poate ajuta cu adevărat. Te încurajez să programezi o ședință pentru a explora împreună ce se întâmplă.",
        en: "Your score suggests low well-being recently. You're not alone, and talking to a psychologist can genuinely help. I'd encourage you to book a session so we can explore what's going on together.",
      },
    },
    {
      min: 29,
      max: 50,
      label: { ro: "Stare de bine sub medie", en: "Below-average well-being" },
      tone: "moderate",
      message: {
        ro: "Scorul tău indică o stare de bine sub medie. Poate fi util să aprofundezi cu un test de anxietate (GAD-7) sau de dispoziție (PHQ-9) — sau să discuți cu un specialist dacă simți nevoia.",
        en: "Your score indicates below-average well-being. It may help to look deeper with an anxiety (GAD-7) or mood (PHQ-9) test — or to talk to a specialist if you feel the need.",
      },
    },
    {
      min: 51,
      max: 100,
      label: { ro: "Stare de bine bună", en: "Good well-being" },
      tone: "good",
      message: {
        ro: "Scorul tău reflectă o stare de bine bună — felicitări! Dacă vrei să te cunoști mai bine, încearcă și celelalte teste disponibile.",
        en: "Your score reflects good well-being — well done! If you'd like to get to know yourself better, try the other available tests too.",
      },
    },
  ],
};
