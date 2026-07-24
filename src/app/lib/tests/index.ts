import type { ScreeningTest, TestSummary } from "./types";
import { who5 } from "./who5";
import { gad7 } from "./gad7";
import { phq9 } from "./phq9";
import { rosenberg } from "./rosenberg";
import { dass21 } from "./dass21";
import { bigfive } from "./bigfive";

// Fully-built tests (drive the runner). Add a test file, then list it here.
export const tests: ScreeningTest[] = [who5, gad7, phq9, rosenberg, dass21, bigfive];

// The /teste menu — includes tests not yet built (comingSoon), in the order
// they'll be offered. Full tests are spread in so they stay in sync.
export const catalog: TestSummary[] = [
  who5,
  gad7,
  phq9,
  rosenberg,
  bigfive,
  dass21,
];

export const getTestBySlug = (slug: string): ScreeningTest | undefined =>
  tests.find((t) => t.slug === slug);

export { bandForScore, bandIn, safetyTriggered } from "./types";
export type { ScreeningTest, TestSummary, TestBand, BandTone } from "./types";
