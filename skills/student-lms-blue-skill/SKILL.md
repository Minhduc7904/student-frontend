---
name: student-lms-blue
description: Project-specific web design skill for the student LMS using primary blue #194DB6 and secondary yellow #FDD22C from tailwind.config.js.
---

# Student LMS Blue Design Skill

Use this skill for student-facing LMS pages, dashboards, course pages, lesson pages, homework pages, and learning workflows in this repo.

## Core Palette

Always use colors from `tailwind.config.js`.

- Primary: `blue-800` (`#194DB6`)
- Primary dark: `blue-900`, `blue-950`
- Primary soft surfaces: `blue-50`, `blue-100`, `blue-lighter`, `background`
- Secondary accent: `yellow-500` (`#FDD22C`)
- Secondary soft surfaces: `yellow-50`, `yellow-100`
- Text: `blue-950` for main text, `gray-subtle` or `gray-700` for secondary text
- Error/urgent only: `red-500`, `red-600`, `red-100`
- Success only: `green-500`, `green-100`

Avoid introducing off-system colors unless the existing component already requires them.

## Visual Direction

The UI should feel like a friendly learning cockpit, not a corporate analytics dashboard.

- Use light blue canvas backgrounds (`background`, `blue-50`) with white cards.
- Use `blue-800` for primary actions and important progress.
- Use `yellow-500` sparingly for attention, streaks, highlights, and key next actions.
- Keep the page breathable. A student should understand what to do in under 5 seconds.
- Prefer rounded `xl` to `3xl` containers for friendly learning surfaces.
- Use low, blue-tinted shadows only when elevation helps priority.

## Dashboard Rule

Student dashboard pages must answer these four questions before anything else:

1. What should I study today?
2. What is due soon?
3. How am I progressing?
4. Where do I click to continue learning?

Do not overload the dashboard with admin metrics, dense charts, or long tables. Use concise cards, short lists, progress bars, and one clear continue-learning CTA.

## Layout

- First viewport should include a clear continue-learning CTA.
- Use asymmetric grids on desktop and single-column flow on mobile.
- Recommended desktop grid: main content wider than side content, e.g. `lg:grid-cols-[1.25fr_0.75fr]`.
- Cards should collapse cleanly without horizontal scrolling.
- Use stable dimensions for action buttons, progress bars, and compact list rows.

## Components

- Primary button: `bg-blue-800 text-white`, hover `bg-blue-900`.
- Highlight button: `bg-yellow-500 text-blue-950`, hover `bg-yellow-100`.
- Card: `bg-white border border-blue-100 rounded-2xl`.
- Soft card: `bg-blue-50/70 border border-blue-100 rounded-xl`.
- Status badge: small rounded rectangle, not oversized pills.
- Progress bar track: `bg-blue-100`; fill: `bg-blue-800` or `bg-yellow-500` for the most important active progress.

## Typography

- Use the repo font scale from `tailwind.config.js`: `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-4`, `text-5`, `subhead-*`.
- Main headings should be short, concrete, and action-oriented.
- Avoid marketing language. Use plain LMS copy such as "Hoc tiep", "Sap den han", "Tien do", "Lo trinh".

## Motion

- Use existing Tailwind animations `animate-slide-up` and `animate-bounce-in` only when they clarify hierarchy.
- Keep motion quiet: hover border shifts, subtle scale on active, small arrow movement.
- Animate transform and opacity, not layout properties.

## Content Rules

- No fake corporate jargon.
- No huge statistics wall.
- No decorative-only hero section on product screens.
- No new API calls when the user asks for a visual mock first.
- Mock data should be realistic and easy to replace with API fields later.
