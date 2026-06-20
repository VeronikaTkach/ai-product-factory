import type { ISelectedSkill } from "@/types/blueprint";
import type { ISkillMetadata } from "@ai-product-factory/skill-tools";

/**
 * Builds the read-only display list for the results screen from the
 * user's final selected skill ids, reusing each recommended skill's
 * original reason text and falling back to the catalog name/a generic
 * note for skills the user added manually.
 */
export function buildFinalSelectedSkills(
  selectedSkillIds: string[],
  recommendedSkills: ISelectedSkill[],
  availableSkills: ISkillMetadata[],
): ISelectedSkill[] {
  const recommendedById = new Map(recommendedSkills.map((skill) => [skill.id, skill]));
  const availableById = new Map(availableSkills.map((skill) => [skill.id, skill]));

  return selectedSkillIds.map((id) => {
    const recommended = recommendedById.get(id);
    if (recommended) return recommended;

    const available = availableById.get(id);
    return {
      id,
      name: available?.name ?? id,
      reason: "Added manually before generating the blueprint.",
    };
  });
}
