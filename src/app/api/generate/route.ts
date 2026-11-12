import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { buildStubAgentEmulation, type AgentEmulation, type AgentGenerationRequest } from '@/lib/agentStub';

export const runtime = 'nodejs';

const requestSchema = z.object({
  role: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    salary: z.number().nonnegative(),
    primaryTasks: z.array(z.string().min(1)).optional(),
    tools: z.array(z.string().min(1)).optional()
  }),
  scenario: z
    .object({
      runsPerMonth: z.number().int().nonnegative().optional()
    })
    .optional()
});

const responseSchema = z
  .object({
    tools: z.array(z.string().min(1)).min(1),
    tasks: z
      .array(
        z.object({
          name: z.string().min(1),
          time_share: z.number().positive(),
          description: z.string().min(1)
        })
      )
      .min(1),
    agent_workflow_steps: z.array(z.string().min(1)).min(1),
    workload: z.object({
      runs_per_month: z.number().int().positive()
    }),
    token_assumptions: z.object({
      input_tokens_per_run: z.number().int().positive(),
      output_tokens_per_run: z.number().int().positive()
    })
  })
  .superRefine((value, ctx) => {
    const sum = value.tasks.reduce((total, task) => total + task.time_share, 0);
    if (Math.abs(sum - 1) > 0.12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'tasks.time_share should sum to approximately 1.0'
      });
    }
  });

const AGENT_EMULATION_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['tools', 'tasks', 'agent_workflow_steps', 'workload', 'token_assumptions'],
  properties: {
    tools: {
      type: 'array',
      items: { type: 'string' }
    },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'time_share', 'description'],
        properties: {
          name: { type: 'string' },
          time_share: { type: 'number' },
          description: { type: 'string' }
        }
      }
    },
    agent_workflow_steps: {
      type: 'array',
      items: { type: 'string' }
    },
    workload: {
      type: 'object',
      additionalProperties: false,
      required: ['runs_per_month'],
      properties: {
        runs_per_month: { type: 'number' }
      }
    },
    token_assumptions: {
      type: 'object',
      additionalProperties: false,
      required: ['input_tokens_per_run', 'output_tokens_per_run'],
      properties: {
        input_tokens_per_run: { type: 'number' },
        output_tokens_per_run: { type: 'number' }
      }
    }
  }
} as const;

async function generateWithOpenAI(input: AgentGenerationRequest): Promise<AgentEmulation> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const client = new OpenAI({ apiKey });

  const instructions = [
    'You design role emulation plans for AI agents.',
    'Return STRICT JSON ONLY that exactly matches the required schema.',
    'No markdown, no commentary, no backticks.',
    'time_share values must sum to approximately 1.0.'
  ].join('\n');

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    instructions,
    input: JSON.stringify(input, null, 2),
    text: {
      format: {
        type: 'json_schema',
        name: 'agent_emulation',
        strict: true,
        schema: AGENT_EMULATION_JSON_SCHEMA as Record<string, unknown>
      }
    }
  });

  const raw = response.output_text?.trim();
  if (!raw) {
    throw new Error('OpenAI returned empty output');
  }

  return responseSchema.parse(JSON.parse(raw));
}

export async function POST(request: Request) {
  const requestBody = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(requestBody);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const fallback = buildStubAgentEmulation(parsed.data);

  try {
    const result = await generateWithOpenAI(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(fallback);
  }
}
