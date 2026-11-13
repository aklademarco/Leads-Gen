import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  GHANA_REGIONS,
  POPULAR_PLACES,
  toLabel,
  toQuery,
} from "../data/ghanaPlaces";

const API =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1/leads";

const DEBOUNCE_MS = 250;
const MAX_LOCAL_MATCHES = 40;

const ALL_PLACES = GHANA_REGIONS.flatMap((r) => r.places);

function localValue(place) {
  return { label: toLabel(place), query: toQuery(place), placeId: null };
}

function matchLocal(q) {
  const needle = q.toLowerCase();
  const scored = [];
  for (const place of ALL_PLACES) {
    const name = place.name.toLowerCase();
    let score = -1;
    if (name.startsWith(needle)) score = 0;
    else if (name.includes(needle)) score = 1;
    else if (place.area?.toLowerCase().includes(needle)) score = 2;
    else if (place.region.toLowerCase().includes(needle)) score = 3;
    if (score >= 0) scored.push({ place, score });
  }
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, MAX_LOCAL_MATCHES).map((s) => s.place);
}

function PinIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 1 0-9 0c0 3.8 4.5 8 4.5 8Z" />
      <circle cx="8" cy="6.5" r="1.6" />
    </svg>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3 3" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

function XIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" />
    </svg>
  );
}

function Spinner({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`motion-safe:animate-spin ${className}`}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.75"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionHeader({ id, children, aside }) {
  return (
    <div
      id={id}
      className="flex items-center justify-between px-3 pt-3 pb-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-3"
    >
      <span>{children}</span>
      {aside}
    </div>
  );
}

/**
 * Location combobox for picking any place in Ghana.
 *
 * value: { label, query, placeId } | null
 *   - label:   what to display ("Osu, Accra")
 *   - query:   geocode-friendly string to send as `location` ("Osu, Accra, Ghana")
 *   - placeId: Google place id when picked from Google suggestions, else null
 */
