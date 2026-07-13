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
