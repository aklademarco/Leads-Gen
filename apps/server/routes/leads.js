const express = require("express");
const axios = require("axios");
const router = express.Router();
const Lead = require("../models/lead");

const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
});

router.get("/search", async (req, res) => {
  const { type, location } = req.query;

  if (!type || !location) {
    return res.status(400).json({ error: "type and location are required" });
  }

  try {
    const geoResponse = await apiClient.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: location,
          key: process.env.GOOGLE_PLACES_API,
        },
      },
    );

    if (!geoResponse.data.results.length) {
      return res.status(404).json({ error: "Location not found" });
    }
    const coords = geoResponse.data.results[0].geometry.location;
    const { lat, lng } = coords;

    const placeResponse = await apiClient.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
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
              fields:
                "website, formatted_phone_number, photos, opening_hours, user_ratings_total, international_phone_number",
              key: process.env.GOOGLE_PLACES_API,
            },
          },
        );

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
          photo: result.photos?.[0]?.photo_reference || null,
          openNow: result.opening_hours?.open_now ?? null,
          website: website || null,
        };
      }),
    );

    const leads = detailed.filter((place) => !place.website);

    const saved = await Lead.insertMany(leads);

    res.json({ total: saved.length, leads: saved });
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
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${process.env.GOOGLE_PLACES_API}`;
  const response = await axios.get(url, { responseType: "stream" });
  response.data.pipe(res);
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
