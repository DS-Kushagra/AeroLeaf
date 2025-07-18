import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { sitesApi } from "../services/api";
import NDVIChart from "../components/NDVIChart";
import NDVIVisualization from "../components/NDVIVisualization";
import SatelliteComparison from "../components/SatelliteComparison";
import {
  ArrowBack,
  LocationOn,
  Park,
  ShowChart,
  Flag,
  CheckCircle,
  EventAvailable,
  ThreeDRotation,
  Satellite,
  Timeline,
  FormatListBulleted,
} from "@mui/icons-material";

export default function SiteDetails() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchSiteData() {
      try {
        const siteData = await sitesApi.getSiteDetails(id);
        setSite(siteData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchSiteData();
  }, [id]);

  if (loading)
    return (
      <div className="flex-center h-64">
        <div className="loader">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading site data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 fade-in">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );

  if (!site)
    return (
      <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 fade-in">
        <p className="font-bold">Site not found</p>
        <p>
          The requested site could not be found. Please check the site ID and
          try again.
        </p>
      </div>
    );

  // Determine status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "flagged":
        return "badge-danger";
      default:
        return "badge-success";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 fade-in">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-primary mb-6 transition-colors hover:text-primary-hover"
      >
        <ArrowBack fontSize="small" />
        <span className="ml-2">Back to Dashboard</span>
      </Link>

      <div className="relative overflow-hidden bg-gradient-to-r from-green-700 to-green-600 text-white p-8 rounded-lg shadow-md mb-6">
        <div className="bg-shape bg-shape-1"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">{site.name}</h1>
                <span className={`badge ml-3 ${getStatusColor(site.status)}`}>
                  {site.status}
                </span>
              </div>
              <div className="flex items-center text-green-100 mt-2">
                <LocationOn fontSize="small" />
                <p className="ml-1">{site.region}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="btn btn-outline text-white border-white hover:bg-white hover:text-green-700">
                View on Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("vegetation")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "vegetation"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Vegetation Analysis
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "timeline"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Timeline
          </button>
        </nav>
      </div>

      {/* Main content area based on active tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Key stats cards */}
          <div className="card stat-card bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-start">
              {" "}
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Park className="text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Area</h3>
                <p className="text-2xl font-bold">
                  {site.area_hectares} hectares
                </p>
              </div>
            </div>
          </div>

          <div className="card stat-card bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <ShowChart className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Carbon Sequestered
                </h3>
                <p className="text-2xl font-bold">
                  {site.carbon_tonnes || "Calculating..."} tonnes
                </p>
              </div>
            </div>
          </div>

          <div className="card stat-card bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-start">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <CheckCircle className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Verification
                </h3>
                <p className="text-2xl font-bold">
                  {site.verification_progress || "0"}%
                </p>
                <div
                  className="progress-bar mt-2"
                  style={{
                    "--progress-width": `${site.verification_progress || 0}%`,
                  }}
                >
                  <div className="progress-bar-fill bg-purple-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Site information */}
          <div className="card col-span-1 md:col-span-2">
            <h2 className="section-header text-xl font-semibold">
              About this Site
            </h2>
            <p className="mt-4">
              {site.description ||
                "This reforestation site is part of AeroLeaf's carbon sequestration program. The site is actively monitored using satellite imagery to track vegetation growth and calculate carbon credits."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500">Landowner</p>
                <p className="font-medium">
                  {site.landowner || "EcoFarms Ltd."}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project Start</p>
                <p className="font-medium">
                  {site.start_date || "January 2023"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project Type</p>
                <p className="font-medium">
                  {site.project_type || "Reforestation"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tree Species</p>
                <p className="font-medium">
                  {site.tree_species || "Mixed native forest"}
                </p>
              </div>
            </div>
          </div>

          {/* Flagged issues */}
          <div className="card">
            <h2 className="section-header text-xl font-semibold">
              Site Status
            </h2>

            {site.flagged_issues && site.flagged_issues.length > 0 ? (
              <div className="mt-4">
                <div className="flex items-center mb-3">
                  <Flag className="text-red-500" />
                  <h3 className="ml-2 text-lg font-semibold text-red-600">
                    Flagged Issues
                  </h3>
                </div>
                <ul className="bg-red-50 rounded-md p-3">
                  {site.flagged_issues.map((issue, index) => (
                    <li
                      key={index}
                      className="text-red-700 mb-2 flex items-start"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-2"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 bg-green-50 rounded-md p-4 flex items-center">
                <CheckCircle className="text-green-500 mr-2" />
                <p className="text-green-700">
                  No issues detected. This site is progressing as expected.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "vegetation" && (
        <div className="mb-8">
          <div className="card chart-container p-6">
            <h2 className="section-header text-xl font-semibold">
              NDVI Time Series
            </h2>
            <p className="text-gray-600 mb-6">
              Normalized Difference Vegetation Index (NDVI) measures the density
              and health of vegetation. Higher values indicate denser, healthier
              vegetation.
            </p>
            <div className="bg-white rounded-lg shadow-sm p-4 h-80">
              <NDVIChart siteId={id} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Baseline NDVI</p>
                <p className="font-medium">0.21</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current NDVI</p>
                <p className="font-medium">0.45</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Change</p>
                <p className="font-medium text-green-600">+114%</p>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <h2 className="section-header text-xl font-semibold">
              Satellite Images
            </h2>
            <p className="text-gray-600 mb-6">
              Visual comparison of vegetation growth over time from Sentinel-2
              satellite imagery.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium mb-2">Baseline (January 2023)</p>
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
              </div>
              <div>
                <p className="font-medium mb-2">Current (Latest available)</p>
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="mb-8">
          <div className="card">
            <h2 className="section-header text-xl font-semibold">
              Project Timeline
            </h2>

            <div className="relative mt-8">
              <div className="absolute left-4 inset-y-0 w-0.5 bg-green-100"></div>

              <div
                className="relative pl-12 pb-10 fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="absolute left-0 rounded-full border-4 border-white w-8 h-8 bg-green-500 flex items-center justify-center shadow-md">
                  <EventAvailable className="text-white text-sm" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-bold text-green-700">
                    Site Registered
                  </div>
                  <div className="text-gray-500">January 15, 2025</div>
                  <div className="mt-2 text-gray-700">
                    Initial assessment completed and site registered for
                    verification.
                  </div>
                </div>
              </div>

              <div
                className="relative pl-12 pb-10 fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="absolute left-0 rounded-full border-4 border-white w-8 h-8 bg-green-500 flex items-center justify-center shadow-md">
                  <ShowChart className="text-white text-sm" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-bold text-green-700">
                    First Satellite Analysis
                  </div>
                  <div className="text-gray-500">February 23, 2025</div>
                  <div className="mt-2 text-gray-700">
                    Baseline NDVI established using satellite imagery.
                  </div>
                </div>
              </div>

              <div
                className="relative pl-12 fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="absolute left-0 rounded-full border-4 border-white w-8 h-8 bg-yellow-500 flex items-center justify-center shadow-md pulse-animation">
                  <Flag className="text-white text-sm" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-bold text-yellow-700">
                    Current Status: Pending Verification
                  </div>
                  <div className="text-gray-500">Today</div>
                  <div className="mt-2 text-gray-700">
                    Site is undergoing verification to confirm carbon
                    sequestration claims.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <h2 className="section-header text-xl font-semibold">
              Upcoming Milestones
            </h2>

            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <CheckCircle className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">First Verification Complete</p>
                  <p className="text-sm text-gray-600">Expected in 2 months</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <CheckCircle className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Carbon Credits Issuance</p>
                  <p className="text-sm text-gray-600">Expected in 3 months</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <CheckCircle className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Annual Growth Assessment</p>
                  <p className="text-sm text-gray-600">Expected in 6 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
