<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **student_frontend** (5635 symbols, 7532 relationships, 66 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

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
| `gitnexus://repo/student_frontend/context` | Codebase overview, check index freshness |
| `gitnexus://repo/student_frontend/clusters` | All functional areas |
| `gitnexus://repo/student_frontend/processes` | All execution flows |
| `gitnexus://repo/student_frontend/process/{name}` | Step-by-step execution trace |

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



# Local Taste Skills

This project vendors Taste Skill files under `skills/`.

For every UI, UX, visual design, redesign, animation, motion, image-to-code, or mobile screen implementation task:

1. Read `skills/llms.txt` first.
2. Choose the relevant skill.
3. Open the matching `skills/<skill-folder>/SKILL.md`.
4. Apply it together with Beacon Flutter rules in `.agents/instructions/ui-design.instructions.md` and `.agents/skills/ui-design-skill/SKILL.md`.

Default routing for this Flutter app:

- Mobile UI concepts and visual direction: `skills/imagegen-frontend-mobile/SKILL.md`.
- Existing screen redesign or polish: `skills/redesign-skill/SKILL.md`.
- UI/UX animation, motion timing, and premium interaction quality: `skills/gpt-tasteskill/SKILL.md`.
- Clean, dense product UI: `skills/minimalist-skill/SKILL.md`.
- Soft premium visual polish: `skills/soft-skill/SKILL.md`.
- Image-to-code implementation: `skills/image-to-code-skill/SKILL.md`.
- Complete, unabridged implementation output: `skills/output-skill/SKILL.md`.
- Broad landing-page or full redesign taste guidance: `skills/taste-skill/SKILL.md`.

Do not skip this local skill loading step when the task touches UI/UX/animation, even if the request is small.
