import StatusMenu from "./StatusMenu";
import LeadActions from "./LeadActions";
import { LeadImage, OpenState, Rating } from "./LeadMedia";
import { ChatIcon, MapIcon, PhoneIcon, PinIcon } from "./icons";
import { mapsUrl } from "../lib/format";
import { telUrl, whatsAppUrl } from "../lib/phone";

const actionCls =
  "flex h-9 flex-1 items-center justify-center gap-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-subtle hover:text-ink";

export default function LeadCard({ lead, index = 0, onUpdateStatus, onSaveNote, onDelete }) {
  const tel = telUrl(lead.phone);
  const wa = whatsAppUrl(lead.phone);

  return (
    <article
      className="animate-rise flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-colors hover:border-line-strong"
      style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
    >
      <LeadImage lead={lead} />

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[14px] font-medium leading-snug text-ink" title={lead.name}>
          {lead.name}
        </h3>

        <p
          className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-3"
          title={lead.address || undefined}
        >
          <PinIcon size={13} />
          <span className="truncate">{lead.address || "Address unavailable"}</span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Rating rating={lead.rating} reviewCount={lead.reviewCount} />
          <OpenState openNow={lead.openNow} />
        </div>

        {lead.phone && (
          <p className="mt-2 font-mono text-[12px] text-ink-2">{lead.phone}</p>
        )}

        {lead.notes?.trim() && (
          <blockquote className="mt-3 line-clamp-3 border-l-2 border-line-strong pl-2.5 text-[12px] leading-relaxed text-ink-2">
            {lead.notes}
          </blockquote>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <StatusMenu lead={lead} onChange={onUpdateStatus} />
          <LeadActions lead={lead} onSaveNote={onSaveNote} onDelete={onDelete} />
        </div>
      </div>

      <div className="flex divide-x divide-line border-t border-line">
        {tel && (
          <a href={tel} className={actionCls} aria-label={`Call ${lead.name}`}>
            <PhoneIcon size={14} className="text-ink-3" />
            Call
          </a>
        )}
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className={actionCls}
            aria-label={`WhatsApp ${lead.name}`}
          >
            <ChatIcon size={14} className="text-ink-3" />
            WhatsApp
          </a>
        )}
        <a
          href={mapsUrl(lead)}
          target="_blank"
          rel="noreferrer"
          className={actionCls}
          aria-label={`Open ${lead.name} in Google Maps`}
        >
          <MapIcon size={14} className="text-ink-3" />
          Map
        </a>
      </div>
    </article>
  );
}

export function LeadCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card" aria-hidden="true">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-3.5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="flex justify-between pt-3">
          <div className="skeleton h-7 w-24 rounded-md" />
          <div className="skeleton size-7 rounded-md" />
        </div>
      </div>
      <div className="h-9 border-t border-line" />
    </div>
  );
}
