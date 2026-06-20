import type { IAgent, ISecurityInput, ISecurityOutput } from "@/types/agents";
import { detectSecuritySignals, type ISecuritySignals } from "./security-signals";
import { getEnrichmentBullets } from "./skill-enrichment";

/**
 * Demo-mode implementation: a deterministic, rule-based STRIDE model driven
 * by detected signals (data-sensitivity flags plus keyword matches against
 * the idea's own text — see security-signals.ts). No LLM call. Every STRIDE
 * category always has a row; the row content is tailored when a relevant
 * signal is present, and falls back to a generic baseline otherwise.
 */
export const securityAgent: IAgent<ISecurityInput, ISecurityOutput> = {
  id: "security",
  run({ idea, selectedSkillIds }) {
    const name = idea.productName || "Untitled Product";
    const signals = detectSecuritySignals(idea);
    const enrichmentBullets = getEnrichmentBullets(selectedSkillIds, "security");
    const enrichmentSection =
      enrichmentBullets.length > 0
        ? `\n## Skill-Informed Security Notes\n\n${enrichmentBullets.map((bullet) => `- ${bullet}`).join("\n")}\n`
        : "";

    const security = `# Security and Threat Model: ${name}

## Data Classification

${buildDataClassificationTable(signals)}

## STRIDE Threat Model

${buildStrideTable(signals)}

## Security Risks

${buildSecurityRisks(signals).map((risk) => `- ${risk}`).join("\n")}

## Approval-Required Actions

${buildApprovalActions(signals).map((action) => `- ${action}`).join("\n")}

## Security Recommendations

${buildRecommendations(signals).map((rec) => `- ${rec}`).join("\n")}
${enrichmentSection}`;

    return { security };
  },
};

function buildDataClassificationTable(signals: ISecuritySignals): string {
  const rows: string[][] = [];

  if (signals.hasPersonalData) {
    rows.push([
      "Names, emails, profile data",
      "Personal data",
      "Required for accounts and communication between users",
    ]);
  }
  if (signals.hasFinancialData) {
    rows.push([
      "Payment and payout details",
      "Financial data",
      "Should never be stored directly; delegate to a payment processor's tokenized flow",
    ]);
  }
  if (signals.hasHealthData) {
    rows.push([
      "Health data",
      "Health data",
      "Subject to stricter regulatory handling; minimize collection and retention",
    ]);
  }
  if (signals.hasMessaging) {
    rows.push([
      "Private messages between users",
      "Personal data",
      "May contain personal details (e.g. addresses); never expose outside the participant pair",
    ]);
  }
  if (signals.hasSellerOrInstructor) {
    rows.push([
      "Seller/instructor identity and verification status",
      "Operational",
      "Determines who is trusted to sell or teach on the platform",
    ]);
  }
  if (signals.hasUserGeneratedContent) {
    rows.push([
      "User-generated content (courses, listings, materials)",
      "Operational",
      "Owned by the uploading user; subject to takedown/removal requests",
    ]);
  }
  if (signals.hasModerationOrReviews) {
    rows.push([
      "Reviews, ratings, and reports",
      "Operational",
      "Can reveal disputes between users; moderation actions need an audit trail",
    ]);
  }
  if (signals.sensitiveInfoNotes) {
    rows.push(["Other sensitive information", "Personal data", signals.sensitiveInfoNotes]);
  }

  if (rows.length === 0) {
    rows.push(["None flagged", "None", "No sensitive data categories were flagged for this idea"]);
  }

  const header = "| Data | Category | Notes |\n|---|---|---|";
  const body = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
  return `${header}\n${body}`;
}

interface IStrideRow {
  category: string;
  risk: string;
  mitigation: string;
}

function buildStrideTable(signals: ISecuritySignals): string {
  const rows: IStrideRow[] = [
    spoofingRow(signals),
    tamperingRow(signals),
    repudiationRow(signals),
    informationDisclosureRow(signals),
    denialOfServiceRow(signals),
    elevationOfPrivilegeRow(signals),
  ];

  const header = "| Category | Risk | Mitigation |\n|---|---|---|";
  const body = rows.map((row) => `| ${row.category} | ${row.risk} | ${row.mitigation} |`).join("\n");
  return `${header}\n${body}`;
}

function spoofingRow(signals: ISecuritySignals): IStrideRow {
  if (signals.hasSellerOrInstructor) {
    return {
      category: "Spoofing",
      risk: "Fake seller/instructor account impersonating a verified seller or instructor",
      mitigation: "Verify seller/instructor identity before granting seller status; require MFA for seller accounts",
    };
  }
  return {
    category: "Spoofing",
    risk: "Account takeover via weak authentication",
    mitigation: "Use a managed auth provider with MFA support; rate-limit login attempts",
  };
}

function tamperingRow(signals: ISecuritySignals): IStrideRow {
  if (signals.hasFinancialData) {
    return {
      category: "Tampering",
      risk: "Client tampers with order, price, or payout status fields",
      mitigation: "Enforce server-side authorization on all write paths; never trust client-supplied price or status fields",
    };
  }
  if (signals.hasUserGeneratedContent) {
    return {
      category: "Tampering",
      risk: "User tampers with course/listing content after it has been reviewed or published",
      mitigation: "Version content edits and require re-review after substantive changes",
    };
  }
  return {
    category: "Tampering",
    risk: "Client-supplied identity/role/price fields trusted by the server",
    mitigation: "Enforce server-side authorization; never trust client-supplied identity fields",
  };
}

