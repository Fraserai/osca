const ROLE_TITLE_ALIAS_GROUPS = [
  {
    aliases: ['software developer', 'app developer', 'application developer', 'full stack developer', 'fullstack developer', 'backend developer'],
    titles: ['Software Engineer']
  },
  {
    aliases: ['front end developer', 'frontend developer', 'front-end developer', 'ui developer'],
    titles: ['Web Developer']
  },
  {
    aliases: ['business analyst', 'business systems analyst', 'technical business analyst', 'systems business analyst'],
    titles: ['ICT Business Analyst', 'Systems Analyst']
  },
  {
    aliases: ['system administrator', 'sysadmin', 'it administrator', 'it admin'],
    titles: ['Systems Administrator']
  },
  {
    aliases: ['network admin', 'network administrator'],
    titles: ['Network Administrator']
  },
  {
    aliases: ['database admin', 'database administrator', 'dba'],
    titles: ['Database Administrator']
  },
  {
    aliases: ['web admin', 'website administrator'],
    titles: ['Web Administrator']
  },
  {
    aliases: ['service desk analyst', 'service desk engineer', 'help desk analyst', 'helpdesk analyst', 'technical support engineer', 'desktop support'],
    titles: ['ICT Support Engineer', 'ICT Customer Support Officer']
  },
  {
    aliases: ['office admin', 'office administrator', 'admin officer', 'administration officer', 'project admin', 'program admin'],
    titles: ['General Clerk', 'Program or Project Administrator', 'Contract Administrator', 'Warehouse Administrator']
  },
  {
    aliases: ['accounts assistant', 'finance assistant', 'finance clerk', 'ap clerk', 'ar clerk', 'accounts payable clerk', 'accounts receivable clerk'],
    titles: ['Accounts Clerk', 'Bookkeeper']
  },
  {
    aliases: ['payroll clerk', 'payroll admin', 'payroll administrator'],
    titles: ['Payroll Officer']
  },
  {
    aliases: ['front desk', 'front desk receptionist', 'reception'],
    titles: ['Receptionist (General)']
  },
  {
    aliases: ['front office receptionist', 'hotel front desk'],
    titles: ['Hotel or Motel Receptionist']
  },
  {
    aliases: ['medical front desk', 'clinic receptionist', 'medical admin receptionist', 'practice receptionist'],
    titles: ['Medical Receptionist']
  },
  {
    aliases: ['unit clerk', 'hospital ward admin', 'ward admin'],
    titles: ['Ward Clerk']
  },
  {
    aliases: ['call centre agent', 'call center agent', 'call centre rep', 'call center rep', 'contact centre agent', 'contact center agent', 'customer service rep', 'customer service representative'],
    titles: ['Call or Contact Centre Operator', 'ICT Customer Support Officer', 'Airline Customer Support Worker']
  },
  {
    aliases: ['contact centre lead', 'call centre lead', 'call center lead', 'customer service team leader'],
    titles: ['Call or Contact Centre Team Leader', 'Customer Service Manager']
  },
  {
    aliases: ['health practice manager', 'clinic manager', 'medical practice manager'],
    titles: ['Health Practice Manager', 'Practice Managers nec']
  }
] as const;

export function getAliasesForRoleTitle(title: string): string[] {
  return ROLE_TITLE_ALIAS_GROUPS.flatMap((group) => ((group.titles as readonly string[]).includes(title) ? [...group.aliases] : []));
}
