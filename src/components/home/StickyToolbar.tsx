'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FilterToolbar from '@/components/home/FilterToolbar';
import type { RiskFilter, SortDirection, SortKey } from '@/lib/indexView';
import { designTokens } from '@/lib/design/tokens';
import type { Role } from '@/types/role';

type StickyToolbarProps = {
  visible: boolean;
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
  hasActiveFilters: boolean;
};

export default function StickyToolbar(props: StickyToolbarProps) {
  const { visible, hasActiveFilters, roles, search, onSearchChange, onSelectRole, majorGroup, onMajorGroupChange, riskFilter, onRiskFilterChange, sortBy, sortDirection, onSetSort, onReset } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) {
      setIsOpen(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current || containerRef.current.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-4 z-40 px-3 sm:px-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div ref={containerRef} className="pointer-events-auto mx-auto flex max-w-[1180px] flex-col items-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              aria-expanded={isOpen}
              aria-controls="floating-index-filters"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-[13px] font-medium shadow-[0_14px_30px_rgba(15,23,42,0.10)] backdrop-blur transition hover:-translate-y-0.5 ${
                isOpen
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white/95 text-slate-700 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <span>{isOpen ? 'Close filters' : 'Filters'}</span>
              {hasActiveFilters ? <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-white/80' : 'bg-slate-900'}`} /> : null}
            </button>

            <AnimatePresence>
              {isOpen ? (
                <motion.div
                  id="floating-index-filters"
                  className="w-full rounded-[26px] border border-slate-200 p-1.5 backdrop-blur"
                  style={{ background: designTokens.gradients.toolbar, boxShadow: designTokens.shadows.panel }}
                  initial={{ opacity: 0, y: -10, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.985 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <FilterToolbar
                    roles={roles}
                    search={search}
                    onSearchChange={onSearchChange}
                    onSelectRole={onSelectRole}
                    majorGroup={majorGroup}
                    onMajorGroupChange={onMajorGroupChange}
                    riskFilter={riskFilter}
                    onRiskFilterChange={onRiskFilterChange}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSetSort={onSetSort}
                    onReset={onReset}
                    compact
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
