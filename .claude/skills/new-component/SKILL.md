---
name: new-component
description: Creates a reusable React component with TypeScript props, tests, and documentation. Use for UI or game-specific components.
argument-hint: "<component-name> - e.g. StatBar or GearSlot"
---

# New Component Skill

You are creating a reusable React component for the Chains of Glory frontend. Follow every step.

## Input

The user provides the component name, e.g. `StatBar` or `GearSlot`.

## Steps

### 1. Determine component category

- `src/components/ui/` — Base UI (buttons, cards, modals, progress bars, badges)
- `src/components/game/` — Game-specific (stat display, gear slots, combat UI, rarity badge)

### 2. Create the component

- Define a TypeScript interface for props
- Use Tailwind CSS for styling
- Keep it focused — one responsibility per component
- Follow the template in `templates/component.md`

### 3. Create tests

**Mandatory.** Create test file alongside or in `src/__tests__/components/`.

Cover:
- **Renders with required props** — basic render test
- **Renders variations** — different prop values produce correct output
- **User interactions** — clicks, hovers trigger callbacks
- **Edge cases** — empty data, zero values, max values

### 4. Create documentation

**Mandatory.** Add to `docs/components/{name}.md`:
- Description, props table, usage examples, visual variants

### 5. Verify

- Run `npm test` to confirm all tests pass

## Rules

- All output in **English**
- TypeScript interfaces for all props
- No inline styles — Tailwind only
- Components must be self-contained and reusable
