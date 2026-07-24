// Data-driven screening-test engine. Each test is a plain data object; the
// runner UI renders any of them. Add a test = add a file + register it.

export type LangText = { ro: string; en: string };

/** Lightweight entry for the /teste menu (includes not-yet-built tests). */
export type TestSummary = {
  slug: string;
  name: LangText;
  measures: LangText;
  durationMin: LangText;
  comingSoon?: boolean;
};

export type TestScaleOption = { value: number; label: LangText };

export type TestItem = { text: LangText };

export type BandTone = "good" | "moderate" | "concern";

export type TestBand = {
  /** Inclusive bounds on the reported score. */
  min: number;
  max: number;
  label: LangText;
  message: LangText;
  tone: BandTone;
};

export type SafetyResource = { label: LangText; value: string; href?: string };

/** Safety protocol for a sensitive item (e.g. PHQ-9 self-harm item). When the
 *  chosen value on `itemIndex` exceeds `triggerAbove`, the result leads with
 *  crisis resources before anything else. */
export type TestSafety = {
  itemIndex: number;
  triggerAbove?: number; // default 0 — any endorsement triggers it
  title: LangText;
  body: LangText;
  resources: SafetyResource[];
};

/** A sub-scale of a multi-dimension test (DASS-21 subscales, Big Five traits). */
export type Dimension = {
  key: string;
  name: LangText;
  /** This dimension's score from the full answers array. */
  score: (answers: number[]) => number;
  scoreMax: number;
  bands: TestBand[];
};

export type ScreeningTest = TestSummary & {
  intro: LangText;
  /** Optional line shown above the items, e.g. "Over the last two weeks…". */
  timeframe?: LangText;
  disclaimer: LangText;
  /** Single response scale shared by all items (WHO-5, GAD-7, … all work this way). */
  scale: TestScaleOption[];
  items: TestItem[];
  // Single-score tests (WHO-5, GAD-7, PHQ-9, Rosenberg):
  /** Reported score (0..scoreMax) from the chosen values, in item order. */
  score?: (answers: number[]) => number;
  scoreMax?: number;
  bands?: TestBand[];
  // Multi-dimension tests (DASS-21 subscales, Big Five traits):
  dimensions?: Dimension[];
  safety?: TestSafety;
};

/** Sum selected item values, reverse-scoring some, with an optional multiplier.
 *  `max` is the scale's top value (used for reverse: max − value). */
export function scoreItems(
  answers: number[],
  indices: number[],
  opts: { max: number; reverse?: number[]; multiplier?: number },
): number {
  const mult = opts.multiplier ?? 1;
  let sum = 0;
  for (const i of indices) {
    const v = answers[i] ?? 0;
    sum += opts.reverse?.includes(i) ? opts.max - v : v;
  }
  return sum * mult;
}

/** Resolve which band a score falls into, for any band list. */
export function bandIn(bands: TestBand[], score: number): TestBand {
  return bands.find((b) => score >= b.min && score <= b.max) ?? bands[bands.length - 1];
}

/** Whether a test's safety protocol should fire for the given answers. */
export function safetyTriggered(test: ScreeningTest, answers: number[]): boolean {
  if (!test.safety) return false;
  const v = answers[test.safety.itemIndex];
  return typeof v === "number" && v > (test.safety.triggerAbove ?? 0);
}

/** Resolve the band a single-score test's reported score falls into. */
export function bandForScore(test: ScreeningTest, score: number): TestBand {
  return bandIn(test.bands ?? [], score);
}
