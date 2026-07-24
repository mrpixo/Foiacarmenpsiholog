import type { ScreeningTest } from "./types";

// GAD-7 — Generalized Anxiety Disorder 7-item scale (Spitzer et al., 2006;
// Pfizer). Free to use. 7 items, each 0–3; sum → 0–21.
const scale = [
  { value: 0, label: { ro: "Deloc", en: "Not at all" } },
  { value: 1, label: { ro: "Câteva zile", en: "Several days" } },
  { value: 2, label: { ro: "Mai mult de jumătate dintre zile", en: "More than half the days" } },
  { value: 3, label: { ro: "Aproape în fiecare zi", en: "Nearly every day" } },
];

export const gad7: ScreeningTest = {
  slug: "gad-7",
  name: { ro: "GAD-7", en: "GAD-7" },
  measures: { ro: "Simptome de anxietate", en: "Anxiety symptoms" },
  durationMin: { ro: "2 minute", en: "2 minutes" },
  intro: {
    ro: "Șapte întrebări despre cât de des te-au deranjat anumite probleme în ultimele două săptămâni. Răspunde sincer — nu există răspunsuri corecte sau greșite.",
    en: "Seven questions about how often certain problems have bothered you over the last two weeks. Answer honestly — there are no right or wrong answers.",
  },
  stem: {
    ro: "În ultimele două săptămâni, cât de des",
    en: "Over the last two weeks, how often have you been bothered by",
  },
  disclaimer: {
    ro: "Acest test are caracter orientativ și informativ — nu este un diagnostic și nu confirmă ori exclude o afecțiune. Pentru un rezultat formal și un diagnostic, adresează-te unui specialist.",
    en: "This test is indicative and for information only — it is not a diagnosis and neither confirms nor rules out any condition. For a formal result and a diagnosis, please consult a specialist.",
  },
  scale,
  items: [
    { text: { ro: "te-ai simțit nervos(oasă), anxios(oasă) sau tensionat(ă)?", en: "feeling nervous, anxious, or on edge?" } },
    { text: { ro: "nu ai putut opri sau controla îngrijorarea?", en: "not being able to stop or control worrying?" } },
    { text: { ro: "te-ai îngrijorat prea mult din cauza unor lucruri diferite?", en: "worrying too much about different things?" } },
    { text: { ro: "ai avut dificultăți în a te relaxa?", en: "trouble relaxing?" } },
    { text: { ro: "ai fost atât de neliniștit(ă) încât îți era greu să stai locului?", en: "being so restless that it's hard to sit still?" } },
    { text: { ro: "te-ai enervat sau iritat ușor?", en: "becoming easily annoyed or irritable?" } },
    { text: { ro: "ți-a fost teamă, ca și cum urma să se întâmple ceva groaznic?", en: "feeling afraid, as if something awful might happen?" } },
  ],
  score: (a) => a.reduce((sum, v) => sum + v, 0),
  scoreMax: 21,
  bands: [
    {
      min: 0,
      max: 4,
      label: { ro: "Anxietate minimă", en: "Minimal anxiety" },
      tone: "good",
      message: {
        ro: "Scorul tău sugerează un nivel minim de anxietate — un semn bun. Dacă vrei să te cunoști mai bine, încearcă și celelalte teste disponibile.",
        en: "Your score suggests minimal anxiety — a good sign. If you'd like to get to know yourself better, try the other available tests.",
      },
    },
    {
      min: 5,
      max: 9,
      label: { ro: "Anxietate ușoară", en: "Mild anxiety" },
      tone: "moderate",
      message: {
        ro: "Scorul tău indică un nivel ușor de anxietate. Merită să fii atent(ă) la aceste simptome. Dacă persistă sau îți afectează viața de zi cu zi, o discuție cu un psiholog poate ajuta.",
        en: "Your score indicates mild anxiety. It's worth keeping an eye on these symptoms. If they persist or affect your daily life, talking to a psychologist can help.",
      },
    },
    {
      min: 10,
      max: 14,
      label: { ro: "Anxietate moderată", en: "Moderate anxiety" },
      tone: "concern",
      message: {
        ro: "Scorul tău indică un nivel moderat de anxietate. Îți recomand să discuți cu un specialist. Programează o ședință cu Carmen pentru a explora împreună ce se întâmplă.",
        en: "Your score indicates moderate anxiety. I'd recommend talking to a specialist. Book a session with Carmen so we can explore what's going on together.",
      },
    },
    {
      min: 15,
      max: 21,
      label: { ro: "Anxietate severă", en: "Severe anxiety" },
      tone: "concern",
      message: {
        ro: "Scorul tău indică un nivel ridicat de anxietate. Nu trebuie să treci prin asta singur(ă). Te încurajez să contactezi un specialist cât mai curând — programează o ședință cu Carmen.",
        en: "Your score indicates a high level of anxiety. You don't have to go through this alone. I'd encourage you to reach out to a specialist soon — book a session with Carmen.",
      },
    },
  ],
};
