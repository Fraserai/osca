import { getAliasesForRoleTitle } from '@/lib/search/aliases';
import type { Role } from '@/types/role';

export type RoleMatchKind = 'exact_code' | 'exact_title' | 'prefix_title' | 'alias' | 'token' | 'fuzzy' | 'fulltext';

export type RoleMatch = {
  role: Role;
  score: number;
  matchKind: RoleMatchKind;
  matchedTerms: string[];
};

type RoleSearchEntry = {
  role: Role;
  normalizedTitle: string;
  normalizedCompactTitle: string;
  titleTokens: string[];
  coreTitleTokens: string[];
  aliases: string[];
  candidateStrings: string[];
  fullText: string;
  fullTextTokens: Set<string>;
};

const entryCache = new WeakMap<Role[], RoleSearchEntry[]>();

const SPELLING_NORMALISATIONS: Record<string, string> = {
  centre: 'center',
  centres: 'centers',
  organisation: 'organization',
  organisations: 'organizations',
  behaviour: 'behavior',
  behaviours: 'behaviors',
  specialise: 'specialize',
  specialises: 'specializes',
  specialised: 'specialized',
  specialising: 'specializing',
  counsellor: 'counselor',
  counsellors: 'counselors',
  paediatric: 'pediatric',
  paediatrics: 'pediatrics',
  programme: 'program',
  programmes: 'programs',
  enrolment: 'enrollment',
  enrolments: 'enrollments',
  labour: 'labor',
  labourer: 'laborer',
  labourers: 'laborers',
  catalogue: 'catalog',
  catalogues: 'catalogs'
};

const TOKEN_NORMALISATIONS: Record<string, string[]> = {
  dev: ['developer'],
  frontend: ['front', 'end'],
  backend: ['back', 'end'],
  fullstack: ['full', 'stack'],
  qa: ['quality', 'assurance'],
  hr: ['human', 'resources'],
  admin: ['administrator'],
  it: ['ict'],
  receivable: ['receivables'],
  payable: ['payables'],
  helpdesk: ['help', 'desk'],
  sysadmin: ['system', 'administrator']
};

const MODIFIER_TOKENS = new Set([
  'junior',
  'senior',
  'lead',
  'principal',
  'assistant',
  'specialist',
  'coordinator',
  'officer',
  'representative',
  'rep',
  'general',
  'nec'
]);

const STOP_TOKENS = new Set(['a', 'an', 'and', 'or', 'the', 'of', 'for', 'to', 'in']);

function singulariseToken(token: string): string {
  if (token.length <= 3) {
    return token;
  }

  if (token.endsWith('ies') && token.length > 4) {
    return `${token.slice(0, -3)}y`;
  }

  if (token.endsWith('sses') || token.endsWith('osis') || token.endsWith('sis')) {
    return token;
  }

  if (token.endsWith('es') && token.length > 4 && !token.endsWith('oes')) {
    return token.slice(0, -2);
  }

  if (token.endsWith('s') && !token.endsWith('ss')) {
    return token.slice(0, -1);
  }

  return token;
}

function normaliseWord(word: string): string {
  return SPELLING_NORMALISATIONS[word] ?? word;
}

function normaliseLooseText(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[()]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(normaliseWord)
    .join(' ');
}

function tokenise(value: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(' ')
    .flatMap((token) => TOKEN_NORMALISATIONS[token] ?? [token])
    .map(singulariseToken)
    .filter(Boolean);
}

function getCoreTokens(normalized: string): string[] {
  return tokenise(normalized).filter((token) => !STOP_TOKENS.has(token) && !MODIFIER_TOKENS.has(token));
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function buildFullText(role: Role): string {
  return normaliseLooseText(
    [
      role.code,
      role.title,
      role.description,
      role.leadStatement,
      role.unitGroup,
      role.majorName,
      ...role.tasks,
      ...role.taskAssessments.map((task) => task.capability),
      ...role.taskAssessments.map((task) => task.impactMode),
      ...role.taskAssessments.map((task) => task.bottleneck ?? '')
    ].join(' ')
  );
}

function getSearchEntries(roles: Role[]): RoleSearchEntry[] {
  const cached = entryCache.get(roles);

  if (cached) {
    return cached;
  }

  const entries = roles.map((role) => {
    const normalizedTitle = normaliseSearchQuery(role.title);
    const normalizedCompactTitle = normalizedTitle.replace(/\s+/g, ' ');
    const aliases = uniqueStrings(getAliasesForRoleTitle(role.title).map((alias) => normaliseSearchQuery(alias)));
    const candidateStrings = uniqueStrings([
      normalizedTitle,
      normalizedCompactTitle,
      normaliseSearchQuery(role.unitGroup),
      ...aliases
    ]);
    const fullText = buildFullText(role);

    return {
      role,
      normalizedTitle,
      normalizedCompactTitle,
      titleTokens: tokenise(normalizedTitle),
      coreTitleTokens: getCoreTokens(normalizedTitle),
      aliases,
      candidateStrings,
      fullText,
      fullTextTokens: new Set(tokenise(fullText))
    };
  });

  entryCache.set(roles, entries);
  return entries;
}

function compareMatchKind(left: RoleMatchKind, right: RoleMatchKind): number {
  const order: RoleMatchKind[] = ['exact_code', 'exact_title', 'prefix_title', 'alias', 'token', 'fuzzy', 'fulltext'];
  return order.indexOf(left) - order.indexOf(right);
}

function levenshteinDistance(left: string, right: string): number {
  if (left === right) {
    return 0;
  }

  if (left.length === 0) {
    return right.length;
  }

  if (right.length === 0) {
    return left.length;
  }

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = new Array<number>(right.length + 1);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitutionCost
      );
    }

    for (let index = 0; index <= right.length; index += 1) {
      previous[index] = current[index];
    }
  }

  return previous[right.length];
}

