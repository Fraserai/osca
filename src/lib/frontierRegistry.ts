import type { AiCapability, TaskImpactMode } from '@/types/role';

export type CapabilityDefinition = {
  label: string;
  shortLabel: string;
  coverage: string;
  scoreLift: number;
  toolsByImpact: Partial<Record<TaskImpactMode, string[]>>;
  referenceTools: string[];
};

export const FRONTIER_STACK_VERSION = '2026-03-24';
export const FRONTIER_STACK_LABEL = '24 March 2026 AI tool and model stack';

const CAPABILITY_ORDER: AiCapability[] = [
  'text_generation',
  'data_analysis',
  'code_software',
  'image_design',
  'voice_communication',
  'reasoning_strategy',
  'physical',
  'interpersonal',
  'sensory'
];

export const CAPABILITY_DEFINITIONS: Record<AiCapability, CapabilityDefinition> = {
  text_generation: {
    label: 'Text Generation & Writing',
    shortLabel: 'Writing',
    coverage: 'Reports, correspondence, summaries, documentation, policy drafting, and content workflows',
    scoreLift: 3,
    toolsByImpact: {
      replace_now: ['GPT-5.4', 'GPT-5.4 Pro', 'Claude Sonnet 4.6', 'Claude Opus 4.6', 'Gemini 3.1 Pro', 'OpenAI Deep Research'],
      augment_now: ['GPT-5.4', 'Claude Sonnet 4.6', 'Claude Cowork', 'Claude Opus 4.6', 'Gemini 3.1 Pro', 'Perplexity Computer'],
      assist_only: ['Claude Cowork', 'Perplexity Computer', 'ChatGPT agent', 'Project Mariner', 'Gemini 3.1 Flash-Lite', 'OpenAI Deep Research']
    },
    referenceTools: ['GPT-5.4', 'GPT-5.4 Pro', 'Claude Sonnet 4.6', 'Claude Opus 4.6', 'Gemini 3.1 Pro', 'OpenAI Deep Research']
  },
  data_analysis: {
    label: 'Data Analysis & Research',
    shortLabel: 'Data',
    coverage: 'Spreadsheets, research synthesis, reconciliations, reporting, triage, and form-processing work',
    scoreLift: 5,
    toolsByImpact: {
      replace_now: ['GPT-5.4', 'GPT-5.4 Pro', 'Claude Opus 4.6', 'Gemini 3.1 Pro', 'OpenAI Deep Research', 'Perplexity Computer'],
      augment_now: ['GPT-5.4', 'Claude Sonnet 4.6', 'Claude Cowork', 'Gemini 3.1 Pro', 'OpenAI Deep Research', 'Perplexity Computer'],
      assist_only: ['Claude Cowork', 'Perplexity Computer', 'ChatGPT agent', 'Project Mariner', 'Gemini 3.1 Flash-Lite', 'OpenAI Deep Research']
    },
    referenceTools: ['GPT-5.4', 'GPT-5.4 Pro', 'Claude Opus 4.6', 'Gemini 3.1 Pro', 'OpenAI Deep Research', 'Perplexity Computer']
  },
  code_software: {
    label: 'Code & Software',
    shortLabel: 'Code',
    coverage: 'Coding, debugging, testing, refactoring, automation, deployment support, and QA',
    scoreLift: 8,
    toolsByImpact: {
      replace_now: ['Codex app', 'GPT-5.3-Codex', 'GPT-5.4', 'Claude Code', 'Claude Opus 4.6', 'Jules'],
      augment_now: ['Codex app', 'Claude Code', 'GitHub Copilot Coding Agent', 'Cursor Agents', 'Devin 2.2', 'Jules'],
      assist_only: ['GitHub Copilot CLI', 'Gemini CLI', 'Cursor Computer Use', 'Replit Agent', 'Mistral Code', 'Perplexity Computer']
    },
    referenceTools: ['Codex app', 'GPT-5.3-Codex', 'GPT-5.4', 'Claude Code', 'GitHub Copilot Coding Agent', 'Cursor Agents']
  },
  image_design: {
    label: 'Image & Design',
    shortLabel: 'Design',
    coverage: 'Layouts, variants, presentations, asset generation, and visual production tasks',
    scoreLift: 4,
    toolsByImpact: {
      replace_now: ['Nano Banana 2', 'gpt-image-1', 'Gemini 3 Flash', 'Adobe Firefly', 'Figma AI', 'Sora 2'],
      augment_now: ['Nano Banana 2', 'gpt-image-1', 'Adobe Firefly', 'Figma AI', 'ChatGPT Images', 'Claude Sonnet 4.6'],
      assist_only: ['Nano Banana 2', 'gpt-image-1', 'Gemini 3 Flash', 'Figma AI', 'ChatGPT Images', 'Sora 2']
    },
    referenceTools: ['Nano Banana 2', 'gpt-image-1', 'Gemini 3 Flash', 'Adobe Firefly', 'Figma AI', 'Sora 2']
  },
  voice_communication: {
    label: 'Voice & Communication',
    shortLabel: 'Voice',
    coverage: 'Calls, scripted support, intake, scheduling, transcription, switchboards, and follow-up',
    scoreLift: 7,
    toolsByImpact: {
      replace_now: ['11.ai', 'ElevenLabs Agents', 'ElevenLabs Conversational AI', 'Gemini 2.5 Flash Native Audio', 'Claude Cowork', 'OpenAI Realtime'],
      augment_now: ['11.ai', 'ElevenLabs Agents', 'Claude Cowork', 'Gemini 2.5 Flash Native Audio', 'ChatGPT agent', 'Project Mariner'],
      assist_only: ['ElevenLabs Agents', '11.ai', 'Claude Cowork', 'Gemini 2.5 Flash Native Audio', 'OpenAI Realtime', 'ChatGPT agent']
    },
    referenceTools: ['11.ai', 'ElevenLabs Agents', 'ElevenLabs Conversational AI', 'Gemini 2.5 Flash Native Audio', 'Claude Cowork', 'OpenAI Realtime']
  },
  reasoning_strategy: {
    label: 'Reasoning & Strategy',
    shortLabel: 'Reasoning',
    coverage: 'Planning, policy analysis, compliance review, investigations, and complex decisions',
    scoreLift: 4,
    toolsByImpact: {
      replace_now: ['GPT-5.4', 'GPT-5.4 Pro', 'Claude Opus 4.6', 'Gemini 3.1 Pro', 'OpenAI Deep Research', 'Perplexity Computer'],
      augment_now: ['GPT-5.4', 'Claude Sonnet 4.6', 'Claude Cowork', 'Gemini 3.1 Pro', 'OpenAI Deep Research', 'ChatGPT agent'],
      assist_only: ['Perplexity Computer', 'ChatGPT agent', 'Project Mariner', 'Claude Cowork', 'Gemini 3.1 Flash-Lite', 'Manus Agent Skills']
    },
    referenceTools: ['GPT-5.4', 'GPT-5.4 Pro', 'Claude Opus 4.6', 'Gemini 3.1 Pro', 'OpenAI Deep Research', 'Perplexity Computer']
  },
  physical: {
    label: 'Physical & Hands-On',
    shortLabel: 'Physical',
    coverage: 'Construction, fieldwork, driving, surgery, manual handling, and embodied execution',
    scoreLift: 0,
    toolsByImpact: {
      assist_only: ['OpenAI Operator', 'Project Mariner', 'Manus Agent Skills', 'OpenClaw', 'Gemini 3.1 Pro', 'Claude Opus 4.6']
    },
    referenceTools: ['OpenAI Operator', 'Project Mariner', 'Manus Agent Skills', 'OpenClaw', 'Gemini 3.1 Pro', 'Claude Opus 4.6']
  },
  interpersonal: {
    label: 'Interpersonal & Emotional',
    shortLabel: 'Interpersonal',
    coverage: 'Leadership, care, negotiation, teaching, emotionally sensitive service, and trust-heavy work',
    scoreLift: 1,
    toolsByImpact: {
      augment_now: ['Claude Cowork', 'Claude Opus 4.6', 'GPT-5.4', 'Gemini 3.1 Pro', '11.ai', 'ChatGPT agent'],
      assist_only: ['Claude Cowork', '11.ai', 'ElevenLabs Agents', 'GPT-5.4', 'Gemini 3.1 Pro', 'Perplexity Computer']
    },
    referenceTools: ['Claude Cowork', 'Claude Opus 4.6', 'GPT-5.4', 'Gemini 3.1 Pro', '11.ai', 'ElevenLabs Agents']
  },
  sensory: {
    label: 'Sensory & Environmental',
    shortLabel: 'Sensory',
    coverage: 'Live inspection, scene reading, environmental judgment, field monitoring, and dynamic sensing',
    scoreLift: 1,
    toolsByImpact: {
      augment_now: ['Gemini 3.1 Pro', 'OpenAI Operator', 'Project Mariner', 'Manus Agent Skills', 'OpenClaw', 'GPT-5.4'],
      assist_only: ['Gemini 3.1 Pro', 'Project Mariner', 'OpenAI Operator', 'Manus Agent Skills', 'OpenClaw', 'Claude Opus 4.6']
    },
    referenceTools: ['Gemini 3.1 Pro', 'OpenAI Operator', 'Project Mariner', 'Manus Agent Skills', 'OpenClaw', 'GPT-5.4']
  }
};

export const METHODOLOGY_CAPABILITY_ROWS = CAPABILITY_ORDER.map((capability) => {
  const definition = CAPABILITY_DEFINITIONS[capability];

  return {
    capability,
    label: definition.label,
    coverage: definition.coverage,
    tools: definition.referenceTools.join(', ')
  };
});

export function getCapabilityDefinition(capability: AiCapability): CapabilityDefinition {
  return CAPABILITY_DEFINITIONS[capability];
}

export function getCapabilityTools(capability: AiCapability, impactMode: TaskImpactMode): string[] {
  return CAPABILITY_DEFINITIONS[capability].toolsByImpact[impactMode] ?? CAPABILITY_DEFINITIONS[capability].referenceTools;
}

export function getCapabilityScoreLift(capability: AiCapability): number {
  return CAPABILITY_DEFINITIONS[capability].scoreLift;
}
