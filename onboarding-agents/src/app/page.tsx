"use client";

import { useMemo, useState } from "react";
import {
  ArrowTrendingUpIcon,
  ArrowUpRightIcon,
  BoltIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

type DealerStage = "Intake" | "Compliance" | "Training" | "Activation" | "Expansion";

type Dealer = {
  id: string;
  name: string;
  territory: string;
  stage: DealerStage;
  assignedAgent: string;
  health: "On Track" | "At Risk" | "Behind";
  kickoffDate: string;
  goLiveTarget: string;
};

type Agent = {
  id: string;
  name: string;
  role: string;
  focus: string;
  activeDeals: number;
  sentiment: "Positive" | "Neutral" | "Attention";
  confidence: number;
  status: "Available" | "In Onboarding" | "Offline";
};

type Playbook = {
  name: string;
  trigger: string;
  outcome: string;
  owner: string;
};

type Task = {
  id: string;
  dealer: string;
  owner: string;
  milestone: string;
  due: string;
  status: "Ready" | "In Progress" | "Blocked" | "Complete";
  notes: string;
};

const dealerStages: DealerStage[] = ["Intake", "Compliance", "Training", "Activation", "Expansion"];

const dealers: Dealer[] = [
  {
    id: "D-1045",
    name: "Northbridge Motors",
    territory: "Pacific Northwest",
    stage: "Training",
    assignedAgent: "Jordan Lee",
    health: "On Track",
    kickoffDate: "2024-05-12",
    goLiveTarget: "2024-06-05",
  },
  {
    id: "D-1038",
    name: "Velocity Auto",
    territory: "Midwest",
    stage: "Compliance",
    assignedAgent: "Priya Desai",
    health: "At Risk",
    kickoffDate: "2024-04-28",
    goLiveTarget: "2024-06-01",
  },
  {
    id: "D-1022",
    name: "Sunline Dealers",
    territory: "Southwest",
    stage: "Activation",
    assignedAgent: "Jordan Lee",
    health: "On Track",
    kickoffDate: "2024-04-03",
    goLiveTarget: "2024-05-29",
  },
  {
    id: "D-1017",
    name: "Urban Fleet Co",
    territory: "Northeast",
    stage: "Expansion",
    assignedAgent: "Emilia Alvarez",
    health: "Behind",
    kickoffDate: "2024-03-18",
    goLiveTarget: "2024-05-10",
  },
  {
    id: "D-1009",
    name: "Prime Transit",
    territory: "Southeast",
    stage: "Intake",
    assignedAgent: "Mason Chen",
    health: "On Track",
    kickoffDate: "2024-05-20",
    goLiveTarget: "2024-06-15",
  },
];

const agents: Agent[] = [
  {
    id: "A-42",
    name: "Jordan Lee",
    role: "Principal Onboarding Lead",
    focus: "Digital rollout & activation",
    activeDeals: 4,
    sentiment: "Positive",
    confidence: 92,
    status: "In Onboarding",
  },
  {
    id: "A-36",
    name: "Priya Desai",
    role: "Compliance Orchestrator",
    focus: "Document readiness & risk controls",
    activeDeals: 3,
    sentiment: "Attention",
    confidence: 74,
    status: "In Onboarding",
  },
  {
    id: "A-28",
    name: "Emilia Alvarez",
    role: "Expansion Strategist",
    focus: "Multi-location enablement",
    activeDeals: 2,
    sentiment: "Neutral",
    confidence: 81,
    status: "Available",
  },
  {
    id: "A-17",
    name: "Mason Chen",
    role: "Partner Program Manager",
    focus: "Playbook adherence & training",
    activeDeals: 1,
    sentiment: "Positive",
    confidence: 87,
    status: "Available",
  },
];

const playbooks: Playbook[] = [
  {
    name: "90-Minute Dealer Activation",
    trigger: "Dealer completes compliance review",
    outcome: "Dealer-enabled sandbox within 24h",
    owner: "Jordan Lee",
  },
  {
    name: "Risk Mitigation Sprint",
    trigger: "Compliance checklist shows gaps",
    outcome: "Document pack remediated < 48h",
    owner: "Priya Desai",
  },
  {
    name: "Launch Readiness Workshop",
    trigger: "Training completion below 80%",
    outcome: "Dealer team certified to operate",
    owner: "Mason Chen",
  },
  {
    name: "Expansion Catalyst",
    trigger: "Dealer adds second location",
    outcome: "Expansion kit deployed + adoption",
    owner: "Emilia Alvarez",
  },
];

const tasks: Task[] = [
  {
    id: "T-209",
    dealer: "Velocity Auto",
    owner: "Priya Desai",
    milestone: "Compliance",
    due: "2024-05-24",
    status: "Blocked",
    notes: "Awaiting insurance certification from dealer legal team.",
  },
  {
    id: "T-205",
    dealer: "Northbridge Motors",
    owner: "Jordan Lee",
    milestone: "Training",
    due: "2024-05-21",
    status: "In Progress",
    notes: "AI-driven curriculum rollout, LMS adoption at 63%.",
  },
  {
    id: "T-198",
    dealer: "Sunline Dealers",
    owner: "Jordan Lee",
    milestone: "Activation",
    due: "2024-05-18",
    status: "Ready",
    notes: "Sandbox to production migration play scheduled.",
  },
  {
    id: "T-194",
    dealer: "Urban Fleet Co",
    owner: "Emilia Alvarez",
    milestone: "Expansion",
    due: "2024-05-22",
    status: "In Progress",
    notes: "Multi-site telemetry integration in staging.",
  },
  {
    id: "T-188",
    dealer: "Prime Transit",
    owner: "Mason Chen",
    milestone: "Intake",
    due: "2024-05-25",
    status: "Ready",
    notes: "Kickoff narrative drafted, waiting for exec alignment.",
  },
];

const sentimentColors: Record<Agent["sentiment"], string> = {
  Positive: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Neutral: "bg-slate-100 text-slate-600 border-slate-200",
  Attention: "bg-amber-100 text-amber-700 border-amber-200",
};

const taskStatusColors: Record<Task["status"], string> = {
  Ready: "bg-sky-100 text-sky-700 border-sky-200",
  "In Progress": "bg-indigo-100 text-indigo-700 border-indigo-200",
  Blocked: "bg-rose-100 text-rose-700 border-rose-200",
  Complete: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function Home() {
  const [newDealer, setNewDealer] = useState({
    name: "",
    territory: "",
    kickoffDate: "",
    goLiveTarget: "",
    agent: agents[0].name,
  });

  const pipelineStats = useMemo(() => {
    const totals: Record<DealerStage, number> = {
      Intake: 0,
      Compliance: 0,
      Training: 0,
      Activation: 0,
      Expansion: 0,
    };
    dealers.forEach((dealer) => {
      totals[dealer.stage] += 1;
    });
    const overallVelocity = Math.round(
      (dealers.filter(
        (dealer) => dealer.stage === "Activation" || dealer.stage === "Expansion",
      ).length /
        dealers.length) *
        100,
    );
    return { totals, overallVelocity };
  }, []);

  const healthSummary = useMemo(() => {
    return dealers.reduce(
      (acc, dealer) => {
        acc[dealer.health] += 1;
        return acc;
      },
      { "On Track": 0, "At Risk": 0, Behind: 0 },
    );
  }, []);

  const upcomingTasks = useMemo(() => tasks.slice(0, 3), []);

  const handleDealerField = (field: string, value: string) => {
    setNewDealer((current) => ({ ...current, [field]: value }));
  };

  const handleAddDealer = () => {
    setNewDealer({
      name: "",
      territory: "",
      kickoffDate: "",
      goLiveTarget: "",
      agent: agents[0].name,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:px-10">
        <header className="flex flex-col justify-between gap-10 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-10 shadow-2xl shadow-slate-950/40 lg:flex-row lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-slate-200">
              <BoltIcon className="h-4 w-4 text-emerald-300" />
              Dealer Onboarding Command Center
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Agentic Onboarding Team for Dealer Success
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300">
              Coordinate AI-augmented onboarding agents, manage dealer readiness, and run playbooks that get every
              partner to launch faster. Operate from kickoff to expansion with live health signals, automations, and
              action plans.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Team Launch Velocity</span>
              <ArrowUpRightIcon className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-semibold text-white">{pipelineStats.overallVelocity}%</p>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                converted
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Percentage of dealers currently in activation or expansion. Goal: maintain above 60% each month.
            </p>
          </div>
        </header>

        <section className="mt-14 grid gap-8 lg:grid-cols-4">
          {dealerStages.map((stage) => (
            <div
              key={stage}
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">{stage}</span>
                <ArrowTrendingUpIcon className="h-5 w-5 text-slate-400" />
              </div>
              <p className="mt-4 text-4xl font-semibold text-white">{pipelineStats.totals[stage]}</p>
              <div className="mt-6">
                <div className="h-1.5 w-full rounded-full bg-slate-800">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400"
                    style={{ width: `${Math.max(20, pipelineStats.totals[stage] * 17)}%` }}
                  />
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                {pipelineStats.totals[stage]} dealers currently orchestrated in the {stage.toLowerCase()} phase.
              </p>
            </div>
          ))}
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[2fr,3fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Onboarding Agents</h2>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-300">
                {agents.length} active
              </span>
            </div>
            <div className="mt-6 space-y-5">
              {agents.map((agent) => (
                <div key={agent.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-4">
                      <UserCircleIcon className="h-10 w-10 text-indigo-300" />
                      <div>
                        <p className="text-base font-semibold text-white">{agent.name}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-400">{agent.role}</p>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-wrap gap-3">
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                        {agent.activeDeals} deals
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${sentimentColors[agent.sentiment]}`}
                      >
                        {agent.sentiment}
                      </span>
                      <span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                        {agent.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-400">Focus:</span> {agent.focus}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">Confidence:</span>
                      <div className="h-2 w-full rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                          style={{ width: `${agent.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-200">{agent.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Dealer Portfolio Signals</h2>
              <span className="text-xs text-slate-400">Live telemetry across all cohorts</span>
            </div>
            <div className="mt-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {Object.entries(healthSummary).map(([status, count]) => (
                  <div key={status} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{status}</span>
                      <CheckCircleIcon className="h-4 w-4 text-emerald-300" />
                    </div>
                    <p className="mt-2 text-4xl font-semibold text-white">{count}</p>
                    <p className="mt-2 text-xs text-slate-500">Dealers marked {status.toLowerCase()} this week.</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Upcoming Interventions</h3>
                  <ClockIcon className="h-5 w-5 text-slate-400" />
                </div>
                <div className="mt-5 space-y-4">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{task.dealer}</p>
                        <p className="text-xs text-slate-400">
                          {task.milestone} milestone · due {formatDate(task.due)}
                        </p>
                        <p className="mt-2 text-xs text-slate-300">{task.notes}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-slate-400">Owner: {task.owner}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${taskStatusColors[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[3fr,2fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Orchestration Board</h2>
                <span className="text-xs text-slate-400">Automations & interventions</span>
              </div>
              <table className="mt-6 w-full table-auto text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <tr className="border-b border-slate-800 text-slate-300">
                    <th className="pb-3">Dealer</th>
                    <th className="pb-3">Owner</th>
                    <th className="pb-3">Milestone</th>
                    <th className="pb-3">Due</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tasks.map((task) => (
                    <tr key={task.id} className="text-slate-200">
                      <td className="py-4">
                        <div className="font-medium text-white">{task.dealer}</div>
                        <div className="text-xs text-slate-400">{task.notes}</div>
                      </td>
                      <td className="py-4 text-slate-300">{task.owner}</td>
                      <td className="py-4">{task.milestone}</td>
                      <td className="py-4 text-slate-400">{formatDate(task.due)}</td>
                      <td className="py-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${taskStatusColors[task.status]}`}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Playbooks & Automations</h2>
                <DocumentTextIcon className="h-5 w-5 text-slate-400" />
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {playbooks.map((playbook) => (
                  <div key={playbook.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">{playbook.name}</h3>
                      <span className="text-xs text-slate-500">Owner: {playbook.owner}</span>
                    </div>
                    <div className="mt-4 space-y-3 text-xs text-slate-300">
                      <p>
                        <span className="font-semibold text-slate-200">Trigger:</span> {playbook.trigger}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-200">Outcome:</span> {playbook.outcome}
                      </p>
                    </div>
                    <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-200">
                      <PlayIcon className="h-4 w-4" />
                      Launch Intervention
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Add Dealer to Pipeline</h2>
                <span className="text-xs text-slate-400">Intake automation</span>
              </div>
              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <label className="text-xs uppercase tracking-wide text-slate-400">Dealer Name</label>
                  <input
                    value={newDealer.name}
                    onChange={(event) => handleDealerField("name", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-slate-100 outline-none ring-offset-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2"
                    placeholder="Acme Auto Group"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-slate-400">Territory</label>
                  <input
                    value={newDealer.territory}
                    onChange={(event) => handleDealerField("territory", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-slate-100 outline-none ring-offset-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2"
                    placeholder="Mountain West"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-wide text-slate-400">Kickoff Date</label>
                    <input
                      type="date"
                      value={newDealer.kickoffDate}
                      onChange={(event) => handleDealerField("kickoffDate", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-slate-100 outline-none ring-offset-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-slate-400">Go-Live Target</label>
                    <input
                      type="date"
                      value={newDealer.goLiveTarget}
                      onChange={(event) => handleDealerField("goLiveTarget", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-slate-100 outline-none ring-offset-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-slate-400">Assign Agent</label>
                  <select
                    value={newDealer.agent}
                    onChange={(event) => handleDealerField("agent", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-slate-100 outline-none ring-offset-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2"
                  >
                    {agents.map((agent) => (
                      <option key={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddDealer}
                  className="w-full rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                >
                  Queue Intake & Notify Agent
                </button>
                <p className="text-xs text-slate-500">
                  Submission triggers CRM sync, kickoff narrative, and compliance checklist generation for the assigned
                  agent within 15 minutes.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Risk Radar</h2>
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-300" />
              </div>
              <div className="mt-6 space-y-5 text-sm text-slate-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Velocity Auto</p>
                  <p className="mt-2 font-semibold text-white">Insurance certificate pending</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Mitigation: Legal lead engaged, templated reminder sequence launched, escalation scheduled in 2 days.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Urban Fleet Co</p>
                  <p className="mt-2 font-semibold text-white">Multi-site telemetry gap</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Mitigation: Expansion playbook deployed, coordinating integration pod to validate data feed
                    stability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
