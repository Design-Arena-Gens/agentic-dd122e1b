# Dealer Onboarding Agents Command Center

Autonomous onboarding hub that coordinates AI-augmented agents to guide dealers from intake through expansion. The interface surfaces live pipeline telemetry, intervention playbooks, risk signals, and rapid intake tooling so your onboarding team can activate every partner faster.

## Local Development

```bash
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) to view the command center.
- The home route (`src/app/page.tsx`) contains all page logic and data scaffolding for the onboarding agents.

## Key Features

- Dealer pipeline telemetry by lifecycle stage
- Agent roster with focus areas, live sentiment, and confidence scoring
- Orchestration board of tasks, due dates, and mitigation notes
- Playbooks to trigger pre-defined activation automations
- Guided intake form that queues a new dealer and alerts the assigned agent
- Risk radar summarizing blockers that need attention

## Production Build

```bash
npm run lint
npm run build
npm run start
```
