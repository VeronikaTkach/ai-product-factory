import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(__dirname, "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is an npm workspaces monorepo; widen the tracing root so Next.js
  // is allowed to look outside apps/web at all (agent-skill-kit/ lives at
  // the repo root, two levels up).
  outputFileTracingRoot: monorepoRoot,
  // /api/blueprint and /api/skills read agent-skill-kit/skills/**/*.md at
  // runtime via fs.readdir/fs.readFile (see @ai-product-factory/skill-tools),
  // which static import tracing cannot follow. Without this, a Vercel
  // deploy would not bundle those files into the serverless function and
  // both routes would fail at runtime in production.
  outputFileTracingIncludes: {
    "/api/blueprint": ["../../agent-skill-kit/skills/**/*"],
    "/api/skills": ["../../agent-skill-kit/skills/**/*"],
  },
};

export default nextConfig;