export default function LocationPicker({ value, onChange, className = "" }) {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listId = `${baseId}-list`;
  const optionId = (i) => `${baseId}-opt-${i}`;

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  // True once the user has typed since the input was last synced to `value`.
  const [typed, setTyped] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  // Google results, tagged with the query they belong to so stale ones are ignored.
  const [remote, setRemote] = useState({ q: "", predictions: [], error: false });

  const q = typed ? text.trim() : "";
  const wantsRemote = q.length >= 2 && q.length <= 100;
  const remoteReady = wantsRemote && remote.q === q;
  const loading = wantsRemote && !remoteReady;

  // Debounced Google autocomplete with abort on change.
  useEffect(() => {
    if (!wantsRemote || !open) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API}/places/autocomplete?input=${encodeURIComponent(q)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRemote({ q, predictions: data.predictions || [], error: false });
      } catch (err) {
        if (err.name === "AbortError") return;
        setRemote({ q, predictions: [], error: true });
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, wantsRemote, open]);

  // Build visible sections and a flat option list for keyboard navigation.
  const { sections, options } = useMemo(() => {
    const opts = [];
    const add = (opt) => {
      opts.push(opt);
      return opts.length - 1;
    };

    if (!q) {
      const secs = [
        {
          key: "popular",
          title: "Popular",
          layout: "chips",
          items: POPULAR_PLACES.map((place) => ({
            index: add({ kind: "local", place, value: localValue(place) }),
            place,
          })),
        },
        ...GHANA_REGIONS.map((r) => ({
          key: `region-${r.region}`,
          title: r.region,
          layout: "rows",
          items: r.places.map((place) => ({
            index: add({ kind: "local", place, value: localValue(place) }),
            place,
          })),
        })),
      ];
      return { sections: secs, options: opts };
    }

    const local = matchLocal(q);
    const secs = [];
    if (local.length) {
      secs.push({
        key: "matches",
        title: "Places",
        layout: "rows",
        showRegion: true,
        items: local.map((place) => ({
          index: add({ kind: "local", place, value: localValue(place) }),
          place,
        })),
      });
    }

    if (remoteReady && remote.predictions.length) {
      const localNames = new Set(local.map((pl) => pl.name.toLowerCase()));
      const preds = remote.predictions.filter(
        (pr) => !localNames.has((pr.mainText || "").toLowerCase()),
      );
      if (preds.length) {
        secs.push({
          key: "google",
          title: "From Google Maps",
          layout: "google",
          items: preds.map((pred) => ({
            index: add({
              kind: "google",
              pred,
              value: {
                label: pred.mainText,
                query: pred.description,
                placeId: pred.placeId,
              },
            }),
            pred,
          })),
        });
      }
    }
    return { sections: secs, options: opts };
  }, [q, remoteReady, remote.predictions]);

  const active = highlight >= 0 && highlight < options.length ? highlight : -1;

  // Keep the highlighted option visible.
  useEffect(() => {
    if (!open || active < 0) return;
    document
      .getElementById(optionId(active))
      ?.scrollIntoView({ block: "nearest" });
    // optionId is derived from a stable useId value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  const isSelected = (opt) => {
    if (!value) return false;
    if (opt.kind === "google") return value.placeId === opt.value.placeId;
    return !value.placeId && value.query === opt.value.query;
  };

  function openMenu() {
    if (!open) {
      setOpen(true);
      setHighlight(-1);
    }
  }

  function select(next) {
    onChange?.(next);
    setTyped(false);
    setText("");
    setOpen(false);
    setHighlight(-1);
  }

  function commitFreeText() {
    const t = text.trim();
    if (t) {
      select({ label: t, query: `${t}, Ghana`, placeId: null });
    } else {
      select(null);
    }
  }

  // Close without an explicit choice. Typed text is committed so the parent's
  // value never silently disagrees with what the input shows.
  function dismiss() {
    if (typed && text.trim() !== (value?.label ?? "")) {
      commitFreeText();
    } else {
      setTyped(false);
      setOpen(false);
      setHighlight(-1);
    }
  }

  // Click outside closes.
  const dismissRef = useRef(dismiss);
  useEffect(() => {
    dismissRef.current = dismiss;
  });
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!containerRef.current?.contains(e.target)) dismissRef.current();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  function onKeyDown(e) {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (!open) return openMenu();
        if (options.length)
          setHighlight(active < 0 ? 0 : (active + 1) % options.length);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (!open) return openMenu();
        if (options.length)
          setHighlight(active <= 0 ? options.length - 1 : active - 1);
        break;
      }
      case "Home":
      case "End": {
        if (!open || !options.length) return;
        e.preventDefault();
        setHighlight(e.key === "Home" ? 0 : options.length - 1);
        break;
      }
      case "Enter": {
        if (open && active >= 0) {
          e.preventDefault();
          select(options[active].value);
        } else if (typed && text.trim()) {
          e.preventDefault();
          commitFreeText();
        } else if (open) {
          e.preventDefault();
          setOpen(false);
        }
        // Otherwise let Enter bubble (e.g. to submit a surrounding form).
        break;
      }
      case "Escape": {
        if (open || typed) {
          e.preventDefault();
          setTyped(false);
          setOpen(false);
          setHighlight(-1);
        }
        break;
      }
      case "Tab": {
        if (open || typed) dismiss();
        break;
      }
      default:
        break;
    }
  }

  function clear() {
    onChange?.(null);
    setText("");
    setTyped(true);
    setHighlight(-1);
    setOpen(true);
    inputRef.current?.focus();
  }

  const inputValue = typed ? text : (value?.label ?? "");
  const showClear = Boolean(inputValue);
  const empty =
    Boolean(q) && !options.length && !loading;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <PinIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
          aria-label="Location in Ghana"
          autoComplete="off"
          spellCheck={false}
          placeholder="Any place in Ghana"
          value={inputValue}
          onChange={(e) => {
            setText(e.target.value);
            setTyped(true);
            setHighlight(-1);
            setOpen(true);
          }}
          onFocus={(e) => {
            openMenu();
            e.target.select();
          }}
          onClick={openMenu}
          onKeyDown={onKeyDown}
          className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-9 text-[13px] text-ink placeholder:text-ink-3 outline-none transition-colors hover:border-line-strong focus:border-accent focus:ring-2 focus:ring-accent/20 focus-visible:outline-none"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {open && loading && <Spinner className="size-3.5 text-ink-3" />}
          {showClear && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear location"
              className="grid size-6 place-items-center rounded-md text-ink-3 hover:bg-subtle hover:text-ink-2"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[22rem] overflow-hidden rounded-xl border border-line bg-surface text-[13px] shadow-pop"
        >
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Locations"
            className="max-h-[22rem] overflow-y-auto overscroll-contain pb-1.5"
            onMouseDown={(e) => e.preventDefault()}
          >
            {sections.map((sec) => {
              const headerId = `${baseId}-${sec.key}`;
              return (
                <div key={sec.key} role="group" aria-labelledby={headerId}>
                  <SectionHeader
                    id={headerId}
                    aside={
                      sec.layout === "google" ? null : sec.key === "matches" ? (
                        <span className="normal-case tracking-normal">
                          {sec.items.length}
                        </span>
                      ) : null
                    }
                  >
                    {sec.title}
                  </SectionHeader>

                  {sec.layout === "chips" ? (
                    <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                      {sec.items.map(({ index, place }) => {
                        const opt = options[index];
                        const selected = isSelected(opt);
                        return (
                          <div
                            key={index}
                            id={optionId(index)}
                            role="option"
                            aria-selected={selected}
                            onMouseMove={() =>
                              active !== index && setHighlight(index)
                            }
                            onClick={() => select(opt.value)}
                            className={`inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border px-2.5 text-[12.5px] ${
                              selected
                                ? "border-accent/40 bg-accent-soft text-accent"
                                : active === index
                                  ? "border-line-strong bg-subtle text-ink"
                                  : "border-line text-ink-2"
                            }`}
                          >
                            {selected && <CheckIcon className="size-3" />}
                            {place.name}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-1.5">
                      {sec.items.map((item) => {
                        const { index } = item;
                        const opt = options[index];
                        const selected = isSelected(opt);
                        let primary;
                        let secondary;
                        if (opt.kind === "google") {
                          primary = item.pred.mainText;
                          secondary = item.pred.secondaryText;
                        } else {
                          const pl = item.place;
                          primary = pl.name;
                          const area =
                            pl.area && pl.area !== pl.name ? pl.area : "";
                          secondary = sec.showRegion
                            ? [area, pl.region].filter(Boolean).join(" · ")
                            : area;
                        }
                        return (
                          <div
                            key={index}
                            id={optionId(index)}
                            role="option"
                            aria-selected={selected}
                            onMouseMove={() =>
                              active !== index && setHighlight(index)
                            }
                            onClick={() => select(opt.value)}
                            className={`flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2 ${
                              active === index ? "bg-subtle" : ""
                            }`}
                          >
                            {opt.kind === "google" ? (
                              <SearchIcon className="size-3.5 shrink-0 text-ink-3" />
                            ) : (
                              <PinIcon className="size-3.5 shrink-0 text-ink-3" />
                            )}
                            <span className="min-w-0 flex-1 truncate">
                              <span
                                className={selected ? "text-accent" : "text-ink"}
                              >
                                {primary}
                              </span>
                              {secondary && (
                                <span className="ml-2 text-ink-3">
                                  {secondary}
                                </span>
                              )}
                            </span>
                            {selected && (
                              <CheckIcon className="size-3.5 shrink-0 text-accent" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {q && loading && (
              <div className="flex items-center gap-2 px-3 py-2.5 text-ink-3">
                <Spinner className="size-3.5" />
                Searching Google Maps…
              </div>
            )}

            {q && remoteReady && remote.error && (
              <div className="px-3 py-2 text-[12px] text-ink-3">
                Google Maps suggestions are unavailable right now.
              </div>
            )}

            {empty && (
              <div className="px-3 py-6 text-center text-ink-2">
                No matches. Press{" "}
                <kbd className="rounded border border-line bg-subtle px-1 font-mono text-[11px] text-ink-2">
                  Enter
                </kbd>{" "}
                to search{" "}
                <span className="font-medium text-ink">
                  &ldquo;{text.trim()}&rdquo;
                </span>{" "}
                anyway.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
