import type { ScreeningTest, TestBand, BandTone } from "./types";
import { scoreItems } from "./types";

// DASS-21 — Depression Anxiety Stress Scales (Lovibond & Lovibond, 1995).
// Free to use. 21 items, 0–3; three 7-item subscales, each summed and ×2
// (0–42) to align with the full DASS-42 severity cut-offs.
const scale = [
  { value: 0, label: { ro: "Nu s-a aplicat deloc", en: "Did not apply to me at all" } },
  { value: 1, label: { ro: "S-a aplicat într-o oarecare măsură sau uneori", en: "Applied to me to some degree, or some of the time" } },
  { value: 2, label: { ro: "S-a aplicat considerabil sau adesea", en: "Applied to me a considerable degree, or a good part of the time" } },
  { value: 3, label: { ro: "S-a aplicat foarte mult sau aproape tot timpul", en: "Applied to me very much, or most of the time" } },
];

// Shared severity levels (reused across the three subscales).
const sev = {
  normal: { label: { ro: "În limite normale", en: "Normal" }, tone: "good" as BandTone, message: { ro: "În limite normale.", en: "Within the normal range." } },
  mild: { label: { ro: "Ușoară", en: "Mild" }, tone: "moderate" as BandTone, message: { ro: "Nivel ușor — merită atenție.", en: "Mild — worth some attention." } },
  moderate: { label: { ro: "Moderată", en: "Moderate" }, tone: "concern" as BandTone, message: { ro: "Nivel moderat — ia în considerare sprijin de specialitate.", en: "Moderate — consider professional support." } },
  severe: { label: { ro: "Severă", en: "Severe" }, tone: "concern" as BandTone, message: { ro: "Nivel ridicat — este recomandat sprijin de specialitate.", en: "High — professional support is recommended." } },
  extreme: { label: { ro: "Extrem de severă", en: "Extremely severe" }, tone: "concern" as BandTone, message: { ro: "Nivel foarte ridicat — sprijin de specialitate recomandat cât mai curând.", en: "Very high — professional support recommended soon." } },
};

// cutoffs = [normalMax, mildMax, moderateMax, severeMax]; extreme runs to 42.
const makeBands = (c: [number, number, number, number]): TestBand[] => [
  { min: 0, max: c[0], ...sev.normal },
  { min: c[0] + 1, max: c[1], ...sev.mild },
  { min: c[1] + 1, max: c[2], ...sev.moderate },
  { min: c[2] + 1, max: c[3], ...sev.severe },
  { min: c[3] + 1, max: 42, ...sev.extreme },
];

const sub = (indices: number[]) => (a: number[]) => scoreItems(a, indices, { max: 3, multiplier: 2 });

export const dass21: ScreeningTest = {
  slug: "dass-21",
  name: { ro: "DASS-21", en: "DASS-21" },
  measures: { ro: "Depresie, anxietate și stres", en: "Depression, anxiety and stress" },
  durationMin: { ro: "5 minute", en: "5 minutes" },
  intro: {
    ro: "Douăzeci și una de afirmații despre cum te-ai simțit în ultima săptămână. Nu petrece prea mult timp la fiecare — alege răspunsul care ți se potrivește cel mai bine.",
    en: "Twenty-one statements about how you've felt over the past week. Don't spend too long on each — pick the answer that fits you best.",
  },
  stem: {
    ro: "În ultima săptămână, cât de mult ți s-a aplicat:",
    en: "Over the past week, how much did this apply to you:",
  },
  disclaimer: {
    ro: "Acest test are caracter orientativ și informativ — nu este un diagnostic și nu confirmă ori exclude o afecțiune. Pentru un rezultat formal și un diagnostic, adresează-te unui specialist.",
    en: "This test is indicative and for information only — it is not a diagnosis and neither confirms nor rules out any condition. For a formal result and a diagnosis, please consult a specialist.",
  },
  scale,
  items: [
    { text: { ro: "Mi-a fost greu să mă liniștesc.", en: "I found it hard to wind down." } },
    { text: { ro: "Am observat că mi se usucă gura.", en: "I was aware of dryness of my mouth." } },
    { text: { ro: "Nu am reușit să simt deloc vreo emoție pozitivă.", en: "I couldn't seem to experience any positive feeling at all." } },
    { text: { ro: "Am avut dificultăți de respirație (de ex. respirație accelerată, senzație de lipsă de aer fără efort fizic).", en: "I experienced breathing difficulty (e.g. rapid breathing, breathlessness without physical exertion)." } },
    { text: { ro: "Mi-a fost greu să găsesc inițiativa de a face lucruri.", en: "I found it difficult to work up the initiative to do things." } },
    { text: { ro: "Am avut tendința să reacționez exagerat în anumite situații.", en: "I tended to over-react to situations." } },
    { text: { ro: "Am avut tremurături (de ex. la mâini).", en: "I experienced trembling (e.g. in the hands)." } },
    { text: { ro: "Am simțit că folosesc multă energie nervoasă.", en: "I felt that I was using a lot of nervous energy." } },
    { text: { ro: "Mi-a fost teamă de situații în care aș putea intra în panică și m-aș face de râs.", en: "I was worried about situations in which I might panic and make a fool of myself." } },
    { text: { ro: "Am simțit că nu am nimic care să mă motiveze.", en: "I felt that I had nothing to look forward to." } },
    { text: { ro: "M-am simțit agitat(ă).", en: "I found myself getting agitated." } },
    { text: { ro: "Mi-a fost greu să mă relaxez.", en: "I found it difficult to relax." } },
    { text: { ro: "M-am simțit descurajat(ă) și trist(ă).", en: "I felt down-hearted and blue." } },
    { text: { ro: "Nu am tolerat nimic care mă împiedica să continui ce făceam.", en: "I was intolerant of anything that kept me from getting on with what I was doing." } },
    { text: { ro: "Am simțit că sunt aproape de panică.", en: "I felt I was close to panic." } },
    { text: { ro: "Nu am reușit să mă entuziasmez de nimic.", en: "I was unable to become enthusiastic about anything." } },
    { text: { ro: "Am simțit că nu valorez mare lucru ca persoană.", en: "I felt I wasn't worth much as a person." } },
    { text: { ro: "Am simțit că sunt destul de irascibil(ă).", en: "I felt that I was rather touchy." } },
    { text: { ro: "Am fost conștient(ă) de bătăile inimii fără efort fizic (de ex. puls accelerat, bătăi lipsă).", en: "I was aware of the action of my heart without physical exertion (e.g. racing, missing a beat)." } },
    { text: { ro: "M-am simțit speriat(ă) fără un motiv întemeiat.", en: "I felt scared without any good reason." } },
    { text: { ro: "Am simțit că viața nu are sens.", en: "I felt that life was meaningless." } },
  ],
  dimensions: [
    { key: "depression", name: { ro: "Depresie", en: "Depression" }, score: sub([2, 4, 9, 12, 15, 16, 20]), scoreMax: 42, bands: makeBands([9, 13, 20, 27]) },
    { key: "anxiety", name: { ro: "Anxietate", en: "Anxiety" }, score: sub([1, 3, 6, 8, 14, 18, 19]), scoreMax: 42, bands: makeBands([7, 9, 14, 19]) },
    { key: "stress", name: { ro: "Stres", en: "Stress" }, score: sub([0, 5, 7, 10, 11, 13, 17]), scoreMax: 42, bands: makeBands([14, 18, 25, 33]) },
  ],
};
