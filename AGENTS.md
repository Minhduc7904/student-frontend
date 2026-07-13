<!-- gitnexus:start -->
# GitNexus - Code Intelligence

This project is indexed by GitNexus as **student-frontend** at `C:\Users\Admin\Desktop\Job\student_frontend`.

Current indexed snapshot, as of July 13, 2026:

- 442 files
- 7046 nodes
- 9801 edges
- 226 communities
- 130 execution flows

Use the GitNexus MCP tools to understand code, assess impact, and navigate safely. When multiple repos are indexed, always pass `repo: "student-frontend"` to GitNexus tools.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any function, class, method, exported constant, Redux slice, route config, service module, or shared component.** Before modifying it, run `gitnexus_impact({ repo: "student-frontend", target: "symbolName", direction: "upstream" })` and report the blast radius: direct callers, affected processes, and risk level.
- **MUST run `gitnexus_detect_changes({ repo: "student-frontend", scope: "all" })` before committing** to verify changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({ repo: "student-frontend", query: "concept" })` to find execution flows instead of relying only on text search.
- When you need full context on a symbol, use `gitnexus_context({ repo: "student-frontend", name: "symbolName" })`.

## Never Do

- NEVER edit a function, class, method, exported constant, Redux slice, route config, service module, or shared component without first running GitNexus impact analysis.
- NEVER ignore HIGH or CRITICAL impact warnings.
- NEVER rename symbols with broad find-and-replace. Use GitNexus-aware rename tooling when available, or perform a scoped refactor with impact checks.
- NEVER commit changes without running `gitnexus_detect_changes({ repo: "student-frontend", scope: "all" })`.

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
| Understand architecture / "How does X work?" | `.agents/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.agents/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.agents/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.agents/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.agents/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.agents/skills/gitnexus/gitnexus-cli/SKILL.md` |

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
