# AI Product Factory

## Deployment Plan and Technical Stack

**Goal:** deploy the AI Product Factory demo using Vercel and free or near-free infrastructure wherever possible.  
**Primary hosting target:** Vercel  
**Optional MCP hosting target:** Render Free, with Render Starter as a fallback only if needed.

## 1. Deployment Strategy

The product should be deployed with a Vercel-first architecture:

```text
User
-> Vercel Next.js Web App
-> Vercel API Routes / Agent Orchestrator
-> LLM Provider
-> Public MCP Skill Server
-> Bundled Agent Skill Kit
```

The frontend, backend orchestration, and demo UI should live on Vercel. The public MCP Skill Server can either run on Vercel as a serverless endpoint or on Render as a small free web service.

## 2. Recommended Architecture

### Primary MVP Architecture

```text
Vercel
  Next.js frontend
  API routes
  Agent orchestrator
  LLM provider calls
  Blueprint generation
  Markdown artifact generation

Render Free
  Public read-only MCP Skill Server
  Skill listing
  Skill retrieval
  Skill recommendation
```

### Lowest-Cost Architecture

```text
Vercel only
  Next.js frontend
  API routes
  MCP-style skill endpoints
  Agent orchestration
```

This is the cheapest option, but it is less compelling for the competition because it does not demonstrate a separately deployed public MCP server.

### Recommended Competition Architecture

```text
Vercel
  Web app
  Serverless API routes
  Agent orchestrator

Render Free
  Public read-only MCP Skill Server
```

Use Render Starter only if Render Free is too slow or unreliable near the final submission deadline.

## 3. Technical Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vercel hosting

### Backend / Orchestrator

- Next.js API Routes
- TypeScript
- Zod for request/response validation
- Server-side LLM provider wrapper
- Server-side MCP client

### MCP Skill Server

- Node.js
- TypeScript
- Read-only MCP tools
- Hosted on Render Free or Vercel serverless endpoint
- Bundled `agent-skill-kit`

### AI Layer

- Interchangeable LLM provider wrapper
- API key stored only in server environment variables
- No LLM keys in frontend code
- Optional mock mode for demos and local development

### Storage

- No database for MVP
- Request-scoped generation
- Example artifacts committed in repository
- Markdown download/export generated in the browser or API response

### Optional Later Additions

- PostgreSQL only if persistent project history is needed
- GitHub MCP export only if time allows
- Observability dashboard only if time allows

## 4. Repository Structure

Recommended monorepo:

```text
ai-product-factory/
  apps/
    web/
      app/
      components/
      lib/
      public/
      package.json
  packages/
    skill-kit/
      skills/
        spec-driven-development/
        agent-security-review/
        mcp-tool-consumption/
        testing-patterns/
        observability-rules/
        database-design-rules/
        a2a-agent-design/
        a2ui-patterns/
    mcp-skill-server/
      src/
        server.ts
        tools/
          list-skills.ts
          get-skill.ts
          recommend-skills.ts
          score-readiness.ts
      package.json
  examples/
    generated-blueprint/
      product-spec.md
      technical-spec.md
      threat-model.md
      roadmap.md
      tasks.md
      readiness-score.md
  docs/
    architecture.md
    course-concepts-map.md
    demo-scenario.md
    deployment.md
  README.md
  package.json
```

For a faster MVP, the app can start as a single Next.js project and later be split into this structure.

**As implemented (Phase 4B):** this structure now exists as a real npm workspaces monorepo (root `package.json` with `workspaces: ["apps/*", "packages/*"]`). Two differences from the sketch above: the skill content itself lives in the existing top-level `agent-skill-kit/skills/` (not copied into `packages/skill-kit/skills/`), and the tool *logic* that both `apps/web` and `packages/mcp-skill-server` call is factored into a third package, `packages/skill-tools` (`@ai-product-factory/skill-tools`), so neither app duplicates `listSkills`/`getSkill`/`recommendSkills`/`scoreReadiness`. `packages/mcp-skill-server/src/tools/*.ts` matches the sketch exactly — each file registers one MCP tool against the shared package.

## 5. Vercel Deployment

### What Runs on Vercel

- Public web demo
- Business idea form
- Agent workflow UI
- Product Spec approval flow
- Results tabs
- API routes for agent orchestration
- LLM provider calls
- MCP client calls
- Markdown generation or download

### Suggested API Routes

```text
POST /api/generate-spec
POST /api/generate-blueprint
POST /api/recommend-skills
POST /api/score-readiness
GET  /api/health
```

Alternative simplified MVP:

```text
POST /api/blueprint
GET  /api/health
```

