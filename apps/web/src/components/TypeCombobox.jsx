import { useId, useMemo, useRef, useState } from "react";
import { BUSINESS_TYPES } from "../lib/businessTypes";
import { capitalize } from "../lib/format";
import { BuildingIcon } from "./icons";

function rank(query) {
  const q = query.trim().toLowerCase();
  if (!q) return BUSINESS_TYPES;
  const starts = [];
  const contains = [];
  for (const t of BUSINESS_TYPES) {
    if (t.startsWith(q) || t.split(" ").some((w) => w.startsWith(q))) starts.push(t);
    else if (t.includes(q)) contains.push(t);
  }
  return [...starts, ...contains];
}

/**
 * ARIA 1.2 combobox for business type. Free text is allowed; suggestions are
 * a convenience. `inputRef` lets the parent focus it (the "/" shortcut).
 */
export default function TypeCombobox({ value, onChange, inputRef, className = "" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const listRef = useRef(null);
  const options = useMemo(() => rank(value), [value]);
  const showList = open && options.length > 0;

  const select = (opt) => {
    onChange(opt);
    setOpen(false);
    setActive(-1);
  };

  const move = (delta) => {
    if (!options.length) return;
    const n = options.length;
    const next =
      !open || active < 0
        ? delta > 0
          ? 0
          : n - 1
        : (active + delta + n) % n;
    setOpen(true);
    setActive(next);
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Enter":
        if (showList && active >= 0) {
          e.preventDefault();
          select(options[active]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          setActive(-1);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={`${listId}-input`} className="sr-only">
        Business type
      </label>
      <div className="flex h-10 items-center gap-2 px-3">
        <BuildingIcon className="text-ink-3" />
        <input
          id={`${listId}-input`}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          value={value}
          placeholder="Business type, e.g. pharmacy"
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="h-full w-full min-w-0 bg-transparent text-[13px] text-ink placeholder:text-ink-3 focus:outline-none"
        />
        <kbd className="hidden rounded border border-line px-1.5 font-mono text-[10px] leading-4 text-ink-3 sm:inline">
          /
        </kbd>
      </div>
      <ul
        id={listId}
        ref={listRef}
        role="listbox"
        aria-label="Business types"
        hidden={!showList}
        className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-lg border border-line bg-surface p-1 shadow-pop"
      >
        {options.map((opt, i) => (
          <li
            key={opt}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            // mousedown (not click) so the input doesn't blur first
            onMouseDown={(e) => {
              e.preventDefault();
              select(opt);
            }}
            onMouseMove={() => active !== i && setActive(i)}
            className={`cursor-pointer rounded-md px-2.5 py-1.5 text-[13px] ${
              i === active ? "bg-subtle text-ink" : "text-ink-2"
            }`}
          >
            {capitalize(opt)}
          </li>
        ))}
      </ul>
    </div>
  );
}
