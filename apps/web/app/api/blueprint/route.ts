import { NextResponse } from "next/server";
import {
  BlueprintRequestSchema,
  BlueprintResponseSchema,
  SpecResponseSchema,
} from "@/server/schemas";
import { runBlueprintStage, runSpecStage } from "@/server/orchestrator";
import { isDemoMode } from "@/server/config";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsedRequest = BlueprintRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsedRequest.error.flatten() },
      { status: 400 },
    );
  }

  if (!isDemoMode()) {
    return NextResponse.json(
      { error: "Live LLM mode is not implemented yet. Set DEMO_MODE=true." },
      { status: 501 },
    );
  }

  try {
    if (parsedRequest.data.stage === "spec") {
      const result = await runSpecStage(parsedRequest.data.idea);
      const parsedResponse = SpecResponseSchema.safeParse(result);
      if (!parsedResponse.success) {
        console.error("Spec stage produced an invalid response", parsedResponse.error);
        return NextResponse.json({ error: "Spec generation failed" }, { status: 500 });
      }
      return NextResponse.json(parsedResponse.data);
    }

    const result = await runBlueprintStage(
      parsedRequest.data.idea,
      parsedRequest.data.productSpec,
      parsedRequest.data.mvpScope,
      parsedRequest.data.finalSelectedSkillIds,
    );
    const parsedResponse = BlueprintResponseSchema.safeParse(result);
    if (!parsedResponse.success) {
      console.error("Blueprint stage produced an invalid response", parsedResponse.error);
      return NextResponse.json({ error: "Blueprint generation failed" }, { status: 500 });
    }
    return NextResponse.json(parsedResponse.data);
  } catch (error) {
    console.error("Blueprint generation failed", error);
    return NextResponse.json({ error: "Blueprint generation failed" }, { status: 500 });
  }
}
