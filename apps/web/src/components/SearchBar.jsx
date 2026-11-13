import TypeCombobox from "./TypeCombobox";
import LocationPicker from "./LocationPicker";
import { ClockIcon, CloseIcon, SearchIcon } from "./icons";
import { RADII, capitalize } from "../lib/format";

function RadiusControl({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Search radius"
      className="flex h-8 items-center rounded-md bg-subtle p-0.5"
    >
      {RADII.map((km) => {
        const on = value === km;
        return (
          <button
            key={km}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(km)}
            className={`h-7 rounded-[5px] px-2 text-[12px] tabular-nums transition-colors ${
              on
                ? "bg-surface font-medium text-ink shadow-card"
                : "text-ink-3 hover:text-ink"
            }`}
          >
            {km} km
          </button>
        );
      })}
    </div>
  );
}

function recentLabel(r) {
  return `${capitalize(r.type)} · ${r.location?.label || r.location?.query}`;
}

export default function SearchBar({
  type,
  onTypeChange,
  location,
  onLocationChange,
  radius,
  onRadiusChange,
  onSubmit,
  loading,
  recent,
  onRecent,
  onClearRecent,
  typeInputRef,
}) {
  return (
    <section aria-label="Search">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col rounded-xl border border-line bg-surface shadow-card transition-colors focus-within:border-line-strong md:flex-row md:flex-wrap md:items-center xl:flex-nowrap"
      >
        <TypeCombobox
          value={type}
          onChange={onTypeChange}
          inputRef={typeInputRef}
          className="min-w-0 md:basis-1/2 xl:flex-[1.1] xl:basis-auto"
        />
        {/* LocationPicker renders its own bordered input; flatten it into the bar. */}
        <div className="min-w-0 border-t border-line md:basis-1/2 md:border-l md:border-t-0 xl:flex-1 xl:basis-auto [&_input]:rounded-none [&_input]:border-0 [&_input]:bg-transparent [&_input:focus]:ring-0">
          <LocationPicker
            value={location}
            onChange={onLocationChange}
            className="h-10 w-full"
          />
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-line px-2 py-1.5 md:basis-full xl:basis-auto xl:border-l xl:border-t-0">
          <RadiusControl value={radius} onChange={onRadiusChange} />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-progress disabled:opacity-70"
          >
            <SearchIcon size={14} />
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {recent.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 flex items-center gap-1.5 text-[12px] text-ink-3">
            <ClockIcon size={13} />
            Recent
          </span>
          {recent.map((r) => (
            <button
              key={`${r.type}|${r.location?.query}|${r.radius}`}
              type="button"
              onClick={() => onRecent(r)}
              className="inline-flex h-7 max-w-[280px] items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[12px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              <span className="truncate">{recentLabel(r)}</span>
              <span className="font-mono text-[11px] text-ink-3">{r.radius} km</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onClearRecent}
            aria-label="Clear recent searches"
            className="inline-flex size-7 items-center justify-center rounded-md text-ink-3 hover:bg-subtle hover:text-ink"
          >
            <CloseIcon size={13} />
          </button>
        </div>
      )}
    </section>
  );
}
