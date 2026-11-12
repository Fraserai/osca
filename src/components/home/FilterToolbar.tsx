import SmartSearchInput from '@/components/shared/SmartSearchInput';
import { MAJOR_GROUP_LABELS } from '@/lib/oscaIndex';
import { RISK_OPTIONS, type RiskFilter, type SortDirection, type SortKey } from '@/lib/indexView';
import type { Role } from '@/types/role';

type FilterToolbarProps = {
  roles: Role[];
  search: string;
  onSearchChange: (value: string) => void;
  onSelectRole: (role: Role) => void;
  majorGroup: string;
  onMajorGroupChange: (value: string) => void;
  riskFilter: RiskFilter;
  onRiskFilterChange: (value: RiskFilter) => void;
  sortBy: SortKey;
  sortDirection: SortDirection;
  onSetSort: (sort: SortKey, direction: SortDirection) => void;
  onReset: () => void;
  compact?: boolean;
};

export default function FilterToolbar({
  roles,
  search,
  onSearchChange,
  onSelectRole,
  majorGroup,
  onMajorGroupChange,
  riskFilter,
  onRiskFilterChange,
  sortBy,
  sortDirection,
  onSetSort,
  onReset,
  compact = false
}: FilterToolbarProps) {
  const sortValue = `${sortBy}:${sortDirection}`;

  return (
    <div className={`rounded-[24px] border border-slate-200 bg-white/92 ${compact ? 'p-2.5' : 'p-4 sm:p-5'} shadow-[0_16px_36px_rgba(15,23,42,0.05)]`}>
      <div
        className={`grid gap-3 ${
          compact
            ? 'lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.88fr)_minmax(0,0.88fr)_minmax(0,0.88fr)_auto]'
            : 'lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.88fr)_minmax(0,0.88fr)_minmax(0,0.88fr)_auto]'
        }`}
      >
        <SmartSearchInput
          roles={roles}
          value={search}
          onChange={onSearchChange}
          onSelectRole={onSelectRole}
          placeholder={compact ? 'Search...' : 'Search occupations...'}
          inputClassName={`w-full min-w-0 rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white ${
            compact ? 'py-2.5' : 'py-3.5'
          }`}
        />

        <select
          value={majorGroup}
          onChange={(event) => onMajorGroupChange(event.target.value)}
          className={`rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-[13px] text-slate-700 outline-none transition focus:border-slate-300 ${
            compact ? 'py-2.5' : 'py-3.5'
          }`}
        >
          {MAJOR_GROUP_LABELS.map((group) => (
            <option key={group.value} value={group.value}>
              {group.label === 'All' ? 'All groups' : group.label}
            </option>
          ))}
        </select>

        <select
          value={riskFilter}
          onChange={(event) => onRiskFilterChange(event.target.value as RiskFilter)}
          className={`rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-[13px] text-slate-700 outline-none transition focus:border-slate-300 ${
            compact ? 'py-2.5' : 'py-3.5'
          }`}
        >
          {RISK_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === 'All' ? 'All risk states' : option}
            </option>
          ))}
        </select>

        <select
          value={sortValue}
          onChange={(event) => {
            const [nextSort, nextDirection] = event.target.value.split(':') as [SortKey, SortDirection];
            onSetSort(nextSort, nextDirection);
          }}
          className={`rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-[13px] text-slate-700 outline-none transition focus:border-slate-300 ${
            compact ? 'py-2.5' : 'py-3.5'
          }`}
        >
          <option value="score:desc">Highest risk</option>
          <option value="score:asc">Lowest risk</option>
          <option value="title:asc">Title A-Z</option>
          <option value="title:desc">Title Z-A</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className={`rounded-[18px] border border-slate-200 bg-white px-4 text-[13px] text-slate-600 transition hover:border-slate-300 hover:text-slate-900 ${
            compact ? 'py-2.5' : 'py-3.5'
          }`}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
