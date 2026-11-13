import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import axios from "axios";

const API =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1/leads";

export default function App() {
  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("search");
  const [searchInfo, setSearchInfo] = useState(
    "Search for businesses to get started",
  );
  const [notif, setNotif] = useState("");

  const showNotif = (msg) => setNotif(msg);

  // load all leads from database on startup
  useEffect(() => {
    const fetchAllLeads = async () => {
      try {
        const res = await axios.get(API);
        setAllLeads(res.data.leads || []);
      } catch (err) {
        console.error("Failed to fetch all leads:", err);
        showNotif("Failed to load leads");
      }
    };
    fetchAllLeads();
  }, []);

  // notification timeout cleanup
  useEffect(() => {
    if (!notif) return;
    const timer = setTimeout(() => setNotif(""), 2500);
    return () => clearTimeout(timer);
  }, [notif]);

  const searchLeads = async (type, location) => {
    if (!type || !location) {
      showNotif("Select a type and location");
      return;
    }
    setLoading(true);
    setView("search");
    setSearchInfo(`Searching ${type}s in ${location}...`);
    try {
      const res = await axios.get(`${API}/search`, {
        params: { type, location },
      });
      const newLeads = res.data.leads || [];
      setLeads(newLeads);
      const count = newLeads.length;
      setSearchInfo(`${type} · ${location} · ${count} leads found`);
      showNotif(`Found ${count} leads`);

      // merge new leads into allLeads without duplicates
      setAllLeads((prev) => {
        const existingIds = new Set(prev.map((l) => l._id));
        const unique = newLeads.filter((l) => !existingIds.has(l._id));
        return [...prev, ...unique];
      });
    } catch (err) {
      console.error("Search failed:", err);
      setSearchInfo("Error fetching leads");
      showNotif("Connection error — is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const res = await axios.patch(`${API}/${id}`, { status });
      const updated = res.data;
      setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
      setAllLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
      showNotif(`Marked as ${status}`);
    } catch (err) {
      console.error("Update failed:", err);
      showNotif("Failed to update");
    } finally {
      setUpdating(false);
    }
  };

  const deleteLead = async (id) => {
    setUpdating(true);
    try {
      await axios.delete(`${API}/${id}`);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      setAllLeads((prev) => prev.filter((l) => l._id !== id));
      showNotif("Lead removed");
    } catch (err) {
      console.error("Delete failed:", err);
      showNotif("Failed to delete");
    } finally {
      setUpdating(false);
    }
  };

  const displayLeads = view === "all" ? allLeads : leads;
  const filtered =
    filter === "all"
      ? displayLeads
      : displayLeads.filter((l) => (l.status || "new") === filter);

  return (
    <div
      className="flex h-screen bg-[#080c10] text-[#e8edf2] overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle,#1e3040 1px,transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <Sidebar
        leads={allLeads}
        onSearch={searchLeads}
        view={view}
        setView={setView}
      />
      <Dashboard
        leads={filtered}
        allLeads={allLeads}
        loading={loading || updating}
        filter={filter}
        setFilter={setFilter}
        searchInfo={
          view === "all"
            ? `${allLeads.length} total leads in database`
            : searchInfo
        }
        onUpdateStatus={updateStatus}
        onDelete={deleteLead}
        view={view}
      />
      {notif && (
        <div className="fixed bottom-6 right-6 bg-[#111820] border border-[#243040] rounded-xl px-4 py-3 text-xs font-mono tracking-wide text-[#e8edf2] z-50">
          {notif}
        </div>
      )}
    </div>
  );
}
