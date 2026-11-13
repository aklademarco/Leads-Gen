import { useEffect } from "react";
import { CloseIcon, InboxIcon, SearchIcon } from "./icons";
import { STATUSES, STATUS_META, formatCount } from "../lib/format";

function Mark() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md bg-accent text-white">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 14s4.5-4 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 10 8 14 8 14z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="6.5" r="1.4" fill="currentColor" />
      </svg>
    </div>
  );
}

function NavItem({ icon, label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors ${
        active
          ? "bg-rail-2 text-rail-text"
          : "text-rail-muted hover:bg-rail-2/60 hover:text-rail-text"
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {count != null && (
        <span className="font-mono text-[11px] tabular-nums text-rail-muted">
          {formatCount(count)}
        </span>
      )}
    </button>
  );
}

// st-new is too dark against the rail; lift it to the rail's muted tone.
const railDot = (s) => (s === "new" ? "bg-rail-muted" : STATUS_META[s].dot);

function Pipeline({ counts, activeStatus, onPick }) {
  const total = STATUSES.reduce((n, s) => n + (counts[s] || 0), 0);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between px-2.5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-rail-muted">
          Pipeline
        </h2>
      </div>
      <div
        className="mx-2.5 mb-2.5 flex h-1 overflow-hidden rounded-full bg-rail-2"
        role="img"
        aria-label={STATUSES.map((s) => `${STATUS_META[s].label} ${counts[s] || 0}`).join(", ")}
      >
        {total > 0 &&
          STATUSES.map((s) =>
            counts[s] ? (
              <span
                key={s}
                className={`${railDot(s)} h-full border-r border-rail last:border-r-0`}
                style={{ width: `${(counts[s] / total) * 100}%` }}
              />
            ) : null,
          )}
      </div>
      <ul className="space-y-px">
        {STATUSES.map((s) => {
          const active = activeStatus === s;
          return (
            <li key={s}>
              <button
                type="button"
                onClick={() => onPick(s)}
                aria-current={active ? "true" : undefined}
                className={`flex h-7 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors ${
                  active
                    ? "bg-rail-2 text-rail-text"
                    : "text-rail-muted hover:bg-rail-2/60 hover:text-rail-text"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${railDot(s)}`}
                />
                <span className="flex-1 text-left">{STATUS_META[s].label}</span>
                <span className="font-mono text-[11px] tabular-nums">
                  {formatCount(counts[s])}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Sidebar({
  view,
  onNavigate,
  counts,
  activeStatus,
  onPipeline,
  open,
  onClose,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[232px] shrink-0 flex-col overflow-y-auto border-r border-rail-line bg-rail transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center gap-2.5 px-4">
          <Mark />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-[14px] font-semibold tracking-tight text-rail-text">LeadFind</div>
            <div className="text-[11px] text-rail-muted">Ghana prospecting</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="inline-flex size-7 items-center justify-center rounded-md text-rail-muted hover:bg-rail-2 hover:text-rail-text lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="space-y-px px-2 pt-2">
          <NavItem
            icon={<SearchIcon />}
            label="Search"
            active={view === "search"}
            onClick={() => onNavigate("search")}
          />
          <NavItem
            icon={<InboxIcon />}
            label="All leads"
            count={counts.all}
            active={view === "all" && activeStatus === "all"}
            onClick={() => onNavigate("all")}
          />
        </nav>

        <div className="mx-4 my-4 h-px bg-rail-line" />

        <div className="px-2">
          <Pipeline
            counts={counts}
            activeStatus={view === "all" ? activeStatus : null}
            onPick={onPipeline}
          />
        </div>

        <div className="mt-auto border-t border-rail-line px-4 py-3 text-[11px] leading-relaxed text-rail-muted">
          Data from Google Places
        </div>
      </aside>
    </>
  );
}
