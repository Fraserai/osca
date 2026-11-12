export type AgentGenerationRoleInput = {
  title: string;
  description: string;
  salary: number;
  primaryTasks?: string[];
  tools?: string[];
};

export type AgentGenerationRequest = {
  role: AgentGenerationRoleInput;
  scenario?: {
    runsPerMonth?: number;
  };
};

export type AgentEmulationTask = {
  name: string;
  time_share: number;
  description: string;
};

export type AgentEmulation = {
  tools: string[];
  tasks: AgentEmulationTask[];
  agent_workflow_steps: string[];
  workload: {
    runs_per_month: number;
  };
  token_assumptions: {
    input_tokens_per_run: number;
    output_tokens_per_run: number;
  };
};

const DEFAULT_TIME_SHARES = [0.35, 0.3, 0.2, 0.15];

export function buildStubAgentEmulation(input: AgentGenerationRequest): AgentEmulation {
  const role = input.role;
  const primaryTasks = role.primaryTasks && role.primaryTasks.length > 0
    ? role.primaryTasks
    : [
        `Triage inbound ${role.title.toLowerCase()} requests`,
        `Draft first-pass deliverables for ${role.title.toLowerCase()}`,
        'Escalate low-confidence outputs to human reviewer',
        'Track execution metrics and quality notes'
      ];

  const taskNames = primaryTasks.slice(0, 4);
  const rawShares = taskNames.map((_, index) => DEFAULT_TIME_SHARES[index] ?? 0.1);
  const rawTotal = rawShares.reduce((total, value) => total + value, 0) || 1;

  const tasks = taskNames.map((taskName, index) => ({
    name: taskName,
    time_share: Number((rawShares[index] / rawTotal).toFixed(3)),
    description: `${taskName} with documented quality checks and escalation paths.`
  }));

  const toolset = role.tools && role.tools.length > 0 ? role.tools.slice(0, 4) : ['Knowledge Base', 'Task Queue', 'Notifier'];
  const runsPerMonth = Math.max(1, Math.round(input.scenario?.runsPerMonth ?? 900));

  return {
    tools: [
      ...toolset,
      'Knowledge Base Retriever',
      'Scheduler + Notification Hooks'
    ],
    tasks,
    agent_workflow_steps: [
      'Ingest new queue item and classify intent',
      'Pull required context from docs and templates',
      'Generate draft output with tool calls',
      'Run QA checks and format for handoff',
      'Log outcome, confidence, and escalation notes'
    ],
    workload: {
      runs_per_month: runsPerMonth
    },
    token_assumptions: {
      input_tokens_per_run: 2200,
      output_tokens_per_run: 950
    }
  };
}
