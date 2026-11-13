const express = require("express");
const axios = require("axios");
const router = express.Router();
const Lead = require("../models/lead");

const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
});

const DEFAULT_RADIUS = 5000;
const MIN_RADIUS = 500;
const MAX_RADIUS = 30000;

function parseRadius(value) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return DEFAULT_RADIUS;
  return Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, n));
}

// Location suggestions restricted to Ghana, for the location picker.
router.get("/places/autocomplete", async (req, res) => {
  const { input } = req.query;
  const trimmed = typeof input === "string" ? input.trim() : "";
  if (trimmed.length < 2 || trimmed.length > 100) {
    return res.json({ predictions: [] });
  }

  try {
    const response = await apiClient.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: trimmed,
          components: "country:gh",
          types: "geocode",
          key: process.env.GOOGLE_PLACES_API,
        },
      },
    );

    const { status, error_message: errorMessage } = response.data;
    if (status !== "OK" && status !== "ZERO_RESULTS") {
      console.error(
        `Places autocomplete failed: ${status} ${errorMessage || ""}`,
      );
      return res
        .status(502)
        .json({ error: "Could not load location suggestions" });
    }

    const predictions = (response.data.predictions || []).map((p) => ({
      placeId: p.place_id,
      description: p.description,
      mainText: p.structured_formatting?.main_text || p.description,
      secondaryText: p.structured_formatting?.secondary_text || "",
    }));

    res.set("Cache-Control", "private, max-age=300");
    res.json({ predictions });
  } catch (error) {
    console.error("Places autocomplete error:", error.message);
    res.status(502).json({ error: "Could not load location suggestions" });
  }
});

router.get("/search", async (req, res) => {
  const { type, location, placeId } = req.query;
  const radius = parseRadius(req.query.radius);

  if (!type || (!location && !placeId)) {
    return res
      .status(400)
      .json({ error: "type and location (or placeId) are required" });
  }

  try {
    // A placeId (from autocomplete) is unambiguous; a free-text address is
    // restricted to Ghana so it can't resolve to a same-named place abroad.
    const geoParams = placeId
      ? { place_id: String(placeId), key: process.env.GOOGLE_PLACES_API }
      : {
          address: String(location),
          components: "country:GH",
          key: process.env.GOOGLE_PLACES_API,
        };

    const geoResponse = await apiClient.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      { params: geoParams },
    );

    if (!geoResponse.data.results?.length) {
      return res.status(404).json({ error: "Location not found" });
    }
    const geoResult = geoResponse.data.results[0];
    const { lat, lng } = geoResult.geometry.location;
    const resolvedLocation = geoResult.formatted_address || location || null;

    const placeResponse = await apiClient.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius,
          keyword: type,
          key: process.env.GOOGLE_PLACES_API,
        },
      },
    );

    const businesses = placeResponse.data.results;

    const limited = businesses.slice(0, 10);

    const detailed = await Promise.all(
      limited.map(async (place) => {
        const details = await apiClient.get(
          "https://maps.googleapis.com/maps/api/place/details/json",
          {
            params: {
              place_id: place.place_id,
              // Must be comma-separated with NO spaces, otherwise Google
              // returns INVALID_REQUEST and every field comes back empty.
              fields:
                "website,formatted_phone_number,photos,opening_hours,user_ratings_total,international_phone_number",
              key: process.env.GOOGLE_PLACES_API,
            },
          },
        );

        if (details.data.status !== "OK") {
          console.warn(
            `Place details failed for ${place.place_id}: ${details.data.status} ${details.data.error_message || ""}`,
          );
        }
        const result = details.data.result || {};
        const website = result.website || null;
        return {
          name: place.name,
          address: place.vicinity,
          placeId: place.place_id,
          rating: place.rating || null,
          reviewCount: place.user_ratings_total || null,
          phone: result.formatted_phone_number || null,
          internationalPhone: result.international_phone_number || null,
          // The business's own first photo on Google (storefront, logo, work…).
          photo:
            result.photos?.[0]?.photo_reference ||
            place.photos?.[0]?.photo_reference ||
            null,
          openNow: result.opening_hours?.open_now ?? null,
          website: website || null,
        };
      }),
    );

    const leads = detailed.filter((place) => !place.website);

    const saved = await Lead.insertMany(leads);

    res.json({
      total: saved.length,
      location: resolvedLocation,
      leads: saved,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const leads = await Lead.findAll();
    res.json({ total: leads.length, leads });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

router.get("/photo", async (req, res) => {
  const { ref } = req.query;
  if (!ref || typeof ref !== "string") {
    return res.status(400).json({ error: "ref is required" });
  }
  try {
    const response = await apiClient.get(
      "https://maps.googleapis.com/maps/api/place/photo",
      {
        params: {
          maxwidth: 600,
          photo_reference: ref,
          key: process.env.GOOGLE_PLACES_API,
        },
        responseType: "stream",
      },
    );
    res.set(
      "Content-Type",
      response.headers["content-type"] || "image/jpeg",
    );
    // Photos for a reference don't change; let the browser cache them
    // so we don't pay for a Google photo request on every page load.
    res.set("Cache-Control", "public, max-age=86400");
    response.data.pipe(res);
  } catch (error) {
    console.error("Photo fetch failed:", error.message);
    res.status(502).json({ error: "Could not load photo" });
  }
});

router.patch("/:id", async (req, res) => {
  const { status, notes } = req.body;
  try {
    if (status !== undefined && !Lead.STATUSES.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${Lead.STATUSES.join(", ")}`,
      });
    }
    const lead = await Lead.updateById(req.params.id, { status, notes });
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.deleteById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

module.exports = router;
