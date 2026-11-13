import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import ResultsToolbar from "./components/ResultsToolbar";
import LeadCard, { LeadCardSkeleton } from "./components/LeadCard";
import LeadTable, { LeadTableSkeleton } from "./components/LeadTable";
import Toasts from "./components/Toasts";
import { EmptySearch, ErrorState, NoMatches, NoResults } from "./components/EmptyState";
import { MenuIcon } from "./components/icons";
import {
  API,
  RADII,
  STATUS_META,
  capitalize,
  errorMessage,
  formatCount,
  sortLeads,
  statusOf,
} from "./lib/format";
import { readStorage, writeStorage } from "./lib/storage";

const RECENT_KEY = "leadfind:recent";
const VIEW_KEY = "leadfind:view";
const MAX_RECENT = 6;

const QUICK_SEARCHES = [
  { label: "Pharmacies in Osu", type: "pharmacy", location: { label: "Osu, Accra", query: "Osu, Accra, Ghana", placeId: null } },
  { label: "Salons in East Legon", type: "salon", location: { label: "East Legon, Accra", query: "East Legon, Accra, Ghana", placeId: null } },
  { label: "Restaurants in Adum, Kumasi", type: "restaurant", location: { label: "Adum, Kumasi", query: "Adum, Kumasi, Ghana", placeId: null } },
  { label: "Hotels in Takoradi", type: "hotel", location: { label: "Takoradi", query: "Takoradi, Ghana", placeId: null } },
];

const recentKey = (r) =>
  `${r.type.trim().toLowerCase()}|${(r.location?.query || "").toLowerCase()}|${r.radius}`;

