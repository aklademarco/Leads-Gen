import { useState } from "react";

const TYPES = [
  "restaurant",
  "salon",
  "pharmacy",
  "hotel",
  "supermarket",
  "clinic",
  "barbershop",
  "bakery",
  "school",
  "gym",
];

export default function Sidebar({ leads, onSearch, view, setView }) {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const stats = {
    total: leads.length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    interested: leads.filter((l) => l.status === "interested").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  return (
    <aside className="w-60 min-w-60 bg-[#0a0f16]/90 border-r border-[#1e2a35] flex flex-col backdrop-blur-md">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1e2a35] flex items-center gap-3">
        <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="3" fill="#000" />
            <path
              d="M7 1v2M7 11v2M1 7h2M11 7h2"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <div className="font-mono text-[13px] font-medium tracking-wide">
            LeadFind
          </div>
          <div className="font-mono text-[9px] text-[#3d5060] tracking-widest">
            Business Intelligence
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-5 border-b border-[#1e2a35]">
        <div className="font-mono text-[9px] tracking-widest text-[#3d5060] uppercase mb-3">
          Search
        </div>
        <div className="mb-3">
          <label className="text-[11px] text-[#7a8fa0] block mb-1">
            Business Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#111820] border border-[#1e2a35] rounded-lg text-[#e8edf2] text-[12px] px-3 py-2 outline-none focus:border-[#243040] appearance-none"
          >
            <option value="">Select type...</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="text-[11px] text-[#7a8fa0] block mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(type, location)}
            placeholder="e.g. Kumasi, Accra"
            className="w-full bg-[#111820] border border-[#1e2a35] rounded-lg text-[#e8edf2] text-[12px] px-3 py-2 outline-none focus:border-[#243040] placeholder-[#3d5060]"
          />
        </div>
        <button
          onClick={() => onSearch(type, location)}
          className="w-full bg-white text-black rounded-lg py-2 text-[12px] font-medium hover:bg-[#e0e8f0] transition-all active:scale-95"
        >
          Search Businesses
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 py-4 border-b border-[#1e2a35]">
        <div className="font-mono text-[9px] tracking-widest text-[#3d5060] uppercase mb-3">
          Overview
        </div>
        {[
          ["Total leads", stats.total],
          ["Contacted", stats.contacted],
          ["Interested", stats.interested],
          ["Closed", stats.closed],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between items-center mb-2">
            <span className="text-[11px] text-[#7a8fa0]">{label}</span>
            <span className="font-mono text-[12px] text-[#e8edf2]">
              {val || "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div className="px-3 py-3 mt-auto border-t border-[#1e2a35]">
        {[
          { label: "All Leads", key: "all" },
          { label: "Search Results", key: "search" },
        ].map((item) => (
          <div
            key={item.key}
            onClick={() => setView(item.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] cursor-pointer transition-all ${
              view === item.key
                ? "bg-[#111820] text-[#e8edf2]"
                : "text-[#7a8fa0] hover:bg-[#111820] hover:text-[#e8edf2]"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                view === item.key ? "bg-white" : "bg-[#3d5060]"
              }`}
            />
            {item.label}
            {item.key === "all" && leads.length > 0 && (
              <span className="ml-auto font-mono text-[10px] text-[#3d5060]">
                {leads.length}
              </span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
