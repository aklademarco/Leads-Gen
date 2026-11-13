import { useCallback, useId, useRef, useState } from "react";
import Popover from "./Popover";
import { CheckIcon, ChevronDownIcon } from "./icons";
import { STATUSES, STATUS_META, statusOf } from "../lib/format";

export function StatusDot({ status, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-1.5 shrink-0 rounded-full ${STATUS_META[status].dot} ${className}`}
    />
  );
}

export default function StatusMenu({ lead, onChange, size = "md" }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const menuId = useId();
  const current = statusOf(lead);
  const meta = STATUS_META[current];
  const close = useCallback(() => setOpen(false), []);

  const pick = (s) => {
    setOpen(false);
    anchorRef.current?.focus();
    if (s !== current) onChange(lead._id, s);
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Status: ${meta.label}. Change status`}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-[filter] hover:brightness-[0.97] ${meta.pill} ${
          size === "sm" ? "h-6 pl-2 pr-1.5 text-[12px]" : "h-7 pl-2.5 pr-2 text-[12px]"
        }`}
      >
        <StatusDot status={current} />
        {meta.label}
        <ChevronDownIcon size={12} className="opacity-70" />
      </button>
      <Popover
        anchorRef={anchorRef}
        open={open}
        onClose={close}
        align="start"
        label="Set status"
        className="w-44"
        id={menuId}
      >
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              role="menuitemradio"
              aria-checked={s === current}
              onClick={() => pick(s)}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-ink-2 outline-none hover:bg-subtle hover:text-ink focus-visible:bg-subtle focus-visible:text-ink focus-visible:outline-none"
            >
              <StatusDot status={s} />
              <span className="flex-1">{STATUS_META[s].label}</span>
              {s === current && <CheckIcon size={14} className="text-ink-3" />}
            </button>
          ))}
      </Popover>
    </>
  );
}