function loadRecent() {
  const list = readStorage(RECENT_KEY, []);
  return Array.isArray(list)
    ? list.filter((r) => r && typeof r.type === "string" && r.location?.query).slice(0, MAX_RECENT)
    : [];
}

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export default function App() {
  // Navigation
  const [view, setView] = useState("search"); // "search" | "all"
  const [navOpen, setNavOpen] = useState(false);

  // Saved leads
  const [allLeads, setAllLeads] = useState([]);
  const [allState, setAllState] = useState("loading"); // loading | ready | error
  const [allError, setAllError] = useState("");

  // Search form
  const [type, setType] = useState("");
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(5);
  const [recent, setRecent] = useState(loadRecent);

  // Search results
  const [results, setResults] = useState([]);
  const [searchState, setSearchState] = useState("idle"); // idle | loading | done | error
  const [searchError, setSearchError] = useState("");
  const [lastSearch, setLastSearch] = useState(null);

  // Results controls
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [layout, setLayout] = useState(() =>
    readStorage(VIEW_KEY, "grid") === "table" ? "table" : "grid",
  );

  // Toasts
  const [toasts, setToasts] = useState([]);
  const toastSeq = useRef(0);
  const typeInputRef = useRef(null);
  const searchSeq = useRef(0);

  // Latest lead lists, readable from async callbacks (undo/rollback).
  const leadsRef = useRef({ allLeads, results });
  useEffect(() => {
    leadsRef.current = { allLeads, results };
  }, [allLeads, results]);

  const dismissToast = useCallback(
    (id) => setToasts((list) => list.filter((t) => t.id !== id)),
    [],
  );
  const toast = useCallback((message, opts = {}) => {
    toastSeq.current += 1;
    const id = toastSeq.current;
    setToasts((list) => [...list.slice(-3), { id, message, ...opts }]);
  }, []);

  /* ---------- Data ---------- */

  const fetchAll = useCallback(
    () =>
      axios.get(API).then(
        (res) => {
          setAllLeads(res.data.leads || []);
          setAllState("ready");
        },
        (err) => {
          console.error("Failed to fetch leads:", err);
          setAllError(errorMessage(err, "Failed to load saved leads."));
          setAllState("error");
        },
      ),
    [],
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const retryAll = () => {
    setAllState("loading");
    fetchAll();
  };

  const runSearch = async (params) => {
    const t = (params?.type ?? type).trim();
    const loc = params?.location ?? location;
    const r = params?.radius ?? radius;
    if (params) {
      setType(t);
      setLocation(loc);
      setRadius(r);
    }
    if (!t || !loc?.query) {
      toast(!t ? "Enter a business type" : "Choose a location", { tone: "error" });
      if (!t) typeInputRef.current?.focus();
      return;
    }

    setView("search");
    setNavOpen(false);
    setStatus("all");
    setQuery("");
    setSearchState("loading");
    setSearchError("");
    setLastSearch({ type: t, location: loc, radius: r, resolved: null });
    const seq = ++searchSeq.current;

    try {
      const res = await axios.get(`${API}/search`, {
        params: {
          type: t,
          location: loc.query,
          placeId: loc.placeId || undefined,
          radius: r * 1000,
        },
      });
      if (seq !== searchSeq.current) return;
      const found = res.data.leads || [];
      setResults(found);
      setSearchState("done");
      setLastSearch({ type: t, location: loc, radius: r, resolved: res.data.location || null });
      setAllLeads((prev) => {
        const ids = new Set(prev.map((l) => l._id));
        const fresh = found.filter((l) => !ids.has(l._id));
        return fresh.length ? [...prev, ...fresh] : prev;
      });
      setRecent((prev) => {
        const entry = { type: t, location: loc, radius: r };
        const next = [entry, ...prev.filter((x) => recentKey(x) !== recentKey(entry))].slice(0, MAX_RECENT);
        writeStorage(RECENT_KEY, next);
        return next;
      });
      toast(
        found.length
          ? `Found ${found.length} ${found.length === 1 ? "business" : "businesses"} without a website`
          : "No businesses without a website found",
      );
    } catch (err) {
      if (seq !== searchSeq.current) return;
      console.error("Search failed:", err);
      const msg = errorMessage(err, "Search failed. Please try again.");
      setSearchError(msg);
      setSearchState("error");
      toast(msg, { tone: "error" });
    }
  };

  const findLead = (id) =>
    leadsRef.current.allLeads.find((l) => l._id === id) ||
    leadsRef.current.results.find((l) => l._id === id);

  const patchLocal = (id, patch) => {
    const apply = (list) => list.map((l) => (l._id === id ? { ...l, ...patch } : l));
    setAllLeads(apply);
    setResults(apply);
  };

  const updateStatus = async (id, next, { isUndo = false } = {}) => {
    const lead = findLead(id);
    const prev = statusOf(lead);
    if (prev === next) return;
    patchLocal(id, { status: next });
    try {
      const res = await axios.patch(`${API}/${id}`, { status: next });
      if (res.data && res.data._id) patchLocal(id, res.data);
      if (isUndo) {
        toast(`Reverted to ${STATUS_META[next].label}`);
      } else {
        toast(`${lead?.name || "Lead"} marked ${STATUS_META[next].label}`, {
          action: { label: "Undo", onClick: () => updateStatus(id, prev, { isUndo: true }) },
        });
      }
    } catch (err) {
      console.error("Status update failed:", err);
      patchLocal(id, { status: prev });
      toast(errorMessage(err, "Couldn't update status"), { tone: "error" });
    }
  };

  const saveNote = async (id, notes) => {
    const prev = findLead(id)?.notes || "";
    patchLocal(id, { notes });
    try {
      const res = await axios.patch(`${API}/${id}`, { notes });
      if (res.data && res.data._id) patchLocal(id, res.data);
      toast(notes ? "Note saved" : "Note removed");
    } catch (err) {
      console.error("Note update failed:", err);
      patchLocal(id, { notes: prev });
      toast(errorMessage(err, "Couldn't save note"), { tone: "error" });
    }
  };

  const deleteLead = async (id) => {
    const name = findLead(id)?.name;
    try {
      await axios.delete(`${API}/${id}`);
      setAllLeads((list) => list.filter((l) => l._id !== id));
      setResults((list) => list.filter((l) => l._id !== id));
      toast(name ? `Removed ${name}` : "Lead removed");
      return true;
    } catch (err) {
      console.error("Delete failed:", err);
      toast(errorMessage(err, "Couldn't remove lead"), { tone: "error" });
      return false;
    }
  };

  /* ---------- Navigation ---------- */

  const navigate = (v) => {
    setView(v);
    setStatus("all");
    setQuery("");
    setNavOpen(false);
  };

  const openPipeline = (s) => {
    setView("all");
    setStatus(s);
    setQuery("");
    setNavOpen(false);
  };

  const changeLayout = (l) => {
    setLayout(l);
    writeStorage(VIEW_KEY, l);
  };

  const clearRecent = () => {
    setRecent([]);
    writeStorage(RECENT_KEY, []);
  };

  const closeNav = useCallback(() => setNavOpen(false), []);

  // "/" focuses the business type input.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(document.activeElement)) return;
      e.preventDefault();
      setView("search");
      setNavOpen(false);
      setTimeout(() => typeInputRef.current?.focus(), 0);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- Derived ---------- */

  const pipelineCounts = useMemo(() => {
    const c = { all: allLeads.length, new: 0, contacted: 0, interested: 0, closed: 0 };
    for (const l of allLeads) c[statusOf(l)] += 1;
    return c;
  }, [allLeads]);

  const base = view === "all" ? allLeads : results;

  const toolbarCounts = useMemo(() => {
    const c = { all: base.length, new: 0, contacted: 0, interested: 0, closed: 0 };
    for (const l of base) c[statusOf(l)] += 1;
    return c;
  }, [base]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = base.filter(
      (l) =>
        (status === "all" || statusOf(l) === status) &&
        (!q ||
          (l.name || "").toLowerCase().includes(q) ||
          (l.address || "").toLowerCase().includes(q)),
    );
    return sortLeads(list, sort);
  }, [base, status, query, sort]);

  /* ---------- Header copy ---------- */

  let title;
  let context;
  if (view === "all") {
    title = "All leads";
    context =
      allState === "loading"
        ? "Loading saved leads…"
        : `${formatCount(allLeads.length)} saved ${allLeads.length === 1 ? "lead" : "leads"}` +
          (status !== "all" ? ` · ${formatCount(toolbarCounts[status])} ${STATUS_META[status].label.toLowerCase()}` : "");
  } else {
    title = "Find businesses";
    if (!lastSearch) {
      context = "Search Google Places for businesses in Ghana with no website.";
    } else {
      const place = lastSearch.resolved || lastSearch.location.label;
      const parts = [capitalize(lastSearch.type), place, `${lastSearch.radius} km`];
      if (searchState === "loading") parts.push("Searching…");
      if (searchState === "done") parts.push(`${formatCount(results.length)} without a website`);
      if (searchState === "error") parts.push("Search failed");
      context = parts.join(" · ");
    }
  }

  /* ---------- Body ---------- */

  const loading = view === "all" ? allState === "loading" : searchState === "loading";
  const showToolbar =
    view === "all" ? allState === "ready" && allLeads.length > 0 : searchState === "done" && results.length > 0;

  let body;
  if (loading) {
    body =
      layout === "table" ? (
        <LeadTableSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <LeadCardSkeleton key={i} />
          ))}
        </div>
      );
  } else if (view === "all" && allState === "error") {
    body = <ErrorState message={allError} onRetry={retryAll} />;
  } else if (view === "search" && searchState === "error") {
    body = <ErrorState message={searchError} onRetry={() => runSearch(lastSearch)} />;
  } else if (view === "search" && searchState === "idle") {
    body = <EmptySearch suggestions={QUICK_SEARCHES} onPick={runSearch} />;
  } else if (base.length === 0) {
    if (view === "all") {
      body = (
        <NoResults
          title="No saved leads yet"
          body="Leads you find through search are saved here automatically."
          actionLabel="Find businesses"
          onAction={() => {
            navigate("search");
            setTimeout(() => typeInputRef.current?.focus(), 0);
          }}
        />
      );
    } else {
      const wider = RADII.find((km) => km > (lastSearch?.radius ?? 0));
      body = (
        <NoResults
          title="Every business here already has a website"
          body={`No ${lastSearch?.type || "businesses"} without a website within ${lastSearch?.radius} km. Try a wider radius or a nearby area.`}
          actionLabel={wider ? `Search within ${wider} km` : undefined}
          onAction={wider ? () => runSearch({ ...lastSearch, radius: wider }) : undefined}
        />
      );
    }
  } else if (visible.length === 0) {
    body = (
      <NoMatches
        onClear={() => {
          setStatus("all");
          setQuery("");
        }}
      />
    );
  } else if (layout === "table") {
    body = (
      <LeadTable leads={visible} onUpdateStatus={updateStatus} onSaveNote={saveNote} onDelete={deleteLead} />
    );
  } else {
    body = (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visible.map((lead, i) => (
          <LeadCard
            key={lead._id}
            lead={lead}
            index={i}
            onUpdateStatus={updateStatus}
            onSaveNote={saveNote}
            onDelete={deleteLead}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-canvas">
      <Sidebar
        view={view}
        onNavigate={navigate}
        counts={pipelineCounts}
        activeStatus={status}
        onPipeline={openPipeline}
        open={navOpen}
        onClose={closeNav}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-line bg-canvas">
          <div className="mx-auto flex max-w-[1600px] items-start gap-3 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
              aria-expanded={navOpen}
              className="-ml-1 mt-0.5 inline-flex size-8 items-center justify-center rounded-md text-ink-2 hover:bg-subtle hover:text-ink lg:hidden"
            >
              <MenuIcon />
            </button>
            <div className="min-w-0">
              <h1 className="text-[18px] font-semibold leading-tight tracking-tight text-ink">{title}</h1>
              <p className="mt-1 text-[13px] text-ink-3 sm:truncate" title={context}>
                {context}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
            {view === "search" && (
              <SearchBar
                type={type}
                onTypeChange={setType}
                location={location}
                onLocationChange={setLocation}
                radius={radius}
                onRadiusChange={setRadius}
                onSubmit={() => runSearch()}
                loading={searchState === "loading"}
                recent={recent}
                onRecent={runSearch}
                onClearRecent={clearRecent}
                typeInputRef={typeInputRef}
              />
            )}

            {showToolbar && (
              <ResultsToolbar
                status={status}
                onStatus={setStatus}
                counts={toolbarCounts}
                query={query}
                onQuery={setQuery}
                sort={sort}
                onSort={setSort}
                layout={layout}
                onLayout={changeLayout}
              />
            )}

            {body}
          </div>
        </div>
      </main>

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

