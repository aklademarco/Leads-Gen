import StatusMenu from "./StatusMenu";
import LeadActions from "./LeadActions";
import { LeadThumb, Rating } from "./LeadMedia";
import { ChatIcon, MapIcon, PhoneIcon } from "./icons";
import { mapsUrl, relativeTime } from "../lib/format";
import { telUrl, whatsAppUrl } from "../lib/phone";

const th =
  "sticky top-0 z-10 border-b border-line bg-surface px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-ink-3";
const iconLink =
  "inline-flex size-7 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-canvas hover:text-ink";

function Shell({ children }) {
  return (
    <div className="overflow-clip rounded-xl border border-line bg-surface shadow-card">
      <table className="w-full border-separate border-spacing-0 text-[13px]">
        <thead>
          <tr>
            <th className={`${th} pl-4`}>Business</th>
            <th className={`${th} hidden md:table-cell`}>Phone</th>
            <th className={`${th} hidden sm:table-cell`}>Rating</th>
            <th className={th}>Status</th>
            <th className={`${th} hidden lg:table-cell`}>Added</th>
            <th className={`${th} w-12 pr-4`}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="[&>tr:first-child>td]:border-t-0 [&>tr>td]:border-t [&>tr>td]:border-line">{children}</tbody>
      </table>
    </div>
  );
}

export default function LeadTable({ leads, onUpdateStatus, onSaveNote, onDelete }) {
  return (
    <Shell>
      {leads.map((lead) => {
        const tel = telUrl(lead.phone);
        const wa = whatsAppUrl(lead.phone);
        return (
          <tr key={lead._id} className="transition-colors hover:bg-subtle/60">
            <td className="max-w-0 py-2.5 pl-4 pr-3 sm:w-[44%]">
              <div className="flex min-w-0 items-center gap-3">
                <LeadThumb lead={lead} />
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate font-medium text-ink" title={lead.name}>
                      {lead.name}
                    </span>
                    <a
                      href={mapsUrl(lead)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${lead.name} in Google Maps`}
                      className="shrink-0 text-ink-3 hover:text-ink"
                    >
                      <MapIcon size={13} />
                    </a>
                  </div>
                  <div
                    className="truncate text-[12px] text-ink-3"
                    title={lead.address || undefined}
                  >
                    {lead.address || "Address unavailable"}
                  </div>
                  {lead.notes?.trim() && (
                    <div className="mt-0.5 truncate text-[12px] italic text-ink-2" title={lead.notes}>
                      {lead.notes}
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2.5 md:table-cell">
              {lead.phone ? (
                <div className="flex items-center gap-1">
                  <span className="mr-1 font-mono text-[12px] text-ink-2">{lead.phone}</span>
                  {tel && (
                    <a href={tel} className={iconLink} aria-label={`Call ${lead.name}`}>
                      <PhoneIcon size={14} />
                    </a>
                  )}
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer"
                      className={iconLink}
                      aria-label={`WhatsApp ${lead.name}`}
                    >
                      <ChatIcon size={14} />
                    </a>
                  )}
                </div>
              ) : (
                <span className="text-ink-3">—</span>
              )}
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2.5 sm:table-cell">
              <Rating rating={lead.rating} reviewCount={lead.reviewCount} compact />
            </td>
            <td className="whitespace-nowrap px-3 py-2.5">
              <StatusMenu lead={lead} onChange={onUpdateStatus} size="sm" />
            </td>
            <td className="hidden whitespace-nowrap px-3 py-2.5 text-[12px] text-ink-3 lg:table-cell">
              <time dateTime={lead.createdAt} title={lead.createdAt ? new Date(lead.createdAt).toLocaleString("en-GB") : undefined}>
                {relativeTime(lead.createdAt)}
              </time>
            </td>
            <td className="py-2.5 pl-3 pr-4 text-right">
              <LeadActions lead={lead} onSaveNote={onSaveNote} onDelete={onDelete} />
            </td>
          </tr>
        );
      })}
    </Shell>
  );
}

export function LeadTableSkeleton({ rows = 8 }) {
  return (
    <Shell>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i} aria-hidden="true">
          <td className="py-3 pl-4 pr-3">
            <div className="flex items-center gap-3">
              <div className="skeleton size-8 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3 w-2/5 rounded" />
                <div className="skeleton h-2.5 w-3/5 rounded" />
              </div>
            </div>
          </td>
          <td className="hidden px-3 md:table-cell">
            <div className="skeleton h-3 w-24 rounded" />
          </td>
          <td className="hidden px-3 sm:table-cell">
            <div className="skeleton h-3 w-14 rounded" />
          </td>
          <td className="px-3">
            <div className="skeleton h-6 w-20 rounded-md" />
          </td>
          <td className="hidden px-3 lg:table-cell">
            <div className="skeleton h-3 w-12 rounded" />
          </td>
          <td className="pr-4" />
        </tr>
      ))}
    </Shell>
  );
}
