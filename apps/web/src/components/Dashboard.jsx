import LeadCard from "./LeadCard";

const FILTERS = ["all", "new", "contacted", "interested", "closed"];

export default function Dashboard({
  leads,
  loading,
  filter,
  setFilter,
  searchInfo,
  onUpdateStatus,
  onDelete,
}) {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Topbar */}
      <div className="px-7 py-4 border-b border-[#1e2a35] flex items-center justify-between bg-[#080c10]/70 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-[16px] font-medium text-[#e8edf2]">
            Lead Dashboard
          </h1>
          <p className="text-[11px] text-[#7a8fa0] font-mono mt-0.5">
            {searchInfo}
          </p>
        </div>
        <div className="flex gap-1 bg-[#111820] border border-[#1e2a35] rounded-lg p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-mono tracking-wide transition-all capitalize ${
                filter === f
                  ? "bg-white text-black font-medium"
                  : "text-[#7a8fa0] hover:text-[#e8edf2]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-7 py-6">
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-[10px] tracking-widest text-[#3d5060] uppercase">
            Results
          </span>
          {leads.length > 0 && (
            <span className="font-mono text-[10px] text-[#3d5060]">
              {leads.length} result{leads.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#3d5060] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#111820] border border-[#1e2a35] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  stroke="#3d5060"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 7v4M10 13h.01"
                  stroke="#3d5060"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="text-[14px] text-[#7a8fa0] font-normal mb-2">
              No leads yet
            </h3>
            <p className="text-[12px] text-[#3d5060] max-w-xs leading-relaxed">
              Select a business type and location in the sidebar to find
              businesses without websites.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {leads.map((lead, i) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                index={i}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
