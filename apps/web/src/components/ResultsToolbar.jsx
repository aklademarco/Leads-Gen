import { STATUSES, STATUS_META, SORTS, formatCount } from "../lib/format";
import { ChevronDownIcon, CloseIcon, GridIcon, RowsIcon, SearchIcon } from "./icons";

const segBtn = (on) =>
  `inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[5px] px-2.5 text-[12px] transition-colors ${
    on ? "bg-surface font-medium text-ink shadow-card" : "text-ink-3 hover:text-ink"
  }`;

export default function ResultsToolbar({
  status,
  onStatus,
  counts,
  query,
  onQuery,
  sort,
  onSort,
  layout,
  onLayout,
}) {
  const tabs = [{ key: "all", label: "All" }, ...STATUSES.map((s) => ({ key: s, label: STATUS_META[s].label }))];

  return (
    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
      <div className="-mx-1 overflow-x-auto px-1 lg:mx-0 lg:px-0">
        <div
          role="radiogroup"
          aria-label="Filter by status"
          className="inline-flex h-8 items-center rounded-md bg-subtle p-0.5"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="radio"
              aria-checked={status === t.key}
              onClick={() => onStatus(t.key)}
              className={segBtn(status === t.key)}
            >
              {t.label}
              <span className="font-mono text-[11px] tabular-nums text-ink-3">
                {formatCount(counts[t.key])}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2 lg:justify-end">
        <div className="relative min-w-[180px] flex-1 lg:max-w-[280px]">
          <SearchIcon
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Filter by name or address"
            aria-label="Filter by name or address"
            className="h-8 w-full rounded-md border border-line bg-surface pl-8 pr-7 text-[13px] text-ink placeholder:text-ink-3 transition-colors hover:border-line-strong focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQuery("")}
              aria-label="Clear filter"
              className="absolute right-1 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded text-ink-3 hover:text-ink"
            >
              <CloseIcon size={12} />
            </button>
          )}
        </div>

        <label className="relative">
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="h-8 appearance-none rounded-md border border-line bg-surface pl-2.5 pr-7 text-[13px] text-ink-2 transition-colors hover:border-line-strong focus:border-accent focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            size={12}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3"
          />
        </label>

        <div
          role="radiogroup"
          aria-label="Layout"
          className="inline-flex h-8 items-center rounded-md bg-subtle p-0.5"
        >
          <button
            type="button"
            role="radio"
            aria-checked={layout === "grid"}
            aria-label="Grid view"
            title="Grid view"
            onClick={() => onLayout("grid")}
            className={segBtn(layout === "grid")}
          >
            <GridIcon size={14} />
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={layout === "table"}
            aria-label="Table view"
            title="Table view"
            onClick={() => onLayout("table")}
            className={segBtn(layout === "table")}
          >
            <RowsIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
