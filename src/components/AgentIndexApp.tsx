'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import FilterToolbar from '@/components/home/FilterToolbar';
import Hero from '@/components/home/Hero';
import StickyToolbar from '@/components/home/StickyToolbar';
import RolePanel from '@/components/role/RolePanel';
import SiteFooter from '@/components/SiteFooter';
import RiskBadge from '@/components/shared/RiskBadge';
import ScorePill from '@/components/shared/ScorePill';
import {
  buildIndexQueryString,
  parseIndexViewFromUrlSearchParams,
  type IndexView,
  RISK_OPTIONS,
  type RiskFilter,
  type SortDirection,
  type SortKey
} from '@/lib/indexView';
import { getTopRoleMatches } from '@/lib/search';
import { getRiskLabel, getSimpleRiskScore, MAJOR_GROUP_LABELS, PER_PAGE } from '@/lib/oscaIndex';
import type { Role } from '@/types/role';

type AgentIndexAppProps = {
  roles: Role[];
  initialView: IndexView;
};

export default function AgentIndexApp({ roles, initialView }: AgentIndexAppProps) {
  const [search, setSearch] = useState(initialView.q);
  const [majorGroup, setMajorGroup] = useState<string>(initialView.group);
  const [riskFilter, setRiskFilter] = useState<RiskFilter>(initialView.risk);
  const [sortBy, setSortBy] = useState<SortKey>(initialView.sort);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialView.dir);
  const [page, setPage] = useState(initialView.page);
  const [selectedRoleCode, setSelectedRoleCode] = useState<string | null>(initialView.role);
  const [showStickyToolbar, setShowStickyToolbar] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const heroSentinelRef = useRef<HTMLDivElement | null>(null);

  const roleByCode = useMemo(() => new Map(roles.map((role) => [role.code, role])), [roles]);
  const selectedRole = selectedRoleCode ? roleByCode.get(selectedRoleCode) ?? null : null;
  const hasActiveFilters = search.trim().length > 0 || majorGroup !== 'All' || riskFilter !== 'All' || sortBy !== 'score' || sortDirection !== 'desc';

  const rolesForSearch = useMemo(() => {
    return roles.filter((role) => {
      const matchesGroup = majorGroup === 'All' || role.majorGroup === majorGroup;
      const matchesRisk = riskFilter === 'All' || getRiskLabel(role.score) === riskFilter;

      return matchesGroup && matchesRisk;
    });
  }, [majorGroup, riskFilter, roles]);

  useEffect(() => {
    const node = heroSentinelRef.current;

    if (!node || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyToolbar(!entry.isIntersecting);
      },
      {
        rootMargin: '-84px 0px 0px 0px',
        threshold: 0
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedRoleCode && !roleByCode.has(selectedRoleCode)) {
      setSelectedRoleCode(null);
    }
  }, [roleByCode, selectedRoleCode]);

  useEffect(() => {
    const handlePopState = () => {
      const nextView = parseIndexViewFromUrlSearchParams(new URLSearchParams(window.location.search));
      setSearch(nextView.q);
      setMajorGroup(nextView.group);
      setRiskFilter(nextView.risk);
      setSortBy(nextView.sort);
      setSortDirection(nextView.dir);
      setPage(nextView.page);
      setSelectedRoleCode(nextView.role);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const searchMatches = useMemo(() => {
    if (deferredSearch.trim().length === 0) {
      return [];
    }

    return getTopRoleMatches(deferredSearch, rolesForSearch, rolesForSearch.length);
  }, [deferredSearch, rolesForSearch]);

  const relevanceByCode = useMemo(() => new Map(searchMatches.map((match) => [match.role.code, match.score])), [searchMatches]);

  const searchedRoles = useMemo(() => {
    if (deferredSearch.trim().length === 0) {
      return rolesForSearch;
    }

    return searchMatches.map((match) => match.role);
  }, [deferredSearch, rolesForSearch, searchMatches]);

  const filteredRoles = useMemo(() => {
    return [...searchedRoles].sort((left, right) => {
      if (deferredSearch.trim().length > 0) {
        const relevanceDelta = (relevanceByCode.get(right.code) ?? 0) - (relevanceByCode.get(left.code) ?? 0);

        if (relevanceDelta !== 0) {
          return relevanceDelta;
        }
      }

      if (sortBy === 'title') {
        return sortDirection === 'desc' ? right.title.localeCompare(left.title) : left.title.localeCompare(right.title);
      }

      const rightSimpleRisk = getSimpleRiskScore(right.score);
      const leftSimpleRisk = getSimpleRiskScore(left.score);

      if (rightSimpleRisk !== leftSimpleRisk) {
        return sortDirection === 'desc' ? rightSimpleRisk - leftSimpleRisk : leftSimpleRisk - rightSimpleRisk;
      }

      if (right.score !== left.score) {
        return sortDirection === 'desc' ? right.score - left.score : left.score - right.score;
      }

      return left.title.localeCompare(right.title);
    });
  }, [deferredSearch, relevanceByCode, searchedRoles, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / PER_PAGE));
  const activePage = Math.min(page, totalPages - 1);
  const pagedRoles = filteredRoles.slice(activePage * PER_PAGE, (activePage + 1) * PER_PAGE);

  useEffect(() => {
    if (page !== activePage) {
      setPage(activePage);
    }
  }, [activePage, page]);

  useEffect(() => {
    const nextQuery = buildIndexQueryString({
      q: search,
      group: majorGroup,
      risk: riskFilter,
      sort: sortBy,
      dir: sortDirection,
      page: activePage,
      role: selectedRoleCode
    });
    const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, '', nextUrl);
    }
  }, [activePage, majorGroup, riskFilter, search, selectedRoleCode, sortBy, sortDirection]);

  function resetAll() {
    setSearch('');
    setMajorGroup('All');
    setRiskFilter('All');
    setSortBy('score');
    setSortDirection('desc');
    setPage(0);
  }

  function updateSearch(nextSearch: string) {
    setSearch(nextSearch);
    setPage(0);
  }

  function selectRoleFromSearch(role: Role) {
    updateSearch(role.title);
    setSelectedRoleCode(role.code);
  }

  function updateMajorGroup(nextGroup: string) {
    setMajorGroup(nextGroup);
    setPage(0);
  }

  function updateRiskFilter(nextRisk: RiskFilter) {
    setRiskFilter(nextRisk);
    setPage(0);
  }

  function setSort(nextSort: SortKey, nextDirection: SortDirection) {
    setSortBy(nextSort);
    setSortDirection(nextDirection);
    setPage(0);
  }

  return (
    <div className="pb-16">
      <StickyToolbar
        visible={showStickyToolbar}
        hasActiveFilters={hasActiveFilters}
        roles={rolesForSearch}
        search={search}
        onSearchChange={updateSearch}
        onSelectRole={selectRoleFromSearch}
        majorGroup={majorGroup}
        onMajorGroupChange={updateMajorGroup}
        riskFilter={riskFilter}
        onRiskFilterChange={updateRiskFilter}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSetSort={setSort}
        onReset={resetAll}
      />

      <Hero roles={rolesForSearch} rolesCount={roles.length} filteredCount={filteredRoles.length} search={search} onSearchChange={updateSearch} onSelectRole={selectRoleFromSearch} />

      <div className="mt-6 space-y-6">
        <div ref={heroSentinelRef} className="h-px w-full" />

        <section className="osca-section rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">All occupations</div>
              <h2 className="mt-2 font-serif-display text-[30px] leading-[1] text-slate-900">Search a role and open the report.</h2>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">{filteredRoles.length.toLocaleString()} in view</div>
          </div>

          <div className="mt-5">
            <FilterToolbar
              roles={rolesForSearch}
              search={search}
              onSearchChange={updateSearch}
              onSelectRole={selectRoleFromSearch}
              majorGroup={majorGroup}
              onMajorGroupChange={updateMajorGroup}
              riskFilter={riskFilter}
              onRiskFilterChange={updateRiskFilter}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSetSort={setSort}
              onReset={resetAll}
            />
          </div>

          {hasActiveFilters ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
              <span className="font-mono uppercase tracking-[0.12em] text-slate-400">Filters</span>
              {search.trim() ? <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Search: {search.trim()}</span> : null}
              {majorGroup !== 'All' ? (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  Group: {MAJOR_GROUP_LABELS.find((group) => group.value === majorGroup)?.label ?? majorGroup}
                </span>
              ) : null}
              {riskFilter !== 'All' ? <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Risk: {riskFilter}</span> : null}
              {sortBy !== 'score' || sortDirection !== 'desc' ? (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  Sort: {sortBy === 'score' ? 'risk' : 'title'} {sortDirection}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
            <span className="font-mono uppercase tracking-[0.12em] text-slate-400">Quick views</span>
            {RISK_OPTIONS.map((option) => {
              const active = riskFilter === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateRiskFilter(option)}
                  className={`rounded-full border px-3 py-1 transition ${
                    active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
            <div className="hidden grid-cols-[minmax(0,1fr)_auto_auto] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 sm:grid">
              <span>Occupation</span>
              <span>Status</span>
              <span className="text-right">Risk</span>
            </div>

            {pagedRoles.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <div className="text-[14px] text-slate-500">No occupations match the current filters.</div>
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              pagedRoles.map((role, index) => (
                <button
                  key={role.code}
                  type="button"
                  onClick={() => setSelectedRoleCode(role.code)}
                  className="osca-fade-row group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-200 bg-white px-4 py-4 text-left transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                  style={{ animationDelay: `${Math.min(index * 14, 240)}ms` }}
                >
                  <span className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">OSCA {role.code}</span>
                    <span className="mt-1 block truncate text-[15px] font-semibold text-slate-900">{role.title}</span>
                    <span className="mt-1 block truncate text-[12px] text-slate-500">
                      {role.taskAutomationCount}/{role.taskAssessments.length} listed tasks look at risk now
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    <RiskBadge score={role.score} />
                  </span>
                  <span className="justify-self-end">
                    <div className="flex flex-col items-end gap-1">
                      <ScorePill score={role.score} />
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400 sm:hidden">{getRiskLabel(role.score)}</span>
                    </div>
                  </span>
                </button>
              ))
            )}
          </div>

          {totalPages > 1 ? (
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={activePage === 0}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-[12px] text-slate-600 transition disabled:cursor-default disabled:text-slate-300"
              >
                Prev
              </button>
              <span className="font-mono text-[11px] text-slate-500">
                {activePage + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                disabled={activePage >= totalPages - 1}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-[12px] text-slate-600 transition disabled:cursor-default disabled:text-slate-300"
              >
                Next
              </button>
            </div>
          ) : null}
        </section>

      <SiteFooter />
      </div>

      <RolePanel role={selectedRole} roles={roles} onClose={() => setSelectedRoleCode(null)} onSelectRole={(nextRole) => setSelectedRoleCode(nextRole.code)} />
    </div>
  );
}
