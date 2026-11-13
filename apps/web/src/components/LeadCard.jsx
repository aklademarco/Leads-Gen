import { useState } from "react";

const API =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1/leads";

function CompanyIcon() {
  return (
    <div className="w-full h-36 bg-[#0d1117] border-b border-[#1e2a35] flex items-center justify-center">
      <div className="w-14 h-14 rounded-xl bg-[#141e28] border border-[#1e2a35] flex items-center justify-center text-[#4d6273]">
        {/* building / storefront */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 9h1M14 9h1M9 13h1M14 13h1" />
          <path d="M10 21v-4h4v4" />
        </svg>
      </div>
    </div>
  );
}

function LeadImage({ lead }) {
  const [failed, setFailed] = useState(false);
  if (!lead.photo || failed) return <CompanyIcon />;
  return (
    <div className="w-full h-36 overflow-hidden bg-[#0d1117] border-b border-[#1e2a35]">
      <img
        src={`${API}/photo?ref=${encodeURIComponent(lead.photo)}`}
        alt={lead.name}
        loading="lazy"
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function Stars({ rating, reviewCount }) {
  if (!rating)
    return <span className="text-[10px] text-[#3d5060] italic">No rating</span>;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-2.5 h-2.5 ${i <= Math.floor(rating) ? "text-[#c8c060]" : "text-[#3d5060]"}`}
          viewBox="0 0 12 12"
        >
          <path
            d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5l3.5-.5z"
            fill={i <= Math.floor(rating) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      ))}
      <span className="font-mono text-[10px] text-[#7a8fa0] ml-1">
        {rating}
      </span>
      {reviewCount && (
        <span className="font-mono text-[10px] text-[#3d5060]">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

const statusStyles = {
  new: "bg-white/5 text-[#7a8fa0] border border-[#1e2a35]",
  contacted: "bg-blue-900/20 text-[#7aa8d0] border border-blue-900/30",
  interested: "bg-green-900/20 text-[#6ab58a] border border-green-900/30",
  closed: "bg-red-900/20 text-[#c07070] border border-red-900/30",
};

export default function LeadCard({ lead, index, onUpdateStatus, onDelete }) {
  return (
    <div
      className="bg-[#0d1117]/80 border border-[#1e2a35] rounded-xl overflow-hidden hover:border-[#243040] hover:bg-[#111820]/95 hover:-translate-y-0.5 transition-all cursor-pointer relative"
      style={{
        animation: `fadeUp 0.35s ease both`,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />

      {/* Business photo from Google, or a company icon if it has none */}
      <LeadImage lead={lead} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="text-[13px] font-medium text-[#e8edf2] leading-snug flex-1 pr-2">
            {lead.name}
          </div>
          <span
            className={`font-mono text-[9px] tracking-wide px-2 py-1 rounded-full uppercase shrink-0 ${statusStyles[lead.status || "new"]}`}
          >
            {lead.status || "new"}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1 text-[11px] text-[#7a8fa0] mb-2">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="mt-0.5 shrink-0 opacity-50"
          >
            <path
              d="M5 1C3.3 1 2 2.3 2 4c0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="5" cy="4" r="1" fill="currentColor" />
          </svg>
          {lead.address || "Address unavailable"}
        </div>

        {/* Phone */}
        {lead.phone && (
          <div className="flex items-center gap-1 text-[11px] text-[#7a8fa0] mb-2">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="shrink-0 opacity-50"
            >
              <path
                d="M2 1h2l1 2.5-1.5 1a6 6 0 002 2l1-1.5L9 7v2a1 1 0 01-1 1A8 8 0 011 2a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
            <a
              href={`tel:${lead.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-white transition-colors"
            >
              {lead.phone}
            </a>
          </div>
        )}

        {/* Open/Closed */}
        {lead.openNow !== null && lead.openNow !== undefined && (
          <div className="mb-2">
            <span
              className={`font-mono text-[9px] px-2 py-0.5 rounded tracking-wide ${
                lead.openNow
                  ? "bg-green-900/20 text-[#6ab58a] border border-green-900/30"
                  : "bg-red-900/20 text-[#c07070] border border-red-900/30"
              }`}
            >
              {lead.openNow ? "Open now" : "Closed"}
            </span>
          </div>
        )}

        <div className="h-px bg-[#1e2a35] my-3" />

        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <Stars rating={lead.rating} reviewCount={lead.reviewCount} />
          <span className="font-mono text-[9px] text-[#3d5060] bg-[#141e28] border border-[#1e2a35] px-2 py-0.5 rounded uppercase tracking-wide">
            Lead
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <button
            onClick={() => onUpdateStatus(lead._id, "contacted")}
            className="flex-1 py-1.5 rounded-md text-[10px] font-mono tracking-wide border border-[#1e2a35] text-[#7a8fa0] hover:bg-[#111820] hover:text-[#e8edf2] hover:border-[#243040] transition-all"
          >
            Contact
          </button>
          <button
            onClick={() => onUpdateStatus(lead._id, "interested")}
            className="flex-1 py-1.5 rounded-md text-[10px] font-mono tracking-wide border border-[#1e2a35] text-[#7a8fa0] hover:bg-[#111820] hover:text-[#e8edf2] hover:border-[#243040] transition-all"
          >
            Interested
          </button>
          <button
            onClick={() => onDelete(lead._id)}
            className="flex-1 py-1.5 rounded-md text-[10px] font-mono tracking-wide bg-white text-black font-medium hover:bg-[#e0e8f0] transition-all"
          >
            Remove
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
