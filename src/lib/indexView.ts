import { MAJOR_GROUP_LABELS } from '@/lib/oscaIndex';

export const SORT_OPTIONS = ['score', 'title'] as const;
export const SORT_DIRECTIONS = ['asc', 'desc'] as const;
export const RISK_OPTIONS = ['All', 'At risk', 'Safer for now'] as const;

export type SortKey = (typeof SORT_OPTIONS)[number];
export type SortDirection = (typeof SORT_DIRECTIONS)[number];
export type RiskFilter = (typeof RISK_OPTIONS)[number];

export type IndexView = {
  q: string;
  group: string;
  risk: RiskFilter;
  sort: SortKey;
  dir: SortDirection;
  page: number;
  role: string | null;
};

const VALID_MAJOR_GROUPS: Set<string> = new Set(MAJOR_GROUP_LABELS.map((group) => group.value));
const VALID_SORTS = new Set<string>(SORT_OPTIONS);
const VALID_DIRECTIONS = new Set<string>(SORT_DIRECTIONS);
const VALID_RISKS = new Set<string>(RISK_OPTIONS);
const LEGACY_SORTS = new Set<string>(['salary']);
const ROLE_CODE = /^\d{6}$/;

export const DEFAULT_INDEX_VIEW: IndexView = {
  q: '',
  group: 'All',
  risk: 'All',
  sort: 'score',
  dir: 'desc',
  page: 0,
  role: null
};

type SearchParamRecord = Record<string, string | string[] | undefined>;

function readSingleValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

function normalisePage(value: string): number {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 0;
  }

  return parsed - 1;
}

function normaliseSort(value: string): SortKey {
  if (VALID_SORTS.has(value)) {
    return value as SortKey;
  }

  if (LEGACY_SORTS.has(value)) {
    return 'score';
  }

  return DEFAULT_INDEX_VIEW.sort;
}

export function parseIndexView(record: SearchParamRecord): IndexView {
  const q = readSingleValue(record.q).trim();
  const group = readSingleValue(record.group);
  const risk = readSingleValue(record.risk);
  const sort = readSingleValue(record.sort);
  const dir = readSingleValue(record.dir);
  const role = readSingleValue(record.role);

  return {
    q,
    group: VALID_MAJOR_GROUPS.has(group) ? group : DEFAULT_INDEX_VIEW.group,
    risk: VALID_RISKS.has(risk) ? (risk as RiskFilter) : DEFAULT_INDEX_VIEW.risk,
    sort: normaliseSort(sort),
    dir: VALID_DIRECTIONS.has(dir) ? (dir as SortDirection) : DEFAULT_INDEX_VIEW.dir,
    page: normalisePage(readSingleValue(record.page)),
    role: ROLE_CODE.test(role) ? role : null
  };
}

export function parseIndexViewFromUrlSearchParams(params: URLSearchParams): IndexView {
  return parseIndexView({
    q: params.get('q') ?? undefined,
    group: params.get('group') ?? undefined,
    risk: params.get('risk') ?? undefined,
    sort: params.get('sort') ?? undefined,
    dir: params.get('dir') ?? undefined,
    page: params.get('page') ?? undefined,
    role: params.get('role') ?? undefined
  });
}

export function buildIndexQueryString(view: IndexView): string {
  const params = new URLSearchParams();

  if (view.q) params.set('q', view.q);
  if (view.group !== DEFAULT_INDEX_VIEW.group) params.set('group', view.group);
  if (view.risk !== DEFAULT_INDEX_VIEW.risk) params.set('risk', view.risk);
  if (view.sort !== DEFAULT_INDEX_VIEW.sort) params.set('sort', view.sort);
  if (view.dir !== DEFAULT_INDEX_VIEW.dir) params.set('dir', view.dir);
  if (view.page > 0) params.set('page', String(view.page + 1));
  if (view.role) params.set('role', view.role);

  return params.toString();
}
