# Claude Project Instructions

Read `AGENTS.md` first. It is the source of truth for this project.

This workspace is the **student-frontend** React LMS app at:

`C:\Users\Admin\Desktop\Job\student_frontend`

The app is built with React 19, Vite 7, Tailwind CSS 4, Redux Toolkit, React Router 7, Axios, and lucide-react.

This is **not** the Beacon Flutter project.

## GitNexus

Use GitNexus with `repo: "student-frontend"`.

Before editing any function, class, method, exported constant, Redux slice, route config, service module, or shared component, run impact analysis:

`gitnexus_impact({ repo: "student-frontend", target: "symbolName", direction: "upstream" })`

Before committing, run:

`gitnexus_detect_changes({ repo: "student-frontend", scope: "all" })`

If GitNexus says the index is stale, run:

`npx gitnexus analyze`

## UI Work

For every UI, UX, redesign, animation, motion, mobile screen, or image-to-code task:

1. Read `skills/llms.txt`.
2. Choose the relevant `skills/<skill-folder>/SKILL.md`.
3. Prefer `skills/student-lms-blue-skill/SKILL.md` for student LMS workflows.
4. Use the existing Tailwind 4 design tokens from `tailwind.config.js`.

Do not use Beacon Flutter UI rules in this project.

## Engineering Defaults

- Use `rg` or `rg --files` for searching.
- Use `apply_patch` for manual edits.
- Keep code split by feature and responsibility.
- Put API endpoints in `src/core/constants/apiEndpoints.js`.
- Put service calls in `src/core/services/modules`.
- Put route paths in `src/core/constants/routes.js`.
- Put Redux logic in the relevant feature store folder.
- Keep student-facing flows easy on mobile first.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **student-frontend** (7393 symbols, 10305 relationships, 148 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/student-frontend/context` | Codebase overview, check index freshness |
| `gitnexus://repo/student-frontend/clusters` | All functional areas |
| `gitnexus://repo/student-frontend/processes` | All execution flows |
| `gitnexus://repo/student-frontend/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
