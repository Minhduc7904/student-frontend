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

# Project Context

This is a student-facing LMS web app built with:

- React 19
- Vite 7
- Tailwind CSS 4
- Redux Toolkit
- React Router 7
- Axios
- lucide-react

This is **not** a Flutter app and does not use Beacon Flutter rules.

Primary product areas include student auth, dashboard, online courses, course lessons, homework, file homework submission, practice, exams, competitions, profile, tuition payment, notifications, and chat/help surfaces.

# Local Taste Skills

This project vendors Taste Skill files under `skills/`.

For every UI, UX, visual design, redesign, animation, motion, image-to-code, or mobile screen implementation task:

1. Read `skills/llms.txt` first.
2. Choose the relevant skill.
3. Open the matching `skills/<skill-folder>/SKILL.md`.
4. Prefer the project-specific `skills/student-lms-blue-skill/SKILL.md` for student dashboard, course, lesson, homework, practice, exam, competition, payment, and learning workflows.
5. Follow existing Tailwind 4 tokens from `tailwind.config.js`; do not introduce a second design system.

Default routing for this React Student LMS:

- Student LMS pages and learning workflows: `skills/student-lms-blue-skill/SKILL.md`.
- Existing screen redesign or polish: `skills/redesign-skill/SKILL.md`.
- UI/UX animation, motion timing, and premium interaction quality: `skills/gpt-tasteskill/SKILL.md`.
- Clean, dense product UI: `skills/minimalist-skill/SKILL.md`.
- Soft premium visual polish: `skills/soft-skill/SKILL.md`.
- Image-to-code implementation: `skills/image-to-code-skill/SKILL.md`.
- Complete, unabridged implementation output: `skills/output-skill/SKILL.md`.
- Broad landing-page or full redesign taste guidance: `skills/taste-skill/SKILL.md`.

Do not skip this local skill loading step when the task touches UI/UX/animation, even if the request is small.

# Engineering Notes

- Use `rg` or `rg --files` first for local search.
- Use `apply_patch` for manual edits.
- Keep React components split by responsibility; avoid putting service calls, large UI surfaces, and utility logic into one file when a feature grows.
- Prefer existing services under `src/core/services/modules`.
- Prefer endpoint constants under `src/core/constants/apiEndpoints.js`.
- Prefer route constants under `src/core/constants/routes.js`.
- Prefer Redux slices under the relevant feature folder.
- Keep user-facing student UI mobile-friendly by default, especially for course lessons, homework submission, practice, exams, competitions, and payment flows.
- Match existing app conventions before adding abstractions or new dependencies.
