'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { getTopRoleMatches } from '@/lib/search';
import type { Role } from '@/types/role';

type SmartSearchInputProps = {
  roles: Role[];
  value: string;
  onChange: (value: string) => void;
  onSelectRole: (role: Role) => void;
  placeholder: string;
  inputClassName?: string;
  panelClassName?: string;
};

export default function SmartSearchInput({
  roles,
  value,
  onChange,
  onSelectRole,
  placeholder,
  inputClassName,
  panelClassName
}: SmartSearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const deferredValue = useDeferredValue(value);
  const suggestions = useMemo(() => getTopRoleMatches(deferredValue, roles, 5), [deferredValue, roles]);
  const isOpen = isFocused && value.trim().length > 0 && suggestions.length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredValue]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current || wrapperRef.current.contains(event.target as Node)) {
        return;
      }

      setIsFocused(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  function selectSuggestion(role: Role) {
    onChange(role.title);
    onSelectRole(role);
    setIsFocused(false);
    setActiveIndex(0);
  }

  return (
    <div ref={wrapperRef} className="min-w-0">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(event) => {
          if (!isOpen) {
            if (event.key === 'Escape') {
              setIsFocused(false);
            }
            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((current) => (current + 1) % suggestions.length);
            return;
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
            return;
          }

          if (event.key === 'Enter') {
            event.preventDefault();
            selectSuggestion(suggestions[activeIndex]?.role ?? suggestions[0].role);
            return;
          }

          if (event.key === 'Escape') {
            event.preventDefault();
            setIsFocused(false);
          }
        }}
        placeholder={placeholder}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        className={inputClassName}
      />

      {isOpen ? (
        <div
          className={`mt-3 overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.10)] ${
            panelClassName ?? ''
          }`}
        >
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
            Closest matches
          </div>
          <div className="max-h-[320px] overflow-y-auto py-1.5">
            {suggestions.map((match, index) => {
              const active = index === activeIndex;

              return (
                <button
                  key={`${match.role.code}-${match.matchKind}`}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectSuggestion(match.role);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition ${
                    active ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold">{match.role.title}</span>
                    <span className={`mt-1 block truncate text-[12px] ${active ? 'text-white/70' : 'text-slate-500'}`}>{match.role.majorName}</span>
                  </span>
                  <span className={`shrink-0 font-mono text-[11px] ${active ? 'text-white/70' : 'text-slate-400'}`}>{match.role.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
