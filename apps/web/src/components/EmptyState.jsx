import { AlertIcon, ArrowIcon, FilterIcon, InboxIcon, RetryIcon, SearchIcon } from "./icons";

function Frame({ icon, title, children, tone = "neutral" }) {
  return (
    <div className="animate-rise rounded-xl border border-dashed border-line-strong px-6 py-14 text-center sm:py-16">
      <div
        className={`mx-auto flex size-9 items-center justify-center rounded-lg border ${
          tone === "danger"
            ? "border-danger-soft bg-danger-soft text-danger"
            : "border-line bg-surface text-ink-3"
        }`}
      >
        {icon}
      </div>
      <h2 className="mt-4 text-[15px] font-medium text-ink">{title}</h2>
      {children}
    </div>
  );
}

const btn =
  "inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-[13px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink";

export function EmptySearch({ suggestions, onPick }) {
  return (
    <Frame icon={<SearchIcon />} title="Find businesses that need a website">
      <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-3">
        Pick a business type and a place in Ghana. Results only include
        businesses on Google Maps with no website listed.
      </p>
      <div className="mx-auto mt-6 grid max-w-xl gap-2 sm:grid-cols-2">
        {suggestions.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onPick(s)}
            className="group flex items-center justify-between rounded-lg border border-line bg-surface px-3.5 py-2.5 text-left text-[13px] text-ink-2 shadow-card transition-colors hover:border-line-strong hover:text-ink"
          >
            {s.label}
            <ArrowIcon size={14} className="text-ink-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </Frame>
  );
}

export function NoResults({ title, body, actionLabel, onAction }) {
  return (
    <Frame icon={<InboxIcon />} title={title}>
      {body && (
        <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-3">{body}</p>
      )}
      {onAction && (
        <button type="button" onClick={onAction} className={`${btn} mt-5`}>
          {actionLabel}
        </button>
      )}
    </Frame>
  );
}

export function NoMatches({ onClear }) {
  return (
    <Frame icon={<FilterIcon />} title="No leads match these filters">
      <p className="mx-auto mt-1.5 max-w-md text-[13px] text-ink-3">
        Try a different status or clear the text filter.
      </p>
      <button type="button" onClick={onClear} className={`${btn} mt-5`}>
        Clear filters
      </button>
    </Frame>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Frame icon={<AlertIcon />} title="Something went wrong" tone="danger">
      <p className="mx-auto mt-1.5 max-w-md text-[13px] text-ink-3">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={`${btn} mt-5`}>
          <RetryIcon size={14} />
          Try again
        </button>
      )}
    </Frame>
  );
}
