import type { ScreeningTest, TestBand, LangText } from "./types";
import { scoreItems } from "./types";

// Big Five — Mini-IPIP (Donnellan et al., 2006), public domain. 20 items,
// 5-point accuracy scale (stored 0–4), five traits × 4 items. A personality
// profile — no "good/bad", so every band is neutral (tone "good").
const scale = [
  { value: 0, label: { ro: "Foarte inexact", en: "Very inaccurate" } },
  { value: 1, label: { ro: "Destul de inexact", en: "Moderately inaccurate" } },
  { value: 2, label: { ro: "Nici-nici", en: "Neither" } },
  { value: 3, label: { ro: "Destul de exact", en: "Moderately accurate" } },
  { value: 4, label: { ro: "Foarte exact", en: "Very accurate" } },
];

const REVERSE = [5, 6, 7, 8, 9, 14, 15, 16, 17, 18, 19];
const trait = (indices: number[]) => (a: number[]) => scoreItems(a, indices, { max: 4, reverse: REVERSE });

// Low / Average / High bands for a 0–16 trait score, with trait-specific text.
const band3 = (low: LangText, avg: LangText, high: LangText): TestBand[] => [
  { min: 0, max: 6, tone: "good", label: { ro: "Scăzut", en: "Low" }, message: low },
  { min: 7, max: 10, tone: "good", label: { ro: "Mediu", en: "Average" }, message: avg },
  { min: 11, max: 16, tone: "good", label: { ro: "Ridicat", en: "High" }, message: high },
];

