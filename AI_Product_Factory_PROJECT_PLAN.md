# AI Product Factory

## Kaggle AI Agents Capstone Project Plan

**Project name:** AI Product Factory  
**Subtitle:** Agentic Engineering Copilot for MVP Blueprints  
**Competition:** AI Agents: Intensive Vibe Coding Capstone Project  
**Track:** Agents for Business  

## 1. Project Idea

AI Product Factory is a multi-agent system that transforms a raw founder or product-team business idea into an implementation-ready MVP blueprint.

The system does not generate a complete working application. Instead, it generates structured planning artifacts that help a team move from vague idea to safe, reviewable implementation.

Generated outputs:

- Product Specification
- MVP Scope
- Technical Architecture
- Security / Threat Model
- Development Roadmap
- Task Breakdown
- Readiness Score

## 2. Competition Positioning

The project fits the **Agents for Business** track because it helps founders, startups, and product teams reduce ambiguity, improve planning quality, and identify technical and security risks before implementation begins.

Core positioning:

> AI Product Factory turns vague startup ideas into implementation-ready MVP blueprints using a multi-agent workflow, reusable agent skills, MCP-style tool access, human approval gates, security threat modeling, and readiness evaluation. It demonstrates how vibe coding can evolve into safer, structured agentic engineering.

## 3. Scope

### In Scope

- Business idea intake
- Multi-agent blueprint generation
- Human approval checkpoint
- Skill routing based on project needs
- Security and data-risk analysis
- STRIDE threat modeling
- Roadmap and task planning
- Readiness scoring
- Markdown export of generated artifacts
- Public GitHub repository with setup instructions
- Kaggle Writeup and video demo

### Out of Scope

- Generating a complete frontend application for the user's idea
- Generating a complete backend application for the user's idea
- Production deployment of generated applications
- Payments, live procurement, or destructive real-world actions
- Complex database persistence unless time allows

## 4. User Flow

```text
Founder enters business idea
-> Business Analyst Agent generates Product Spec
-> User reviews and approves Product Spec
-> Architect Agent creates Technical Architecture
-> Security Agent creates Threat Model and Data Risk Analysis
-> Planning Agent creates Roadmap and Task Breakdown
-> Evaluation Agent calculates Readiness Score
-> User exports generated blueprint as Markdown files
```

The human-in-the-loop checkpoint is required: the user must approve the Product Specification before the system proceeds to architecture, security, roadmap, and tasks.

## 5. Agents

### 5.1 Business Analyst Agent

Input:

- Raw business idea
- Industry
- Target users
- Problem statement
- Current alternatives
- Constraints

Output:

- Product vision
- Target audience
- Personas
- User stories
- Product requirements
- MVP boundaries

### 5.2 Architect Agent

Input:

- Approved Product Specification
- Constraints
- Relevant selected skills

Output:

- Recommended stack
- System architecture
- Database entities
- API modules
- Integration points
- Scalability notes
- Deployment notes

### 5.3 Security Agent

Input:

- Product Specification
- Architecture
- Data classification

Output:

- Sensitive data detection
- Data classification
- STRIDE threat model
- Security risks
- Approval-required actions
- Security recommendations

STRIDE categories:

- Spoofing
- Tampering
- Repudiation
- Information Disclosure
- Denial of Service
- Elevation of Privilege

### 5.4 Planning Agent

Input:

- Product Specification
- Architecture
- Security findings

Output:

- MVP roadmap
- Milestones
- Task breakdown
- Delivery phases
- Dependencies

### 5.5 Evaluation Agent

Input:

- All generated artifacts

Output:

- Specification completeness score
- Architecture coverage score
- Security coverage score
- Implementation readiness score
- Final readiness score

Example:

```text
Readiness Score: 82/100
```

## 6. Skills Layer

The project should use the existing local skill kit:

```text
/Users/nika/Dev/Projects/ai_course_kaggle/agent-skill-kit
```

