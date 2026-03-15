---
name: add-docs
description: Generates or updates documentation for an existing page, component, or hook. Use when code exists but lacks documentation.
argument-hint: "<target> - e.g. StorePage or StatBar"
---

# Add Documentation Skill

You are generating documentation for existing frontend code (React + Vite). Follow every step.

## Steps

1. Read the source code and any existing tests
2. Create or update a markdown file in `docs/`
3. Include:
   - **Description** — what it does and when to use it
   - **Props/Parameters** — table with name, type, required, description
   - **Usage example** — code snippet showing how to use it
   - **API endpoints used** — which backend endpoints it calls (for pages/hooks)
   - **State management** — which stores/queries it reads/writes
   - **Testing** section with:
     - Test file path
     - Command to run tests
     - Table of all tests with scenarios

## Rules

- All documentation in **English**
- Include a Testing section at the end (always)
- Link to relevant backend API docs where applicable
