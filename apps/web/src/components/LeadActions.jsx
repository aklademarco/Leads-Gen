import { useCallback, useRef, useState } from "react";
import Popover, { MenuItem } from "./Popover";
import { MoreIcon, NoteIcon, TrashIcon } from "./icons";

/**
 * Overflow ("…") menu for a lead: add/edit note, remove (with inline confirm).
 */
export default function LeadActions({ lead, onSaveNote, onDelete }) {
  const [mode, setMode] = useState(null); // null | "menu" | "note" | "confirm"
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const anchorRef = useRef(null);
  const close = useCallback(() => setMode(null), []);
  const hasNote = Boolean(lead.notes?.trim());

  const openNote = () => {
    setDraft(lead.notes || "");
    setMode("note");
  };

  const saveNote = async (e) => {
    e.preventDefault();
    const next = draft.trim();
    if (next === (lead.notes || "").trim()) {
      setMode(null);
      return;
    }
    setMode(null);
    anchorRef.current?.focus();
    await onSaveNote(lead._id, next);
  };

  const remove = async () => {
    setBusy(true);
    const ok = await onDelete(lead._id);
    setBusy(false);
    if (!ok) setMode(null);
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={mode !== null}
        aria-label={`More actions for ${lead.name}`}
        onClick={() => setMode((m) => (m ? null : "menu"))}
        className={`inline-flex size-7 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-subtle hover:text-ink ${
          mode ? "bg-subtle text-ink" : ""
        }`}
      >
        <MoreIcon />
      </button>

      <Popover
        anchorRef={anchorRef}
        open={mode !== null}
        onClose={close}
        focusKey={mode}
        role={mode === "menu" ? "menu" : "dialog"}
        label={
          mode === "note"
            ? "Note"
            : mode === "confirm"
              ? "Confirm removal"
              : "Lead actions"
        }
        className={mode === "note" ? "w-72" : "w-52"}
      >
        {mode === "menu" && (
          <>
            <MenuItem icon={<NoteIcon className="text-ink-3" />} onClick={openNote}>
              {hasNote ? "Edit note" : "Add note"}
            </MenuItem>
            <div className="my-1 h-px bg-line" role="separator" />
            <MenuItem
              danger
              icon={<TrashIcon />}
              onClick={() => setMode("confirm")}
            >
              Remove lead
            </MenuItem>
          </>
        )}

        {mode === "confirm" && (
          <div className="p-2">
            <p className="text-[13px] font-medium text-ink">Remove this lead?</p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-3">
              {lead.name} will be deleted from your saved leads.
            </p>
            <div className="mt-3 flex justify-end gap-1.5">
              <button
                type="button"
                data-autofocus
                onClick={() => setMode("menu")}
                className="h-7 rounded-md border border-line px-2.5 text-[12px] font-medium text-ink-2 hover:bg-subtle"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="h-7 rounded-md bg-danger px-2.5 text-[12px] font-medium text-white hover:brightness-95 disabled:opacity-60"
              >
                {busy ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        )}

        {mode === "note" && (
          <form onSubmit={saveNote} className="p-1.5">
            <label
              htmlFor={`note-${lead._id}`}
              className="mb-1.5 block text-[12px] font-medium text-ink-2"
            >
              Note
            </label>
            <textarea
              id={`note-${lead._id}`}
              data-autofocus
              rows={4}
              value={draft}
              maxLength={1000}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveNote(e);
              }}
              placeholder="Spoke to the owner, call back Monday…"
              className="block w-full resize-none rounded-md border border-line bg-surface px-2.5 py-2 text-[13px] leading-relaxed text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-ink-3">
                <kbd className="font-mono">Ctrl</kbd>+
                <kbd className="font-mono">Enter</kbd> to save
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={close}
                  className="h-7 rounded-md px-2.5 text-[12px] font-medium text-ink-2 hover:bg-subtle"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 rounded-md bg-accent px-2.5 text-[12px] font-medium text-white hover:bg-accent-hover"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      </Popover>
    </>
  );
}
