import { useEffect } from "react";
import { CloseIcon } from "./icons";

const DURATION = 3500;

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), toast.duration ?? DURATION);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div className="animate-rise pointer-events-auto flex min-h-10 w-full max-w-sm items-center gap-3 rounded-lg bg-ink py-2 pl-3.5 pr-1.5 text-[13px] text-white shadow-pop">
      {toast.tone === "error" && (
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#e0786f]" />
      )}
      <span className="flex-1 leading-snug">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action.onClick();
            onDismiss(toast.id);
          }}
          className="h-7 shrink-0 rounded-md px-2 text-[13px] font-medium text-[#8fd3b6] hover:bg-white/10"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
      >
        <CloseIcon size={13} />
      </button>
    </div>
  );
}

export default function Toasts({ toasts, onDismiss }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 left-4 z-[60] flex flex-col items-end gap-2 sm:left-auto"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