The Skill Router should select relevant skills based on the user's idea, data sensitivity, architecture needs, and delivery constraints.

Recommended skills to demonstrate:

- `spec-driven-development`
- `agent-security-review`
- `mcp-tool-consumption`
- `testing-patterns`
- `observability-rules`
- `a2a-agent-design`
- `a2ui-patterns`
- `database-design-rules`

The key message is that skills are not just prompts. They are reusable, portable, reviewable agent capabilities.

## 7. MCP / Tool Layer

Minimum viable implementation:

- Local MCP-style tool layer reads the skill library.
- It returns available skill metadata.
- It loads relevant `SKILL.md` files.
- It exports generated artifacts as Markdown.

Generated artifact structure:

```text
/specs/product-spec.md
/specs/technical-spec.md
/specs/threat-model.md
/roadmap.md
/tasks.md
/readiness-score.md
```

Optional stretch:

- GitHub MCP integration
- Export generated Markdown files to a GitHub repository
- Tool-call audit log

## 8. Frontend Requirements

Recommended MVP frontend:

- Vite
- React
- TypeScript
- Tailwind CSS

### Screens

1. Intro / landing screen
2. Business idea form
3. Agent workflow progress
4. Product Spec approval screen
5. Results page with tabs

### Business Idea Form Fields

Business information:

- Product name
- Industry
- Business description

Target audience:

- Target users
- Geography
- Market type

Problem:

- Problem statement
- Current alternatives

Solution:

- Core idea
- Key features

Constraints:

- Budget
- Timeline
- Team size

Data and security:

- Personal data
- Financial data
- Health data
- Sensitive information

### Results Tabs

- Product Spec
- MVP Scope
- Architecture
- Security
- Roadmap
- Tasks
- Readiness Score

## 9. Recommended Technical Stack

### MVP Stack

- Frontend: Vite + React + TypeScript + Tailwind
- Orchestrator: Node.js + TypeScript
- Storage: local JSON / Markdown export
- AI provider: interchangeable provider wrapper
- Demo hosting: Vercel, Render, Railway, or public GitHub with setup instructions

### Optional Production Stack

- Next.js
- NestJS
- PostgreSQL
- Prisma
- GitHub MCP integration

For the competition deadline, the MVP stack is safer and less likely to create unnecessary implementation risk.

## 10. Course Concepts Map

| Course concept | Where it is demonstrated |
|---|---|
| Multi-agent system | Business Analyst, Architect, Security, Planner, and Evaluation agents |
| Agent skills | Skill Router and `agent-skill-kit` usage |
| MCP Server / Tool Integration | Local MCP-style tool layer for skills and Markdown export |
| Security | STRIDE, data classification, approval gates, security recommendations |
| Human-in-the-loop | Product Spec approval before downstream generation |
| Specification-driven development | Product Spec -> Architecture -> Roadmap workflow |
| Deployability | Public demo or GitHub repository with setup instructions |
| Evaluation | Readiness scoring layer |

## 11. Kaggle Deliverables

### Required

- Kaggle Writeup, up to 2,500 words
- Media Gallery
- Cover image
- YouTube video, 5 minutes or less
- Public Project Link
- Public GitHub repository or public live demo

### Repository Requirements

The GitHub repository should include:

- `README.md`
- setup instructions
- architecture diagram
- course concepts map
- demo scenario
- screenshots
- generated example blueprint
- notes about security and secrets

Suggested documentation files:

```text
docs/demo-scenario.md
docs/architecture.md
docs/course-concepts-map.md
docs/writeup-draft.md
examples/generated-blueprint/product-spec.md
examples/generated-blueprint/technical-spec.md
examples/generated-blueprint/threat-model.md
examples/generated-blueprint/roadmap.md
examples/generated-blueprint/tasks.md
examples/generated-blueprint/readiness-score.md
```

## 12. Video Plan

