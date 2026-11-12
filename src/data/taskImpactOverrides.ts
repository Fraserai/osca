import type { AssessmentConfidence, HumanBottleneck, TaskImpactMode } from '@/types/role';

export type TaskImpactOverrideRecord = {
  roleCode: string;
  taskText: string;
  impactMode: TaskImpactMode;
  bottleneck: HumanBottleneck | null;
  confidence: AssessmentConfidence;
  reasoning?: string;
};

export const TASK_IMPACT_OVERRIDE_DATA_VERSION = '2026-03-impact-v2';

export const TASK_IMPACT_OVERRIDES: TaskImpactOverrideRecord[] = [
  {
    roleCode: '511231',
    taskText: 'Works with Professionals, owners and senior management to ensure that deadlines and compliance requirements are met',
    impactMode: 'augment_now',
    bottleneck: 'regulation',
    confidence: 'high'
  },
  {
    roleCode: '511231',
    taskText: 'Advises senior management on matters requiring attention and implements decisions',
    impactMode: 'augment_now',
    bottleneck: 'judgment',
    confidence: 'high'
  },
  {
    roleCode: '511231',
    taskText: 'Oversees work by contractors and reports on work order variations',
    impactMode: 'human_core',
    bottleneck: 'accountability',
    confidence: 'high'
  },
  {
    roleCode: '531231',
    taskText: 'Authorises the approval of credit and loan applications, and recommends credit and loan conditions and limits',
    impactMode: 'augment_now',
    bottleneck: 'regulation',
    confidence: 'high'
  },
  {
    roleCode: '531231',
    taskText: 'May recommend, approve and arrange mortgages',
    impactMode: 'augment_now',
    bottleneck: 'accountability',
    confidence: 'high'
  },
  {
    roleCode: '531231',
    taskText: "Answers enquiries concerning credit standing of customers, loan balances and penalties",
    impactMode: 'assist_only',
    bottleneck: 'relationship',
    confidence: 'medium'
  },
  {
    roleCode: '531931',
    taskText: 'Investigates and responds to client and adviser queries',
    impactMode: 'assist_only',
    bottleneck: 'relationship',
    confidence: 'medium'
  },
  {
    roleCode: '531931',
    taskText: 'May complete asset transfers, bookings, corporate actions, portfolio reconciliations, client reporting and settlements',
    impactMode: 'augment_now',
    bottleneck: 'accountability',
    confidence: 'high'
  },
  {
    roleCode: '599931',
    taskText: 'Collaborates with Health Professionals to clarify documentation and obtain additional information as needed',
    impactMode: 'human_core',
    bottleneck: 'relationship',
    confidence: 'high'
  },
  {
    roleCode: '599931',
    taskText: 'Conducts regular audits to ensure compliance with coding guidelines and standards',
    impactMode: 'augment_now',
    bottleneck: 'regulation',
    confidence: 'high'
  },
  {
    roleCode: '521236',
    taskText: 'Communicates with beneficiaries to provide information and answer queries',
    impactMode: 'assist_only',
    bottleneck: 'relationship',
    confidence: 'medium'
  },
  {
    roleCode: '521236',
    taskText: 'Ensures compliance with legal and regulatory requirements',
    impactMode: 'augment_now',
    bottleneck: 'regulation',
    confidence: 'high'
  },
  {
    roleCode: '521236',
    taskText: 'Resolves disputes among beneficiaries or involved parties',
    impactMode: 'human_core',
    bottleneck: 'relationship',
    confidence: 'high'
  },
  {
    roleCode: '549133',
    taskText:
      'Liaises with clients, credit staff, accounts receivable departments, process servers, Private Investigators, Barristers, Solicitors, trustees, liquidators and other insolvency professionals to find solutions to payment problems',
    impactMode: 'human_core',
    bottleneck: 'relationship',
    confidence: 'high'
  },
  {
    roleCode: '549133',
    taskText: 'Identifies, locates and notifies debtors of overdue accounts in writing, by telephone and in person, and arranges for payments to be made',
    impactMode: 'augment_now',
    bottleneck: 'relationship',
    confidence: 'high'
  },
  {
    roleCode: '549133',
    taskText:
      'Arranges new repayment plans for debtors having difficulties making existing repayments, including identifying and assisting customers experiencing financial hardship',
    impactMode: 'human_core',
    bottleneck: 'relationship',
    confidence: 'high'
  },
  {
    roleCode: '549133',
    taskText: 'Issues instructions for the commencement of legal action and enforcement to recover money',
    impactMode: 'augment_now',
    bottleneck: 'regulation',
    confidence: 'high'
  },
  {
    roleCode: '549133',
    taskText:
      'Maintains accurate and compliant records for overdue accounts under collection, ensuring all relevant debtor information is obtained, verified and updated',
    impactMode: 'assist_only',
    bottleneck: 'accountability',
    confidence: 'medium'
  },
  {
    roleCode: '591231',
    taskText: 'Assesses social welfare claims and determines eligibility for benefits based on policy guidelines',
    impactMode: 'augment_now',
    bottleneck: 'regulation',
    confidence: 'high'
  },
  {
    roleCode: '591231',
    taskText: 'Interviews claimants to gather information and evidence for assessment',
    impactMode: 'human_core',
    bottleneck: 'relationship',
    confidence: 'high'
  },
  {
    roleCode: '591231',
    taskText: 'Conducts investigations into suspected fraud and breaches of legislation',
    impactMode: 'augment_now',
    bottleneck: 'regulation',
    confidence: 'high'
  },
  {
    roleCode: '591231',
    taskText: 'Provides advice to claimants on their entitlements and obligations',
    impactMode: 'augment_now',
    bottleneck: 'relationship',
    confidence: 'medium'
  },
  {
    roleCode: '552231',
    taskText: 'Welcomes patients and visitors, and directs them to the appropriate person or area',
    impactMode: 'human_core',
    bottleneck: 'relationship',
    confidence: 'high'
  },
  {
    roleCode: '552231',
    taskText: 'Responds to telephone enquiries and complaints',
    impactMode: 'assist_only',
    bottleneck: 'relationship',
    confidence: 'medium'
  },
  {
    roleCode: '531531',
    taskText: 'Examines scenes of incidents resulting in insurance claims to determine causes and effects',
    impactMode: 'human_core',
    bottleneck: 'live_sensing',
    confidence: 'high'
  },
  {
    roleCode: '531531',
    taskText:
      'Conducts interviews to assess the validity of claims and identify the parties responsible for accidents, damage and loss, and prepares statements and reports',
    impactMode: 'human_core',
    bottleneck: 'relationship',
    confidence: 'high'
  },
  {
    roleCode: '531531',
    taskText: 'Inspects damaged buildings, equipment and motor vehicles',
    impactMode: 'human_core',
    bottleneck: 'live_sensing',
    confidence: 'high'
  },
  {
    roleCode: '531531',
    taskText: 'Conducts surveillance and gathers evidence to support investigations',
    impactMode: 'human_core',
    bottleneck: 'live_sensing',
    confidence: 'high'
  },
  {
    roleCode: '619134',
    taskText: 'Makes outbound calls to existing and potential customers to promote products and services',
    impactMode: 'replace_now',
    bottleneck: null,
    confidence: 'high'
  },
  {
    roleCode: '619134',
    taskText: 'Adheres to scripts and guidelines to provide information about products and services to customers over the phone',
    impactMode: 'replace_now',
    bottleneck: null,
    confidence: 'high'
  },
  {
    roleCode: '619134',
    taskText: 'Persuades customers to purchase products or arrange sales visits, and handles customer objections by providing solutions or alternatives',
    impactMode: 'augment_now',
    bottleneck: 'relationship',
    confidence: 'medium'
  },
  {
    roleCode: '619134',
    taskText: 'Arranges appointments for customers and sales representatives, adhering to availability',
    impactMode: 'replace_now',
    bottleneck: null,
    confidence: 'high'
  }
];
