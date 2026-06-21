import { NextResponse, type NextRequest } from "next/server";
import {
  BlueprintRequestSchema,
  BlueprintResponseSchema,
  SpecResponseSchema,
} from "@/server/schemas";
import { runBlueprintStage, runSpecStage } from "@/server/orchestrator";
import { getLiveAiDailyLimit, isLiveGeminiConfigured } from "@/server/config";
import { attachAnonIdCookie, getOrCreateAnonId } from "@/server/anon-id";
import { consumeLiveAiQuota } from "@/server/live-ai-rate-limit";
import { LiveGenerationError } from "@/server/llm/errors";

export async function POST(request: NextRequest) {
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

  if (parsedRequest.data.stage === "spec") {
    // The spec stage always runs deterministically, regardless of any
    // generationMode the client might send for the later blueprint
    // stage — see runSpecStage's docstring.
    try {
      const result = await runSpecStage(parsedRequest.data.idea);
      const parsedResponse = SpecResponseSchema.safeParse(result);
      if (!parsedResponse.success) {
        console.error("Spec stage produced an invalid response", parsedResponse.error);
        return NextResponse.json({ error: "Spec generation failed" }, { status: 500 });
      }
      return NextResponse.json(parsedResponse.data);
    } catch (error) {
      console.error("Spec generation failed", error);
      return NextResponse.json({ error: "Spec generation failed" }, { status: 500 });
    }
  }

  const { idea, productSpec, mvpScope, finalSelectedSkillIds, generationMode } = parsedRequest.data;

  // Anon id + quota bookkeeping only matters for "live" — demo generation
  // never touches the cookie or the limiter, so Demo Mode keeps working
  // even for a client with cookies disabled. Declared here (not inside the
  // try block below) so both the success path and every error path —
  // including a thrown LiveGenerationError — can still attach the cookie
  // on whatever response they return.
  let anonIdToAttach: string | null = null;

  if (generationMode === "live") {
    if (!isLiveGeminiConfigured()) {
      return NextResponse.json(
        {
          error: "Live Gemini Mode is not configured on this server. Switch to Demo Mode to continue.",
          code: "unavailable",
        },
        { status: 503 },
      );
    }

    const { anonId, isNew } = getOrCreateAnonId(request);
    if (isNew) anonIdToAttach = anonId;

    const quota = consumeLiveAiQuota(anonId, getLiveAiDailyLimit());
    if (!quota.allowed) {
      const response = NextResponse.json(
        {
          error: `You've reached the Live Gemini daily limit (${quota.limit} requests/day per user). Switch to Demo Mode, or try again after midnight UTC.`,
          code: "rate_limited",
        },
        { status: 429 },
      );
      if (anonIdToAttach) attachAnonIdCookie(response, anonIdToAttach);
      return response;
    }
  }

  try {
    const result = await runBlueprintStage(idea, productSpec, mvpScope, finalSelectedSkillIds, generationMode);
    const parsedResponse = BlueprintResponseSchema.safeParse(result);
    if (!parsedResponse.success) {
      console.error("Blueprint stage produced an invalid response", parsedResponse.error);
      const response = NextResponse.json({ error: "Blueprint generation failed" }, { status: 500 });
      if (anonIdToAttach) attachAnonIdCookie(response, anonIdToAttach);
      return response;
    }

    const response = NextResponse.json({ ...parsedResponse.data, generationMode: result.generationMode });
    if (anonIdToAttach) attachAnonIdCookie(response, anonIdToAttach);
    return response;
  } catch (error) {
    let response: NextResponse;
    if (error instanceof LiveGenerationError) {
      const status = error.code === "timeout" ? 504 : error.code === "unavailable" ? 503 : 502;
      console.error(`Live Gemini generation failed (${error.code})`, error.cause ?? error.message);
      response = NextResponse.json({ error: error.userMessage, code: error.code }, { status });
    } else {
      console.error("Blueprint generation failed", error);
      response = NextResponse.json({ error: "Blueprint generation failed" }, { status: 500 });
    }
    if (anonIdToAttach) attachAnonIdCookie(response, anonIdToAttach);
    return response;
  }
}