function repudiationRow(signals: ISecuritySignals): IStrideRow {
  if (signals.hasFinancialData) {
    return {
      category: "Repudiation",
      risk: "Disputes over payment, payout, or refund with no audit trail",
      mitigation: "Log all payment/payout state transitions with timestamps and actor IDs",
    };
  }
  if (signals.hasModerationOrReviews) {
    return {
      category: "Repudiation",
      risk: "Disputes over a review, report, or moderation action with no record",
      mitigation: "Log moderation actions and review submissions with timestamps and actor IDs",
    };
  }
  return {
    category: "Repudiation",
    risk: "No record of sensitive state changes",
    mitigation: "Log state transitions with timestamps and actor IDs",
  };
}

function informationDisclosureRow(signals: ISecuritySignals): IStrideRow {
  if (signals.hasMessaging) {
    return {
      category: "Information Disclosure",
      risk: "Private messages between users exposed to the wrong user or a third party",
      mitigation: "Authorize message threads strictly by participant ID; never log or export message contents",
    };
  }
  if (signals.hasPersonalData || signals.hasFinancialData) {
    return {
      category: "Information Disclosure",
      risk: "Sensitive data returned to the wrong user",
      mitigation: "Authorize all reads by participant/owner ID",
    };
  }
  return {
    category: "Information Disclosure",
    risk: "Internal data exposed through an overly permissive API response",
    mitigation: "Return only the fields a client needs; review API responses for over-exposure",
  };
}

function denialOfServiceRow(signals: ISecuritySignals): IStrideRow {
  if (signals.hasSellerOrInstructor) {
    return {
      category: "Denial of Service",
      risk: "Public catalog/storefront scraping or checkout abuse",
      mitigation: "Rate-limit public catalog, search, and checkout endpoints",
    };
  }
  return {
    category: "Denial of Service",
    risk: "Public endpoints abused at volume",
    mitigation: "Rate-limit public and write endpoints",
  };
}

function elevationOfPrivilegeRow(signals: ISecuritySignals): IStrideRow {
  if (signals.hasModerationOrReviews) {
    return {
      category: "Elevation of Privilege",
      risk: "Regular user performs an admin moderation action (remove listing, suspend user, edit another user's review)",
      mitigation: "Enforce role checks server-side on every moderation endpoint; never trust a client-supplied role field",
    };
  }
  if (signals.hasSellerOrInstructor) {
    return {
      category: "Elevation of Privilege",
      risk: "Learner/buyer account performs a seller/instructor-only action",
      mitigation: "Enforce role checks server-side on every seller/instructor-only endpoint",
    };
  }
  return {
    category: "Elevation of Privilege",
    risk: "Lower-privilege user performs a privileged action",
    mitigation: "Enforce role checks server-side on every privileged endpoint",
  };
}

function buildSecurityRisks(signals: ISecuritySignals): string[] {
  const risks: string[] = [];

  if (signals.hasFinancialData) {
    risks.push(
      "Storing raw payment data in-house — avoid entirely; use a payment processor's tokenized flow.",
    );
  }
  risks.push(
    "Trusting client-supplied identity or role fields (`userId`, `role`, `sellerId`) in write requests — always derive identity from the authenticated session server-side.",
  );
  if (signals.hasMessaging && (signals.hasPersonalData || signals.sensitiveInfoNotes)) {
    risks.push(
      "Personal details embedded in free-text messages (e.g. addresses) are harder to redact or audit than a structured field — consider structured fields before scaling.",
    );
  }
  if (signals.hasUserGeneratedContent) {
    risks.push(
      "User-generated content may include copyright-infringing or policy-violating material — plan a takedown/removal process before launch.",
    );
  }
  if (signals.hasSellerOrInstructor && signals.hasFinancialData) {
    risks.push(
      "Onboarding a seller/instructor without identity verification before enabling payouts increases fraud and chargeback risk.",
    );
  }

  return risks;
}

function buildApprovalActions(signals: ISecuritySignals): string[] {
  const actions: string[] = [];

  if (signals.hasFinancialData) {
    actions.push("Enabling payments or instructor/seller payouts (real money movement).");
  }
  if (signals.hasSellerOrInstructor) {
    actions.push("Changing seller/instructor verification rules or requirements.");
  }
  if (signals.hasUserGeneratedContent) {
    actions.push("Deleting user-generated content (courses, listings, materials) — may be irreversible.");
  }
  if (signals.hasMessaging) {
    actions.push("Exposing or sharing private messages with a third party.");
  }
  if (signals.hasModerationOrReviews || signals.hasUserGeneratedContent || signals.hasSellerOrInstructor) {
    actions.push("Admin moderation actions (removing a listing, suspending a user).");
  }
  actions.push("Any change to authentication or session handling.");

  return actions;
}

function buildRecommendations(signals: ISecuritySignals): string[] {
  const recommendations: string[] = ["Use a managed auth/identity provider rather than building custom auth."];

  if (signals.hasFinancialData) {
    recommendations.push("Keep payment data out of the application database entirely; delegate to the payment processor.");
  }
  if (signals.hasSellerOrInstructor) {
    recommendations.push("Define a clear seller/instructor verification process before allowing payouts.");
  }
  if (signals.hasModerationOrReviews) {
    recommendations.push("Add an audit log for moderation actions and a process for handling disputed reviews/reports.");
  }
  if (signals.hasMessaging && (signals.hasPersonalData || signals.sensitiveInfoNotes)) {
    recommendations.push("Add structured fields (e.g. shipping address) before scaling, instead of relying on free-text messages for sensitive data.");
  }

  return recommendations;
}
