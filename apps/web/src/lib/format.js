export const API =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1/leads";

export const STATUSES = ["new", "contacted", "interested", "closed"];

export const STATUS_META = {
  new: {
    label: "New",
    dot: "bg-st-new",
    pill: "bg-st-new-bg text-st-new",
  },
  contacted: {
    label: "Contacted",
    dot: "bg-st-contacted",
    pill: "bg-st-contacted-bg text-st-contacted",
  },
  interested: {
    label: "Interested",
    dot: "bg-st-interested",
    pill: "bg-st-interested-bg text-st-interested",
  },
  closed: {
    label: "Closed",
    dot: "bg-st-closed",
    pill: "bg-st-closed-bg text-st-closed",
  },
};

export const RADII = [2, 5, 10, 20];

export const statusOf = (lead) =>
  STATUSES.includes(lead?.status) ? lead.status : "new";

export function photoUrl(ref) {
  return ref ? `${API}/photo?ref=${encodeURIComponent(ref)}` : null;
}

export function mapsUrl(lead) {
  if (lead.placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(lead.placeId)}`;
  }
  const q = [lead.name, lead.address].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function initials(name = "") {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function capitalize(s = "") {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function formatCount(n) {
  return new Intl.NumberFormat("en-GB").format(n ?? 0);
}

export function relativeTime(value) {
  if (!value) return "—";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Math.max(0, Date.now() - then) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  const d = new Date(then);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export function errorMessage(err, fallback) {
  const data = err?.response?.data;
  if (data && typeof data === "object") {
    if (typeof data.error === "string" && data.error) return data.error;
    if (typeof data.message === "string" && data.message) return data.message;
  }
  if (!err?.response) return "Can't reach the server. Is the API running?";
  return fallback;
}

export const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Rating" },
  { value: "reviews", label: "Most reviews" },
  { value: "name", label: "Name A–Z" },
];

export function sortLeads(list, sort) {
  const out = [...list];
  switch (sort) {
    case "rating":
      return out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "reviews":
      return out.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    case "name":
      return out.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" }),
      );
    default:
      return out.sort(
        (a, b) =>
          (new Date(b.createdAt).getTime() || 0) -
          (new Date(a.createdAt).getTime() || 0),
      );
  }
}
