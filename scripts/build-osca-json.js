/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs/promises');
const path = require('node:path');
const xlsx = require('xlsx');

const ROOT = process.cwd();
const STRUCTURE_FILE = path.join(ROOT, 'data', 'raw', 'OSCA structure (1).xlsx');
const DESCRIPTIONS_FILE = path.join(ROOT, 'data', 'raw', 'OSCA Category Descriptions.xlsx');
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'oscaRoles.json');

const SIX_DIGIT_CODE = /^\d{6}$/;

const DOMAIN_PROFILES = [
  {
    id: 'finance',
    keywords: ['finance', 'account', 'accounting', 'audit', 'auditor', 'tax', 'treasury', 'payroll', 'bookkeep', 'controller', 'bank', 'credit', 'loan', 'underwriter', 'broker'],
    baseSalary: 102000,
    focus: 'financial control',
    workItems: 'financial records, approvals, and exception queues',
    apps: ['NetSuite', 'Xero', 'Bill.com', 'Excel'],
    connectors: ['ERP', 'Email', 'Docs', 'Analytics']
  },
  {
    id: 'people',
    keywords: ['human resources', 'recruit', 'recruiter', 'talent', 'people', 'workforce', 'training', 'learning', 'personnel', 'employment'],
    baseSalary: 93000,
    focus: 'people operations',
    workItems: 'employee records, hiring workflows, and policy requests',
    apps: ['Workday', 'Greenhouse', 'LinkedIn Recruiter', 'Slack'],
    connectors: ['HRIS', 'Scheduling', 'Docs', 'Messaging']
  },
  {
    id: 'legal',
    keywords: ['legal', 'compliance', 'policy', 'regulatory', 'contract', 'court', 'claims', 'risk', 'insurance', 'governance', 'customs', 'immigration'],
    baseSalary: 114000,
    focus: 'legal and compliance',
    workItems: 'cases, contracts, policy reviews, and approval requests',
    apps: ['Ironclad', 'DocuSign', 'Relativity', 'Microsoft Outlook'],
    connectors: ['Case Management', 'eSignature', 'Docs', 'Email']
  },
  {
    id: 'healthcare',
    keywords: ['health', 'medical', 'clinical', 'dental', 'nurse', 'patient', 'therapy', 'therapist', 'pharmacy', 'hygienist', 'midwife', 'care'],
    baseSalary: 98000,
    focus: 'care delivery',
    workItems: 'patient records, treatment workflows, and follow-up actions',
    apps: ['Best Practice', 'Cliniko', 'HotDoc', 'Microsoft Teams'],
    connectors: ['Clinical Records', 'Scheduling', 'Messaging', 'Docs']
  },
  {
    id: 'education',
    keywords: ['teacher', 'lecturer', 'tutor', 'school', 'education', 'curriculum', 'student', 'trainer'],
    baseSalary: 87000,
    focus: 'learning delivery',
    workItems: 'lesson plans, assessment workflows, and student updates',
    apps: ['Canvas', 'Google Classroom', 'Zoom', 'Google Docs'],
    connectors: ['Docs', 'Calendar', 'Messaging', 'File Storage']
  },
  {
    id: 'technology',
    keywords: ['software', 'developer', 'programmer', 'engineer', 'systems', 'network', 'cyber', 'security', 'cloud', 'database', 'web', 'technical', 'telecommunications', 'devops'],
    baseSalary: 121000,
    focus: 'technical operations',
    workItems: 'systems, incidents, change requests, and technical handoffs',
    apps: ['Jira Service Management', 'Datadog', 'Confluence', 'Slack'],
    connectors: ['Ticketing', 'Monitoring', 'Knowledge Base', 'Messaging']
  },
  {
    id: 'research',
    keywords: ['scientist', 'research', 'biotechnologist', 'laboratory', 'chemist', 'geologist', 'physicist'],
    baseSalary: 109000,
    focus: 'research execution',
    workItems: 'experiments, samples, findings, and reporting cycles',
    apps: ['Benchling', 'LabArchives', 'GraphPad Prism', 'Excel'],
    connectors: ['Analytics', 'Docs', 'File Storage', 'Knowledge Base']
  },
  {
    id: 'service',
    keywords: ['customer service', 'customer support', 'service desk', 'helpdesk', 'help desk', 'call centre', 'contact centre', 'reception'],
    baseSalary: 76000,
    focus: 'customer service',
    workItems: 'customer requests, tickets, and escalation handoffs',
    apps: ['Zendesk', 'Intercom', 'Notion', 'Slack'],
    connectors: ['Ticketing', 'Knowledge Base', 'Messaging', 'Email']
  },
  {
    id: 'marketing',
    keywords: ['marketing', 'brand', 'communications', 'media', 'public relations', 'advertising', 'content', 'seo', 'campaign', 'broadcast'],
    baseSalary: 97000,
    focus: 'marketing operations',
    workItems: 'campaigns, assets, briefs, and performance updates',
    apps: ['HubSpot', 'GA4', 'Webflow', 'Figma'],
    connectors: ['CMS', 'Analytics', 'Docs', 'Messaging']
  },
  {
    id: 'sales',
    keywords: ['sales', 'account manager', 'business development', 'customer success', 'merchandis', 'retail', 'relationship'],
    baseSalary: 96000,
    focus: 'revenue operations',
    workItems: 'pipeline updates, customer follow-ups, and quote requests',
    apps: ['Salesforce', 'HubSpot', 'Gong', 'Zoom'],
    connectors: ['CRM', 'Email', 'Calendar', 'Docs']
  },
  {
    id: 'community',
    keywords: ['welfare', 'social', 'community', 'youth', 'family', 'counsellor', 'liaison', 'assessor'],
    baseSalary: 84000,
    focus: 'community service',
    workItems: 'cases, referrals, assessments, and support plans',
    apps: ['Salesforce', 'Notion', 'Deputy', 'Microsoft Teams'],
    connectors: ['Case Management', 'Scheduling', 'Docs', 'Messaging']
  },
  {
    id: 'transport',
    keywords: ['transport', 'rail', 'railway', 'driver', 'courier', 'shunter', 'dispatch', 'pilot', 'marine', 'logistics'],
    baseSalary: 79000,
    focus: 'transport operations',
    workItems: 'routes, manifests, dispatches, and handoff records',
    apps: ['Samsara', 'Onfleet', 'Microsoft Teams', 'Excel'],
    connectors: ['Scheduling', 'Monitoring', 'Messaging', 'Docs']
  },
  {
    id: 'construction',
    keywords: ['construction', 'builder', 'carpenter', 'plumber', 'electrician', 'welder', 'fitter', 'mechanic', 'civil', 'mining', 'driller', 'fabrication'],
    baseSalary: 86000,
    focus: 'field delivery',
    workItems: 'job tickets, inspections, maintenance tasks, and safety checks',
    apps: ['Procore', 'Fieldwire', 'SafetyCulture', 'Microsoft Teams'],
    connectors: ['Scheduling', 'Docs', 'Messaging', 'File Storage']
  },
  {
    id: 'hospitality',
    keywords: ['hotel', 'motel', 'hospitality', 'tourism', 'travel', 'restaurant', 'waiter', 'chef', 'cook', 'barista', 'housekeeper', 'concierge'],
    baseSalary: 68000,
    focus: 'guest service',
    workItems: 'bookings, service requests, shift handoffs, and issue logs',
    apps: ['Opera PMS', 'Lightspeed', 'Deputy', 'Microsoft Teams'],
    connectors: ['Scheduling', 'Messaging', 'Calendar', 'Docs']
  },
  {
    id: 'creative',
    keywords: ['artist', 'sculptor', 'designer', 'writer', 'musician', 'performer', 'photographer'],
    baseSalary: 78000,
    focus: 'creative production',
    workItems: 'briefs, assets, review notes, and delivery timelines',
    apps: ['Adobe Creative Cloud', 'Figma', 'Frame.io', 'Notion'],
    connectors: ['CMS', 'File Storage', 'Docs', 'Messaging']
  },
  {
    id: 'agriculture',
    keywords: ['grower', 'farmer', 'horticultur', 'agricultur', 'forestry', 'livestock', 'crop'],
    baseSalary: 64000,
    focus: 'agricultural operations',
    workItems: 'field tasks, stock records, maintenance logs, and production updates',
    apps: ['Agworld', 'SafetyCulture', 'Xero', 'Microsoft Teams'],
    connectors: ['Monitoring', 'Scheduling', 'File Storage', 'Messaging']
  },
  {
    id: 'operations',
    keywords: ['operations', 'administrator', 'admin', 'office', 'project', 'program', 'coordinator', 'planner', 'procurement', 'supply', 'corporate services', 'clerk', 'registry', 'record', 'records', 'filing', 'document'],
    baseSalary: 88000,
    focus: 'business operations',
    workItems: 'queues, schedules, requests, and cross-team handoffs',
    apps: ['Notion', 'Asana', 'Excel', 'Slack'],
    connectors: ['Docs', 'Calendar', 'Messaging', 'File Storage']
  }
];