function getSimilarityScore(left: string, right: string): number {
  if (!left || !right) {
    return 0;
  }

  const distance = levenshteinDistance(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

function getTokenMetrics(queryTokens: string[], candidateTokens: string[]) {
  const candidateSet = new Set(candidateTokens);
  const matched = uniqueStrings(queryTokens.filter((token) => candidateSet.has(token)));
  const coverage = queryTokens.length > 0 ? matched.length / queryTokens.length : 0;
  const overlap = candidateTokens.length > 0 ? matched.length / candidateTokens.length : 0;

  return {
    matched,
    coverage,
    overlap
  };
}

function buildRoleMatch(query: string, entry: RoleSearchEntry): RoleMatch | null {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return null;
  }

  const normalizedQuery = normaliseSearchQuery(trimmedQuery);
  const queryTokens = tokenise(normalizedQuery);
  const coreQueryTokens = getCoreTokens(normalizedQuery);

  if (trimmedQuery === entry.role.code) {
    return {
      role: entry.role,
      score: 100000,
      matchKind: 'exact_code',
      matchedTerms: [entry.role.code]
    };
  }

  if (normalizedQuery === entry.normalizedTitle) {
    return {
      role: entry.role,
      score: 90000,
      matchKind: 'exact_title',
      matchedTerms: [entry.role.title]
    };
  }

  if (entry.normalizedTitle.startsWith(normalizedQuery) || entry.normalizedCompactTitle.startsWith(normalizedQuery)) {
    return {
      role: entry.role,
      score: 80000 + Math.min(normalizedQuery.length, 24),
      matchKind: 'prefix_title',
      matchedTerms: [entry.role.title]
    };
  }

  const aliasMatch = entry.aliases.find((alias) => alias === normalizedQuery || alias.startsWith(normalizedQuery));
  if (aliasMatch) {
    return {
      role: entry.role,
      score: 70000 + Math.min(aliasMatch.length, 24),
      matchKind: 'alias',
      matchedTerms: [aliasMatch]
    };
  }

  const tokenMetrics = getTokenMetrics(coreQueryTokens, entry.coreTitleTokens);
  if (tokenMetrics.coverage > 0) {
    return {
      role: entry.role,
      score: 60000 + Math.round(tokenMetrics.coverage * 240) + Math.round(tokenMetrics.overlap * 60),
      matchKind: 'token',
      matchedTerms: tokenMetrics.matched
    };
  }

  const bestFuzzy = entry.candidateStrings.reduce(
    (best, candidate) => {
      const similarity = getSimilarityScore(normalizedQuery, candidate);

      if (similarity > best.similarity) {
        return {
          candidate,
          similarity
        };
      }

      return best;
    },
    { candidate: '', similarity: 0 }
  );

  if (bestFuzzy.similarity >= 0.72) {
    return {
      role: entry.role,
      score: 50000 + Math.round(bestFuzzy.similarity * 1000),
      matchKind: 'fuzzy',
      matchedTerms: [bestFuzzy.candidate]
    };
  }

  const fullTextMetrics = getTokenMetrics(coreQueryTokens.length > 0 ? coreQueryTokens : queryTokens, [...entry.fullTextTokens]);

  if (entry.fullText.includes(normalizedQuery) || fullTextMetrics.coverage >= 0.5) {
    return {
      role: entry.role,
      score: 40000 + Math.round(fullTextMetrics.coverage * 180),
      matchKind: 'fulltext',
      matchedTerms: fullTextMetrics.matched
    };
  }

  return null;
}

export function normaliseSearchQuery(input: string): string {
  return normaliseLooseText(input);
}

export function getRoleSearchCandidates(role: Role): string[] {
  const normalizedTitle = normaliseSearchQuery(role.title);

  return uniqueStrings([
    normalizedTitle,
    normaliseSearchQuery(role.unitGroup),
    ...getAliasesForRoleTitle(role.title).map((alias) => normaliseSearchQuery(alias))
  ]);
}

export function scoreRoleMatch(query: string, role: Role): number {
  const entry = getSearchEntries([role])[0];
  return buildRoleMatch(query, entry)?.score ?? 0;
}

export function getTopRoleMatches(query: string, roles: Role[], limit = 5): RoleMatch[] {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return getSearchEntries(roles)
    .map((entry) => buildRoleMatch(trimmedQuery, entry))
    .filter((match): match is RoleMatch => match !== null)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const matchKindOrder = compareMatchKind(left.matchKind, right.matchKind);
      if (matchKindOrder !== 0) {
        return matchKindOrder;
      }

      return left.role.code.localeCompare(right.role.code);
    })
    .slice(0, limit);
}
