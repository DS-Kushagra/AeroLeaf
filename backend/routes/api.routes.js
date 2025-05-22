const express = require("express");
const router = express.Router();

const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/report", authMiddleware, reportController.createReport);
router.get("/reports", authMiddleware, reportController.getAllReports);

// Test endpoints for development
router.get("/sites", (req, res) => {
  // Return mock sites data
  const sites = [
    {
      id: "site_001",
      name: "Nandurbar Forest Restoration",
      region: "Nandurbar, Maharashtra, India",
      flagged_issues: ["Inconsistent growth pattern", "Possible data gap"],
      area_hectares: 35,
      status: "under_review",
      location: { lat: 21.3758, lon: 74.2417 },
      carbon_tonnes: 128.5,
      verification_progress: 72,
      planting_date: "2022-06-15",
      tree_species: ["Teak", "Sal", "Acacia"],
    },
    {
      id: "site_002",
      name: "Taita Hills Reforestation",
      region: "Taita Hills, Kenya",
      flagged_issues: ["Boundary dispute"],
      area_hectares: 48,
      status: "under_review",
      location: { lat: -3.3999, lon: 38.3591 },
      carbon_tonnes: 175.2,
      verification_progress: 59,
      planting_date: "2022-03-10",
      tree_species: ["Acacia", "Ficus"],
    },
    {
      id: "site_003",
      name: "Rio Doce Watershed Recovery",
      region: "Minas Gerais, Brazil",
      flagged_issues: ["Verification pending"],
      area_hectares: 52,
      status: "under_review",
      location: { lat: -19.5236, lon: -42.6394 },
      carbon_tonnes: 201.8,
      verification_progress: 35,
      planting_date: "2023-01-22",
      tree_species: ["Brazilian Mahogany", "Cedar", "Jacaranda"],
    },
  ];

  // Filter if manual_review_required query param is present
  if (req.query.manual_review_required === "true") {
    return res.json(sites);
  }

  return res.json(sites);
});

// Get single site details
router.get("/sites/:id", (req, res) => {
  const { id } = req.params;

  // Mock site data based on ID
  const siteDetails = {
    id: id,
    name:
      id === "site_001"
        ? "Nandurbar Forest Restoration"
        : id === "site_002"
        ? "Taita Hills Reforestation"
        : id === "site_003"
        ? "Rio Doce Watershed Recovery"
        : "Unknown Site",
    region:
      id === "site_001"
        ? "Nandurbar, Maharashtra, India"
        : id === "site_002"
        ? "Taita Hills, Kenya"
        : id === "site_003"
        ? "Minas Gerais, Brazil"
        : "Unknown Region",
    flagged_issues:
      id === "site_001"
        ? ["Inconsistent growth pattern", "Possible data gap"]
        : id === "site_002"
        ? ["Boundary dispute"]
        : id === "site_003"
        ? ["Verification pending"]
        : [],
    area_hectares:
      id === "site_001"
        ? 35
        : id === "site_002"
        ? 48
        : id === "site_003"
        ? 52
        : 0,
    status: "under_review",
    location:
      id === "site_001"
        ? { lat: 21.3758, lon: 74.2417 }
        : id === "site_002"
        ? { lat: -3.3999, lon: 38.3591 }
        : id === "site_003"
        ? { lat: -19.5236, lon: -42.6394 }
        : { lat: 0, lon: 0 },
    carbon_tonnes:
      id === "site_001"
        ? 128.5
        : id === "site_002"
        ? 175.2
        : id === "site_003"
        ? 201.8
        : 0,
    verification_progress:
      id === "site_001"
        ? 72
        : id === "site_002"
        ? 59
        : id === "site_003"
        ? 35
        : 0,
    planting_date:
      id === "site_001"
        ? "2022-06-15"
        : id === "site_002"
        ? "2022-03-10"
        : id === "site_003"
        ? "2023-01-22"
        : "2022-01-01",
    tree_species:
      id === "site_001"
        ? ["Teak", "Sal", "Acacia"]
        : id === "site_002"
        ? ["Acacia", "Ficus"]
        : id === "site_003"
        ? ["Brazilian Mahogany", "Cedar", "Jacaranda"]
        : [],
    timeline: [
      {
        date:
          id === "site_001"
            ? "2022-06-15"
            : id === "site_002"
            ? "2022-03-10"
            : id === "site_003"
            ? "2023-01-22"
            : "2022-01-01",
        event: "Site Registered",
      },
      {
        date:
          id === "site_001"
            ? "2022-07-20"
            : id === "site_002"
            ? "2022-05-15"
            : id === "site_003"
            ? "2023-03-10"
            : "2022-03-01",
        event: "First Satellite Analysis",
      },
      {
        date:
          id === "site_001"
            ? "2023-01-05"
            : id === "site_002"
            ? "2022-11-22"
            : id === "site_003"
            ? "2023-09-15"
            : "2022-06-01",
        event: "First Annual Review",
      },
      {
        date: new Date().toISOString().split("T")[0],
        event: "Current Status: Pending Verification",
      },
    ],
  };

  return res.json(siteDetails);
});

router.post("/sites/:id/verify", (req, res) => {
  return res.json({ success: true, message: "Site verified successfully" });
});

// NDVI data endpoint
router.get("/sites/:id/ndvi", (req, res) => {
  const { id } = req.params;

  // Check if we have the site ID
  if (!id) {
    return res.status(400).json({ error: "Site ID is required" });
  }

  // In production, this would call our ML service
  // For now, return mock data
  const ndviData = {
    site_id: id,
    verified: true,
    ndvi_history: [
      { date: "2023-01-15", ndvi: 0.21 },
      { date: "2023-04-15", ndvi: 0.23 },
      { date: "2023-07-15", ndvi: 0.27 },
      { date: "2023-10-15", ndvi: 0.31 },
      { date: "2024-01-15", ndvi: 0.36 },
      { date: "2024-04-15", ndvi: 0.4 },
      { date: "2024-10-15", ndvi: 0.43 },
      { date: "2025-01-15", ndvi: 0.47 },
      { date: "2025-04-15", ndvi: 0.51 },
    ],
    avg_ndvi_increase: 0.04,
    carbon_sequestered_tonnes: 12.6,
  };

  return res.json(ndviData);
});

module.exports = router;

/**
 * @swagger
 * /api/report:
 *   post:
 *     summary: Submit new reforestation verification report
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Success
 *
 * /api/sites:
 *   get:
 *     summary: Get all reforestation sites
 *     tags: [Sites]
 *     parameters:
 *       - in: query
 *         name: manual_review_required
 *         schema:
 *           type: boolean
 *         description: Filter for sites that need manual review
 *     responses:
 *       200:
 *         description: List of sites
 *
 * /api/sites/{id}/verify:
 *   post:
 *     summary: Mark a site as verified
 *     tags: [Sites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Site ID
 *     responses:
 *       200:
 *         description: Site verified successfully
 */