const DEFAULT_DOMAIN_PROFILE = {
  id: 'general',
  keywords: [],
  baseSalary: 82000,
  focus: 'service delivery',
  workItems: 'requests, records, and follow-up actions',
  apps: ['Microsoft 365', 'Notion', 'Slack', 'Google Drive'],
  connectors: ['Email', 'Calendar', 'Docs', 'File Storage']
};

const ROLE_SHAPE_SALARY_ADJUSTMENTS = {
  executive: 52000,
  manager: 24000,
  analyst: 12000,
  technical: 14000,
  practitioner: 8000,
  support: -8000,
  frontline: -18000,
  advisor: 5000
};

const ROLE_SHAPE_APP_EXTRAS = {
  executive: ['Notion', 'Looker'],
  manager: ['Asana', 'Tableau'],
  analyst: ['Looker', 'Power BI'],
  technical: ['GitHub', 'Postman'],
  practitioner: ['Zoom', 'Notion'],
  support: ['Microsoft Outlook', 'Google Calendar'],
  frontline: ['SafetyCulture', 'Deputy'],
  advisor: ['Notion', 'Zoom']
};

const ROLE_SHAPE_CONNECTOR_EXTRAS = {
  executive: ['Analytics', 'Docs'],
  manager: ['Messaging', 'Scheduling'],
  analyst: ['Analytics', 'File Storage'],
  technical: ['Monitoring', 'Knowledge Base'],
  practitioner: ['Scheduling', 'Knowledge Base'],
  support: ['Email', 'Calendar'],
  frontline: ['Scheduling', 'Monitoring'],
  advisor: ['Docs', 'Calendar']
};