Target length: 3-5 minutes.

Suggested structure:

1. Problem: founders and product teams start with vague ideas.
2. Solution: AI Product Factory creates MVP blueprints.
3. Architecture: show multi-agent diagram.
4. Demo:
   - fill form;
   - generate Product Spec;
   - approve Product Spec;
   - show Architecture, Security, Roadmap, Tasks, and Readiness Score.
5. Course concepts:
   - multi-agent system;
   - skills;
   - MCP/tool layer;
   - security;
   - human-in-the-loop;
   - evaluation.
6. Finish: why this helps business teams.

## 13. Screenshots for Media Gallery

Minimum screenshots:

- Intro / landing screen
- Business idea form
- Agent workflow progress
- Product Spec approval screen
- Product Spec result
- Architecture result
- Security / threat model result
- Roadmap result
- Readiness Score result

## 14. Kaggle Writeup Structure

Suggested sections:

1. Problem
2. Solution
3. Why Agents
4. Architecture
5. Multi-Agent Design
6. Skills Layer
7. MCP / Tool Layer
8. Security and Human-in-the-Loop
9. Evaluation Layer
10. Technical Stack
11. Demo
12. Future Work

## 15. Implementation Plan

### Phase 1: Planning Artifacts

- Create `PROJECT_PLAN.md`
- Create `docs/course-concepts-map.md`
- Create `docs/demo-scenario.md`
- Create `docs/architecture.md`
- Create one complete example generated blueprint

### Phase 2: MVP UI

- Build business idea form
- Build agent workflow screen
- Build approval step
- Build results tabs
- Add export controls

### Phase 3: Agent Orchestrator

- Implement typed agent interfaces
- Implement Business Analyst Agent
- Implement Architect Agent
- Implement Security Agent
- Implement Planning Agent
- Implement Evaluation Agent

### Phase 4: Skills and MCP Tooling

- Implement skill metadata reader
- Implement skill selection logic
- Implement MCP-style tool access
- Implement Markdown export

### Phase 5: Security and Evaluation

- Add sensitive data detection
- Add STRIDE threat model generation
- Add approval-required action detection
- Add readiness scoring

### Phase 6: Polish and Submission

- Add screenshots
- Finalize README
- Draft Kaggle Writeup
- Record YouTube video
- Verify public links
- Check Kaggle Timeline and host announcements
- Submit final Writeup before deadline

## 16. MVP Success Criteria

The MVP is successful if:

- The user can enter a business idea.
- The system shows a visible multi-agent workflow.
- Product Spec requires user approval.
- Architecture, Security, Roadmap, and Tasks are generated after approval.
- The system produces a Readiness Score.
- Outputs can be exported as Markdown.
- README clearly explains setup and architecture.
- Video clearly demonstrates at least three course concepts.
- No API keys or passwords are committed.

## 17. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Scope becomes too large | Do not generate full applications; generate blueprints only |
| MCP integration takes too long | Use local MCP-style tool layer and document it clearly |
| UI polish consumes too much time | Prioritize readable workflow and results tabs |
| AI provider issues | Use provider wrapper and mock/demo mode if needed |
| Security claims feel abstract | Include STRIDE, data classification, and approval gates visibly in UI |
| Kaggle requirements change | Re-check Timeline, Rules, and Discussion before submission |

## 18. Final Submission Checklist

- [ ] Public GitHub repository is available
- [ ] README has setup instructions
- [ ] No secrets or API keys are committed
- [ ] Demo works locally
- [ ] Public project link works
- [ ] YouTube video is uploaded
- [ ] Kaggle Writeup is under 2,500 words
- [ ] Media Gallery has cover image and screenshots
- [ ] Video is attached to Media Gallery
- [ ] Track is selected: Agents for Business
- [ ] Course concepts are clearly mapped
- [ ] Timeline and host announcements are checked
- [ ] Final Writeup is submitted before deadline