export const bigfive: ScreeningTest = {
  slug: "big-five",
  name: { ro: "Personalitate Big Five", en: "Big Five personality" },
  measures: { ro: "Trăsături de personalitate", en: "Personality traits" },
  durationMin: { ro: "5–10 minute", en: "5–10 minutes" },
  intro: {
    ro: "Douăzeci de afirmații despre cum ești de obicei. Indică cât de exact te descrie fiecare. Nu există răspunsuri bune sau greșite — e doar un profil al personalității tale.",
    en: "Twenty statements about how you usually are. Indicate how accurately each describes you. There are no good or bad answers — it's simply a profile of your personality.",
  },
  disclaimer: {
    ro: "Acest test are caracter orientativ, pentru auto-cunoaștere — nu este un diagnostic. Pentru o evaluare formală, adresează-te unui specialist.",
    en: "This test is indicative, for self-knowledge — it is not a diagnosis. For a formal evaluation, please consult a specialist.",
  },
  scale,
  items: [
    { text: { ro: "Sunt sufletul petrecerii.", en: "I am the life of the party." } },
    { text: { ro: "Empatizez cu sentimentele celorlalți.", en: "I sympathize with others' feelings." } },
    { text: { ro: "Îmi fac treburile imediat.", en: "I get chores done right away." } },
    { text: { ro: "Am schimbări frecvente de dispoziție.", en: "I have frequent mood swings." } },
    { text: { ro: "Am o imaginație bogată.", en: "I have a vivid imagination." } },
    { text: { ro: "Nu vorbesc mult.", en: "I don't talk a lot." } },
    { text: { ro: "Nu mă interesează problemele altora.", en: "I am not interested in other people's problems." } },
    { text: { ro: "Adesea uit să pun lucrurile la locul lor.", en: "I often forget to put things back in their proper place." } },
    { text: { ro: "Sunt relaxat(ă) în majoritatea timpului.", en: "I am relaxed most of the time." } },
    { text: { ro: "Nu mă interesează ideile abstracte.", en: "I am not interested in abstract ideas." } },
    { text: { ro: "Vorbesc cu mulți oameni diferiți la petreceri.", en: "I talk to a lot of different people at parties." } },
    { text: { ro: "Simt emoțiile celorlalți.", en: "I feel others' emotions." } },
    { text: { ro: "Îmi place ordinea.", en: "I like order." } },
    { text: { ro: "Mă supăr ușor.", en: "I get upset easily." } },
    { text: { ro: "Îmi este greu să înțeleg idei abstracte.", en: "I have difficulty understanding abstract ideas." } },
    { text: { ro: "Rămân în plan secund.", en: "I keep in the background." } },
    { text: { ro: "Nu prea mă interesează ceilalți.", en: "I am not really interested in others." } },
    { text: { ro: "Fac dezordine / le încurc.", en: "I make a mess of things." } },
    { text: { ro: "Rareori mă simt trist(ă).", en: "I seldom feel blue." } },
    { text: { ro: "Nu am o imaginație bună.", en: "I do not have a good imagination." } },
  ],
  dimensions: [
    {
      key: "extraversion",
      name: { ro: "Extraversiune", en: "Extraversion" },
      score: trait([0, 5, 10, 15]),
      scoreMax: 16,
      bands: band3(
        { ro: "Tinzi să fii mai rezervat(ă) și să îți refaci energia în liniște și timp singur(ă).", en: "You tend to be more reserved and to recharge in quiet and solitude." },
        { ro: "Un echilibru între sociabilitate și nevoia de liniște.", en: "A balance between sociability and a need for quiet." },
        { ro: "Ești sociabil(ă), energic(ă) și îți place compania altora.", en: "You are sociable, energetic and enjoy others' company." },
      ),
    },
    {
      key: "agreeableness",
      name: { ro: "Amabilitate", en: "Agreeableness" },
      score: trait([1, 6, 11, 16]),
      scoreMax: 16,
      bands: band3(
        { ro: "Ești direct(ă) și obiectiv(ă); poți fi mai sceptic(ă) față de intențiile altora.", en: "You are direct and objective; you can be more skeptical of others' intentions." },
        { ro: "Îmbini grija față de ceilalți cu capacitatea de a-ți susține punctul de vedere.", en: "You blend care for others with the ability to stand your ground." },
        { ro: "Ești empatic(ă), cooperant(ă) și atent(ă) la nevoile celorlalți.", en: "You are empathetic, cooperative and attentive to others' needs." },
      ),
    },
    {
      key: "conscientiousness",
      name: { ro: "Conștiinciozitate", en: "Conscientiousness" },
      score: trait([2, 7, 12, 17]),
      scoreMax: 16,
      bands: band3(
        { ro: "Ești spontan(ă) și flexibil(ă); structura și rutina te atrag mai puțin.", en: "You are spontaneous and flexible; structure and routine appeal to you less." },
        { ro: "Un echilibru între organizare și spontaneitate.", en: "A balance between organization and spontaneity." },
        { ro: "Ești organizat(ă), disciplinat(ă) și orientat(ă) spre obiective.", en: "You are organized, disciplined and goal-oriented." },
      ),
    },
    {
      key: "neuroticism",
      name: { ro: "Neuroticism", en: "Neuroticism" },
      score: trait([3, 8, 13, 18]),
      scoreMax: 16,
      bands: band3(
        { ro: "Tinzi să fii calm(ă) și stabil(ă) emoțional, chiar și sub presiune.", en: "You tend to be calm and emotionally stable, even under pressure." },
        { ro: "Reacții emoționale în limite obișnuite.", en: "Emotional reactions within the usual range." },
        { ro: "Trăiești emoțiile intens și poți fi mai sensibil(ă) la stres.", en: "You experience emotions intensely and may be more sensitive to stress." },
      ),
    },
    {
      key: "openness",
      name: { ro: "Deschidere", en: "Openness" },
      score: trait([4, 9, 14, 19]),
      scoreMax: 16,
      bands: band3(
        { ro: "Preferi lucrurile familiare, concrete și practice.", en: "You prefer things that are familiar, concrete and practical." },
        { ro: "Un echilibru între curiozitate și preferința pentru familiar.", en: "A balance between curiosity and a preference for the familiar." },
        { ro: "Ești curios(oasă), imaginativ(ă) și deschis(ă) la idei noi.", en: "You are curious, imaginative and open to new ideas." },
      ),
    },
  ],
};
