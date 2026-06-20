import type { IBusinessIdea } from "@/types/blueprint";

/**
 * Deterministic, keyword-based detection of security-relevant signals in a
 * submitted idea. No LLM call — same style as packages/skill-tools'
 * recommender.ts keyword rules. Drives the Security agent's data
 * classification, STRIDE rows, and approval-required actions so they
 * reflect what the idea actually describes instead of a fixed template.
 */
export interface ISecuritySignals {
  hasPersonalData: boolean;
  hasFinancialData: boolean;
  hasHealthData: boolean;
  hasMessaging: boolean;
  hasSellerOrInstructor: boolean;
  hasUserGeneratedContent: boolean;
  hasModerationOrReviews: boolean;
  sensitiveInfoNotes: string;
}

const MESSAGING_KEYWORDS = ["messag", "chat", "communicat", "dm", "direct message"];
const SELLER_KEYWORDS = ["instructor", "seller", "vendor", "marketplace", "storefront", "merchant"];
const CONTENT_KEYWORDS = ["course", "upload", "listing", "product", "lesson", "material", "content"];
const MODERATION_KEYWORDS = ["review", "rating", "moderation", "report", "flag", "dispute"];

function buildIdeaText(idea: IBusinessIdea): string {
  return [idea.businessDescription, idea.coreIdea, idea.keyFeatures, idea.problemStatement]
    .join(" ")
    .toLowerCase();
}

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function detectSecuritySignals(idea: IBusinessIdea): ISecuritySignals {
  const text = buildIdeaText(idea);

  return {
    hasPersonalData: idea.hasPersonalData,
    hasFinancialData: idea.hasFinancialData,
    hasHealthData: idea.hasHealthData,
    hasMessaging: matchesAny(text, MESSAGING_KEYWORDS),
    hasSellerOrInstructor: matchesAny(text, SELLER_KEYWORDS),
    hasUserGeneratedContent: matchesAny(text, CONTENT_KEYWORDS),
    hasModerationOrReviews: matchesAny(text, MODERATION_KEYWORDS),
    sensitiveInfoNotes: idea.sensitiveInfoNotes,
  };
}