The simplified endpoint can accept a `stage` field:

```text
spec
architecture
security
roadmap
evaluation
```

### Vercel Environment Variables

Required:

```text
LLM_PROVIDER
LLM_API_KEY
MCP_SERVER_URL
NEXT_PUBLIC_APP_NAME
```

Optional:

```text
LLM_MODEL
DEMO_MODE
ENABLE_MOCK_RESPONSES
MCP_TIMEOUT_MS
```

Important:

- Never expose `LLM_API_KEY` with a `NEXT_PUBLIC_` prefix.
- Do not commit `.env.local`.
- Keep mock mode available for reliable demos.

### Vercel Build Settings

If using a single Next.js app:

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

If using a monorepo:

```text
Root Directory: apps/web
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

## 6. Public MCP Skill Server Deployment

### Implementation Status (Phase 4B)

This section originally described a planned server. It is now implemented at `packages/mcp-skill-server` (npm workspace package `@ai-product-factory/mcp-skill-server`), backed by a shared read-only package `packages/skill-tools` that `apps/web` also depends on. A few details below have been corrected to match what was actually built — see `packages/mcp-skill-server/README.md` and `docs/architecture.md` for the authoritative reference. Not yet deployed to Render — local build and a real MCP client call have been verified (see `docs/architecture.md`).

### Purpose

The public MCP Skill Server exposes the Agentic Engineering Skill Kit as a reusable, read-only capability layer.

The agents use it to:

- discover available skills;
- retrieve relevant skill instructions;
- recommend skills for a business idea;
- support readiness scoring.

### Recommended Hosting

Primary:

```text
Render Free Web Service
```

Fallback:

```text
Render Starter Web Service
```

Use Starter only if Free is too slow or unreliable close to the deadline.

### MCP Server Tools

Minimum tools:

```text
list_skills
get_skill
recommend_skills
score_readiness
```

Optional tools:

```text
get_course_concepts_map
generate_artifact_bundle
validate_blueprint
```

### MCP Security Rules

The public MCP server must be:

- read-only;
- limited to the bundled skill kit;
- unable to read arbitrary files;
- unable to execute shell commands;
- unable to access secrets;
- unable to write to the server filesystem;
- protected by input validation;
- rate-limited if possible;
- logged without storing sensitive user data.

### Render Environment Variables

As implemented (see `packages/mcp-skill-server/.env.example`):

Required:

```text
HOST=0.0.0.0
```

(`PORT` is injected automatically by Render — do not set it manually.)

Optional:

```text
SKILL_KIT_PATH=../../agent-skill-kit/skills   # default; only override if the layout changes
MCP_SERVER_NAME=ai-product-factory-skill-server
MCP_LOG_LEVEL=info
ALLOWED_ORIGIN=https://ai-product-factory-mcp.onrender.com
RATE_LIMIT_REQUESTS_PER_MINUTE=60
```

`SKILL_KIT_PATH` points at the bundled `agent-skill-kit/skills` directory (not a separately copied `packages/skill-kit`, as originally sketched in this plan) — the repository's actual skill content lives at the repo root in `agent-skill-kit/`.

`ALLOWED_ORIGIN` must be **this MCP server's own public Render origin**, not the Vercel frontend's URL — it is read into `allowedHosts` to restrict the `Host` header this server accepts (DNS-rebinding mitigation), which is unrelated to browser CORS. Setting it to the Vercel app's URL causes Render's health check to fail, since the health check request's `Host` header won't match.

### Render Build Settings

As implemented, this is an npm workspace package, so the Render **Root Directory must be the repository root**, not `packages/mcp-skill-server` — otherwise npm cannot resolve the local `@ai-product-factory/skill-tools` workspace dependency:

```text
Root Directory: (leave blank — repo root)
Build Command: npm install && npm run build:skill-tools && npm run build --workspace=packages/mcp-skill-server
Start Command: npm run start --workspace=packages/mcp-skill-server
Health Check Path: /health
```

## 7. Cost Plan

### Free / Near-Free Target

| Component | Provider | Expected cost |
|---|---:|---:|
| Frontend | Vercel Hobby | $0/month |
| API routes / orchestrator | Vercel Hobby | $0/month within limits |
| MCP server | Render Free | $0/month |
| Database | None | $0/month |
| Storage | Repository/browser download | $0/month |
| LLM API | External provider | Usage-based |

### Fallback Cost

If Render Free is too slow:

| Component | Provider | Expected cost |
|---|---:|---:|
| MCP server | Render Starter | about $7/month |

The recommended fallback is to use Render Starter only during the competition submission period if needed.

## 8. Local Development

### Local Commands

Recommended:

```bash
npm install
npm run dev
```

If running web and MCP separately:

```bash
npm run dev:web
npm run dev:mcp
```

### Local Environment

**As implemented (Phase 4B):** `LLM_PROVIDER`/`LLM_API_KEY`/`MCP_SERVER_URL` are not read by any code yet — `apps/web` calls the skill tools in-process, not over the network (see `docs/architecture.md`). Today, `apps/web/.env.example` only has `DEMO_MODE` and an optional `SKILL_KIT_PATH` override; `packages/mcp-skill-server/.env.example` has the full server config (`PORT`, `HOST`, `ALLOWED_ORIGIN`, `RATE_LIMIT_REQUESTS_PER_MINUTE`, `MCP_SERVER_NAME`, `MCP_LOG_LEVEL`). Copy the relevant `.env.example` to `.env`/`.env.local` per package rather than the values originally sketched below, which describe a later, not-yet-built integration:

```text
LLM_PROVIDER=...
LLM_API_KEY=...
MCP_SERVER_URL=http://localhost:3001/mcp
NEXT_PUBLIC_APP_NAME=AI Product Factory
DEMO_MODE=true
```

```text
NODE_ENV=development
SKILL_KIT_PATH=../../agent-skill-kit/skills
```

## 9. Demo Mode

Demo mode is important for reliability during judging and video recording.

When `DEMO_MODE=true`, the app can:

- use deterministic example outputs;
- avoid unexpected LLM failures;
- still show the multi-agent workflow;
- still call the MCP skill server for skill discovery;
- generate repeatable screenshots and video.

Recommended demo scenario:

> A founder wants to build a marketplace for knitting instructors where learners buy courses, communicate with teachers, and purchase handmade products.

## 10. Secrets and Security

Rules:

- Do not commit API keys.
- Do not expose LLM keys to the browser.
- Do not include local absolute paths in production config.
- Do not let public MCP read outside the bundled skill kit.
- Do not let MCP execute commands.
- Do not store sensitive user input unless persistence is explicitly added.
- Log only metadata needed for debugging.

Pre-submit checks:

```text
Search repository for API keys
Check Vercel env vars
Check Render env vars
Verify MCP tools are read-only
Verify public demo does not require login
Verify public demo does not require paid access
```

## 11. Deployment Steps

### Step 1: Prepare Repository

- Add Next.js app.
- Add skill kit package.
- Add MCP skill server package.
- Add example generated blueprint.
- Add README setup instructions.
- Add `.env.example`.

### Step 2: Deploy Web App to Vercel

- Connect GitHub repository to Vercel.
- Set root directory.
- Add environment variables.
- Deploy preview.
- Test form, approval flow, and results tabs.

### Step 3: Deploy MCP Server

- Create Render Web Service.
- Connect the same repository.
- Set root directory to MCP server package.
- Add environment variables.
- Deploy service.
- Copy public MCP URL.

### Step 4: Connect Vercel to MCP

- Set `MCP_SERVER_URL` in Vercel.
- Redeploy Vercel app.
- Test `recommend_skills` and `get_skill`.
- Confirm UI displays selected skills from MCP.

### Step 5: Final Demo Verification

- Open public Vercel URL.
- Run full demo scenario.
- Confirm Product Spec approval works.
- Confirm results tabs load.
- Confirm Readiness Score appears.
- Confirm no login is required.
- Confirm no paywall is required.
- Confirm public MCP endpoint is reachable.

## 12. Public Links for Kaggle

The Kaggle submission should include:

```text
Live demo:
https://your-vercel-app.vercel.app

Public MCP Skill Server:
https://your-render-mcp-service.onrender.com/mcp

GitHub repository:
https://github.com/your-username/ai-product-factory

YouTube video:
https://youtube.com/...
```

## 13. Final Deployment Checklist

- [ ] Web app deployed to Vercel
- [ ] Vercel app works without login
- [ ] Vercel API routes work
- [ ] LLM keys are stored only in Vercel environment variables
- [ ] Public MCP server deployed
- [ ] MCP server is read-only
- [ ] MCP server cannot read arbitrary files
- [ ] MCP server cannot execute commands
- [ ] `MCP_SERVER_URL` configured in Vercel
- [ ] Demo mode works
- [ ] Full generation flow works
- [ ] Product Spec approval works
- [ ] Results tabs render correctly
- [ ] Markdown export works or generated artifacts are visible
- [ ] README includes deployment instructions
- [ ] `.env.example` exists
- [ ] No `.env.local` committed
- [ ] No API keys committed
- [ ] Public URLs added to Kaggle Writeup

