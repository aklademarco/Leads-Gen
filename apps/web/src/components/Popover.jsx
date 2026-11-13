import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Floating panel anchored to `anchorRef`, rendered in a portal so it is never
 * clipped by scroll containers. Handles outside-click, Escape, flipping above
 * the anchor when there is no room below, and arrow-key navigation between
 * `[role^="menuitem"]` children.
 *
 * `focusKey` — change it to re-run initial focus (e.g. when switching panes).
 */
export default function Popover({
  anchorRef,
  open,
  onClose,
  align = "end",
  focusKey,
  className = "",
  label,
  role = "menu",
  id,
  children,
}) {
  const panelRef = useRef(null);

  // Position (mutates style directly; no state needed).
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const r = anchor.getBoundingClientRect();
      const pw = panel.offsetWidth;
      const ph = panel.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left = align === "end" ? r.right - pw : r.left;
      left = Math.max(8, Math.min(left, vw - pw - 8));
      let top = r.bottom + 6;
      if (top + ph > vh - 8 && r.top - ph - 6 > 8) top = r.top - ph - 6;
      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top)}px`;
      panel.style.visibility = "visible";
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(panelRef.current);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef, align]);

  // Dismiss on outside pointer / Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (
        panelRef.current?.contains(e.target) ||
        anchorRef.current?.contains(e.target)
      )
        return;
      onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        anchorRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  // Initial focus.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const target =
      panel.querySelector("[data-autofocus]") ||
      panel.querySelector('[aria-checked="true"]') ||
      panel.querySelector('[role^="menuitem"]');
    target?.focus();
  }, [open, focusKey]);

  if (!open) return null;

  const onKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const items = [
      ...panelRef.current.querySelectorAll(
        '[role^="menuitem"]:not([disabled])',
      ),
    ];
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement);
    let next = 0;
    if (e.key === "ArrowDown") next = i < 0 ? 0 : (i + 1) % items.length;
    if (e.key === "ArrowUp")
      next = i < 0 ? items.length - 1 : (i - 1 + items.length) % items.length;
    if (e.key === "End") next = items.length - 1;
    items[next].focus();
  };

  return createPortal(
    <div
      ref={panelRef}
      id={id}
      role={role}
      aria-label={label}
      onKeyDown={onKeyDown}
      style={{ position: "fixed", top: 0, left: 0, visibility: "hidden" }}
      className={`z-50 rounded-lg border border-line bg-surface p-1 text-[13px] text-ink shadow-pop ${className}`}
    >
      {children}
    </div>,
    document.body,
  );
}

export function MenuItem({ icon, children, danger, className = "", ...rest }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left outline-none transition-colors ${
        danger
          ? "text-danger hover:bg-danger-soft focus-visible:bg-danger-soft"
          : "text-ink-2 hover:bg-subtle hover:text-ink focus-visible:bg-subtle focus-visible:text-ink"
      } focus-visible:outline-none ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
