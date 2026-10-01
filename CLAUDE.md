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

This project is indexed by GitNexus as **student-frontend** (6277 symbols, 16083 relationships, 351 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact before editing.** Use `impact({target: "symbolName", direction: "upstream"})` or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .`; report callers, processes, and risk. Never substitute grep for graph analysis.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- MUST warn on HIGH/CRITICAL `risk` pre-edit; never use `riskSharedAxes` to waive a HIGH/CRITICAL `risk` warning. Compare File/symbol: MCP File omits axes; Graph-RAG expands File.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- **MUST use `query({search_query: "concept"})` for concepts/flows, `context({name: "symbolName"})` for a named symbol, or `impact` for blast radius, on read-only callers, dependencies, imports, or execution flow.** Graph first; text search only for empty/`UNKNOWN`/literals.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/student-frontend/context` | Codebase overview, check index freshness |
| `gitnexus://repo/student-frontend/clusters` | All functional areas |
| `gitnexus://repo/student-frontend/processes` | All execution flows |
| `gitnexus://repo/student-frontend/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