function normaliseText(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const raw = String(value).trim();
  return raw.replace(/\s+/g, ' ');
}

function toSixDigitCode(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const asInt = Math.trunc(value);
    const asString = String(asInt);
    return SIX_DIGIT_CODE.test(asString) ? asString : null;
  }

  const asString = normaliseText(value);
  if (SIX_DIGIT_CODE.test(asString)) {
    return asString;
  }

  const decimalMatch = asString.match(/^(\d+)\.0+$/);
  if (decimalMatch && SIX_DIGIT_CODE.test(decimalMatch[1])) {
    return decimalMatch[1];
  }

  return null;
}

function getRows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Missing sheet "${sheetName}" in workbook`);
  }

  return xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    blankrows: false,
    defval: ''
  });
}

function findHeaderRow(rows, requiredHeaders) {
  for (let i = 0; i < Math.min(rows.length, 40); i += 1) {
    const row = rows[i].map(normaliseText);
    const hasAll = requiredHeaders.every((header) => row.includes(header));
    if (hasAll) {
      return i;
    }
  }

  return -1;
}

function parseStructureOccupations(workbook) {
  const rows = getRows(workbook, 'Table 5');
  const headerIndex = findHeaderRow(rows, ['Identifier', 'Occupation']);
  const startIndex = headerIndex >= 0 ? headerIndex + 1 : 0;

  const occupations = new Map();

  for (const row of rows.slice(startIndex)) {
    for (let i = 0; i < row.length - 1; i += 1) {
      const code = toSixDigitCode(row[i]);
      if (!code) {
        continue;
      }

      const title = normaliseText(row[i + 1]);
      if (!title || toSixDigitCode(title)) {
        continue;
      }

      occupations.set(code, title);
      break;
    }
  }

  return occupations;
}

function parseDescriptions(workbook) {
  const rows = getRows(workbook, 'Table 1');
  const headerIndex = findHeaderRow(rows, ['Identifier', 'Principal Title', 'Lead Statement']);
  if (headerIndex === -1) {
    return new Map();
  }

  const header = rows[headerIndex].map(normaliseText);
  const idIndex = header.indexOf('Identifier');
  const leadIndex = header.indexOf('Lead Statement');
  const titleIndex = header.indexOf('Principal Title');
  const inclusionIndex = header.indexOf('Inclusion and Exclusion Statements');
  const taskIndex = header.indexOf('Main Tasks');

  const descriptions = new Map();

  for (const row of rows.slice(headerIndex + 1)) {
    const code = toSixDigitCode(row[idIndex]);
    if (!code) {
      continue;
    }

    const lead = normaliseText(row[leadIndex]);
    const inclusion = inclusionIndex >= 0 ? normaliseText(row[inclusionIndex]) : '';
    const title = titleIndex >= 0 ? normaliseText(row[titleIndex]) : '';
    const mainTasks = taskIndex >= 0
      ? normaliseText(row[taskIndex])
          .split(';')
          .map((task) => task.trim())
          .filter(Boolean)
      : [];
    const description = lead || inclusion || title;

    descriptions.set(code, {
      description,
      leadStatement: lead || title || description,
      tasks: mainTasks,
      taskFallbackNote: mainTasks.length === 0 ? 'OSCA does not list main tasks for this occupation, so the lead statement is shown instead.' : ''
    });
  }

  return descriptions;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

function mergePreferred(primary, secondary, limit = 4) {
  return uniqueStrings([...primary.slice(0, 2), ...secondary, ...primary.slice(2)]).slice(0, limit);
}

function getDomainProfile(title, description) {
  const titleText = title.toLowerCase();
  const descriptionText = description.toLowerCase();
  let bestProfile = DEFAULT_DOMAIN_PROFILE;
  let bestScore = 0;

  DOMAIN_PROFILES.forEach((profile) => {
    const score = profile.keywords.reduce((count, keyword) => {
      const titleMatch = titleText.includes(keyword) ? 3 : 0;
      const descriptionMatch = descriptionText.includes(keyword) ? 1 : 0;
      return count + titleMatch + descriptionMatch;
    }, 0);

    if (score > bestScore) {
      bestProfile = profile;
      bestScore = score;
    }
  });

  return bestScore > 0 ? bestProfile : DEFAULT_DOMAIN_PROFILE;
}

function getRoleShape(title) {
  const normalizedTitle = title.toLowerCase();

  if (/\b(chief|commissioner|president|director|head)\b/.test(normalizedTitle)) {
    return 'executive';
  }

  if (/\b(manager|supervisor)\b/.test(normalizedTitle)) {
    return 'manager';
  }

  if (/\b(analyst|assessor|examiner|planner|estimator)\b/.test(normalizedTitle)) {
    return 'analyst';
  }

  if (/\b(engineer|developer|programmer|architect|scientist|technician|technologist|mechanic|electrician|plumber|carpenter|welder|fitter)\b/.test(normalizedTitle)) {
    return 'technical';
  }

  if (/\b(teacher|lecturer|tutor|trainer|nurse|midwife|therapist|hygienist|artist|designer|writer|officer|sculptor|musician|performer|photographer|biotechnologist|chef)\b/.test(normalizedTitle)) {
    return 'practitioner';
  }

  if (/\b(assistant|administrator|clerk|secretary|receptionist)\b/.test(normalizedTitle)) {
    return 'support';
  }

  if (/\b(worker|labourers?|operator|driver|grower|attendant|cleaner|waiter|cook|barista|walker|shunter)\b/.test(normalizedTitle)) {
    return 'frontline';
  }

  return 'advisor';
}

function estimateSalary(title, domain, shape) {
  const normalizedTitle = title.toLowerCase();
  let salary = domain.baseSalary + ROLE_SHAPE_SALARY_ADJUSTMENTS[shape];

  if (/\b(senior|principal|lead)\b/.test(normalizedTitle)) {
    salary += 10000;
  }

  if (/\b(junior|trainee|apprentice|assistant)\b/.test(normalizedTitle)) {
    salary -= 9000;
  }

  if (/\b(consultant|specialist)\b/.test(normalizedTitle)) {
    salary += 7000;
  }

  if (/\b(nec)\b/.test(normalizedTitle)) {
    salary -= 5000;
  }

  return Math.round(clamp(salary, 48000, 245000) / 1000) * 1000;
}

function buildPrimaryTasks(domain, shape) {
  switch (shape) {
    case 'executive':
      return [
        `Set priorities, staffing, and service targets for ${domain.focus}`,
        'Review high-risk exceptions and approve critical decisions',
        `Track cost, quality, and compliance trends across ${domain.workItems}`,
        'Coordinate executive updates, escalations, and cross-team handoffs'
      ];
    case 'manager':
      return [
        `Manage daily throughput and exceptions for ${domain.workItems}`,
        'Coach team members, assign work, and clear bottlenecks',
        'Review service levels, quality signals, and risk items',
        'Coordinate stakeholder updates, approvals, and escalations'
      ];
    case 'analyst':
      return [
        `Review ${domain.workItems} and identify follow-up actions`,
        'Prepare summaries, reports, and recommendations for stakeholders',
        'Validate outputs against policy, quality, and control requirements',
        'Maintain trackers, documentation, and handoff notes'
      ];
    case 'technical':
      return [
        `Diagnose issues across ${domain.workItems}`,
        'Complete testing, maintenance, or implementation work',
        'Document findings, changes, and required follow-up',
        'Escalate complex exceptions and confirm resolution'
      ];
    case 'practitioner':
      return [
        `Deliver day-to-day ${domain.focus} work and prioritise active cases`,
        'Record outcomes, observations, and required follow-up',
        'Coordinate handoffs, schedules, or customer communication',
        'Escalate complex situations and maintain quality standards'
      ];
    case 'support':
      return [
        `Handle intake, scheduling, and record updates for ${domain.workItems}`,
        'Prepare routine documents, correspondence, and follow-up actions',
        'Keep systems current and route exceptions to the right owner',
        'Track completion status and service deadlines'
      ];
    case 'frontline':
      return [
        `Complete day-to-day ${domain.focus} tasks safely and on schedule`,
        'Use checklists, logs, or handheld tools to capture progress',
        'Coordinate pickups, handoffs, or on-site communication',
        'Report incidents, delays, or quality issues quickly'
      ];
    case 'advisor':
    default:
      return [
        `Manage incoming ${domain.workItems} and prioritise next actions`,
        'Prepare updates, recommendations, and stakeholder communication',
        'Check work against policy, quality, or service standards',
        'Maintain documentation and close the loop on follow-ups'
      ];
  }
}

function buildTooling(domain, shape) {
  return mergePreferred(domain.apps, ROLE_SHAPE_APP_EXTRAS[shape] ?? []);
}

function buildConnectors(domain, shape) {
  return mergePreferred(domain.connectors, ROLE_SHAPE_CONNECTOR_EXTRAS[shape] ?? []);
}

function buildRole(title, descriptionSeed, id) {
  const description = descriptionSeed?.description ?? '';
  const domain = getDomainProfile(title, description);
  const shape = getRoleShape(title);

  return {
    id,
    title,
    description,
    leadStatement: descriptionSeed?.leadStatement ?? description,
    tasks: descriptionSeed?.tasks ?? [],
    taskFallbackNote: descriptionSeed?.taskFallbackNote ?? '',
    salary: estimateSalary(title, domain, shape),
    primaryTasks: buildPrimaryTasks(domain, shape),
    tooling: buildTooling(domain, shape),
    connectors: buildConnectors(domain, shape)
  };
}

function buildRoles(occupationTitles, descriptions) {
  return [...occupationTitles.entries()]
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([id, title]) => buildRole(title, descriptions.get(id), id));
}

async function main() {
  const structureWorkbook = xlsx.readFile(STRUCTURE_FILE, { raw: true });
  const descriptionsWorkbook = xlsx.readFile(DESCRIPTIONS_FILE, { raw: true });

  const occupationTitles = parseStructureOccupations(structureWorkbook);
  const descriptions = parseDescriptions(descriptionsWorkbook);
  const roles = buildRoles(occupationTitles, descriptions);

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(roles, null, 2)}\n`, 'utf8');

  const missingDescriptions = roles.filter((role) => !role.description).length;
  const missingTaskLists = roles.filter((role) => role.tasks.length === 0).length;
  console.log(`Wrote ${roles.length} OSCA roles to ${OUTPUT_FILE}`);
  console.log(`Missing descriptions: ${missingDescriptions}`);
  console.log(`Missing task lists: ${missingTaskLists}`);
}

main().catch((error) => {
  console.error('Failed to build OSCA JSON:', error);
  process.exit(1);
});
