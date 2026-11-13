import { useState } from "react";
import { BuildingIcon, StarIcon } from "./icons";
import { initials, photoUrl } from "../lib/format";

/** Fallback when a business has no photo (or it fails to load). */
export function CompanyIcon({ name }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-subtle">
      <div className="flex size-12 items-center justify-center rounded-lg border border-line bg-surface font-mono text-[14px] font-medium tracking-wide text-ink-2">
        {initials(name)}
      </div>
      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] text-ink-3">
        <BuildingIcon size={12} />
        No photo
      </div>
    </div>
  );
}

/** 16:10 photo via the server's Places photo proxy. */
export function LeadImage({ lead }) {
  const [failed, setFailed] = useState(false);
  const src = photoUrl(lead.photo);
  return (
    <div className="aspect-[16/10] w-full overflow-hidden border-b border-line bg-subtle">
      {!src || failed ? (
        <CompanyIcon name={lead.name} />
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

/** 32px square thumbnail for table rows. */
export function LeadThumb({ lead }) {
  const [failed, setFailed] = useState(false);
  const src = photoUrl(lead.photo);
  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-md border border-line bg-subtle font-mono text-[10px] font-medium text-ink-3"
      >
        {initials(lead.name)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="size-8 shrink-0 rounded-md border border-line object-cover"
    />
  );
}

export function Rating({ rating, reviewCount, compact = false }) {
  if (!rating) return <span className="text-[12px] text-ink-3">No rating</span>;
  const full = Math.round(rating);
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[12px]"
      aria-label={`Rated ${rating} out of 5${reviewCount ? ` from ${reviewCount} reviews` : ""}`}
    >
      {compact ? (
        <StarIcon filled className="text-star" />
      ) : (
        <span className="flex gap-px text-star" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon key={i} filled={i <= full} className={i <= full ? "" : "text-line-strong"} />
          ))}
        </span>
      )}
      <span className="font-medium tabular-nums text-ink">{Number(rating).toFixed(1)}</span>
      {reviewCount ? (
        <span className="font-mono text-[11px] text-ink-3">({reviewCount})</span>
      ) : null}
    </span>
  );
}

export function OpenState({ openNow }) {
  if (openNow === null || openNow === undefined) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] ${
        openNow ? "text-accent" : "text-ink-3"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${openNow ? "bg-accent" : "bg-line-strong"}`}
      />
      {openNow ? "Open now" : "Closed"}
    </span>
  );
}
