import type { ScreeningTest } from "./types";
import { scoreItems } from "./types";

// Rosenberg Self-Esteem Scale (RSES, 1965). Free for non-commercial/research
// use. 10 items, 4-point agree scale; items 2,5,6,8,9 are reverse-scored.
// Sum → 0–30; higher = higher self-esteem.
const scale = [
  { value: 3, label: { ro: "Total de acord", en: "Strongly agree" } },
  { value: 2, label: { ro: "De acord", en: "Agree" } },
  { value: 1, label: { ro: "Dezacord", en: "Disagree" } },
  { value: 0, label: { ro: "Total dezacord", en: "Strongly disagree" } },
];

const REVERSE = [1, 4, 5, 7, 8]; // 0-indexed items 2,5,6,8,9

export const rosenberg: ScreeningTest = {
  slug: "rosenberg",
  name: { ro: "Scala de stimă de sine Rosenberg", en: "Rosenberg Self-Esteem Scale" },
  measures: { ro: "Stima de sine", en: "Self-esteem" },
  durationMin: { ro: "2–3 minute", en: "2–3 minutes" },
  intro: {
    ro: "Zece afirmații despre cum te percepi pe tine. Indică în ce măsură ești de acord cu fiecare — nu există răspunsuri corecte sau greșite.",
    en: "Ten statements about how you see yourself. Indicate how much you agree with each — there are no right or wrong answers.",
  },
  disclaimer: {
    ro: "Acest test are caracter orientativ și informativ — nu este un diagnostic și nu confirmă ori exclude o afecțiune. Pentru un rezultat formal și un diagnostic, adresează-te unui specialist.",
    en: "This test is indicative and for information only — it is not a diagnosis and neither confirms nor rules out any condition. For a formal result and a diagnosis, please consult a specialist.",
  },
  scale,
  items: [
    { text: { ro: "În general, sunt mulțumit(ă) de mine.", en: "On the whole, I am satisfied with myself." } },
    { text: { ro: "Uneori cred că nu sunt deloc bun(ă).", en: "At times I think I am no good at all." } },
    { text: { ro: "Simt că am o serie de calități.", en: "I feel that I have a number of good qualities." } },
    { text: { ro: "Sunt capabil(ă) să fac lucruri la fel de bine ca majoritatea oamenilor.", en: "I am able to do things as well as most other people." } },
    { text: { ro: "Simt că nu am cu ce să mă mândresc.", en: "I feel I do not have much to be proud of." } },
    { text: { ro: "Cu siguranță mă simt inutil(ă) uneori.", en: "I certainly feel useless at times." } },
    { text: { ro: "Simt că sunt o persoană de valoare, cel puțin la fel ca ceilalți.", en: "I feel that I'm a person of worth, at least on an equal plane with others." } },
    { text: { ro: "Mi-aș dori să pot avea mai mult respect față de mine.", en: "I wish I could have more respect for myself." } },
    { text: { ro: "În ansamblu, tind să simt că sunt un eșec.", en: "All in all, I am inclined to feel that I am a failure." } },
    { text: { ro: "Am o atitudine pozitivă față de mine.", en: "I take a positive attitude toward myself." } },
  ],
  score: (a) => scoreItems(a, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], { max: 3, reverse: REVERSE }),
  scoreMax: 30,
  bands: [
    {
      min: 0,
      max: 14,
      label: { ro: "Stimă de sine scăzută", en: "Low self-esteem" },
      tone: "moderate",
      message: {
        ro: "Scorul tău sugerează o stimă de sine scăzută. Merită să lucrezi cu blândețe la relația cu tine — o discuție cu un psiholog poate ajuta. Programează o ședință cu Carmen dacă simți nevoia.",
        en: "Your score suggests low self-esteem. It's worth gently working on your relationship with yourself — talking to a psychologist can help. Book a session with Carmen if you feel the need.",
      },
    },
    {
      min: 15,
      max: 25,
      label: { ro: "Stimă de sine echilibrată", en: "Balanced self-esteem" },
      tone: "good",
      message: {
        ro: "Scorul tău reflectă o stimă de sine echilibrată — un semn bun. Dacă vrei să te cunoști mai bine, încearcă și celelalte teste.",
        en: "Your score reflects balanced self-esteem — a good sign. If you'd like to get to know yourself better, try the other tests too.",
      },
    },
    {
      min: 26,
      max: 30,
      label: { ro: "Stimă de sine ridicată", en: "High self-esteem" },
      tone: "good",
      message: {
        ro: "Scorul tău reflectă o stimă de sine ridicată — felicitări! Dacă vrei, explorează și celelalte teste disponibile.",
        en: "Your score reflects high self-esteem — well done! If you'd like, explore the other available tests.",
      },
    },
  ],
};
