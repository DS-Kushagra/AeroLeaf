import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { Select, MenuItem, Chip, Button } from "@mui/material";
import {
  Map,
  SatelliteAlt,
  Public,
  TrendingUp,
  ArrowForward,
} from "@mui/icons-material";

// Enhanced site data with more details
const siteData = [
  {
    id: 1,
    name: "Nandurbar Reforestation",
    description: "Community-led reforestation project in Maharashtra",
    status: "Verified",
    ndviChange: 0.37,
    carbon: 2450,
    coords: [21.3758, 74.2417], // Corrected coordinates for Nandurbar, Maharashtra
    area: [
      [21.3756, 74.2415],
      [21.376, 74.2415],
      [21.376, 74.2419],
      [21.3756, 74.2419],
    ],
  },
  {
    id: 2,
    name: "Taita Hills Project",
    description: "Forest restoration in Eastern Arc Mountains",
    status: "Verified",
    ndviChange: 0.29,
    carbon: 1850,
    coords: [-3.3999, 38.3591], // Corrected coordinates for Taita Hills, Kenya
    area: [
      [-3.4001, 38.3589],
      [-3.3997, 38.3589],
      [-3.3997, 38.3593],
      [-3.4001, 38.3593],
    ],
  },
  {
    id: 3,
    name: "Rio Doce Park",
    description: "Atlantic Forest recovery initiative",
    status: "Pending",
    ndviChange: 0.21,
    carbon: 980,
    coords: [-19.5236, -42.6394], // Corrected coordinates for Rio Doce, Brazil
    area: [
      [-19.5234, -42.6392],
      [-19.5238, -42.6392],
      [-19.5238, -42.6396],
      [-19.5234, -42.6396],
    ],
  },
  {
    id: 4,
    name: "Amazon Corridor",
    description: "Biodiversity corridor restoration",
    status: "In Progress",
    ndviChange: 0.18,
    carbon: 3200,
    coords: [-5.2, -60.1],
    area: [
      [-5.19, -60.09],
      [-5.21, -60.09],
      [-5.21, -60.11],
      [-5.19, -60.11],
    ],
  },
];

// Custom icon for markers
const createCustomIcon = (status) => {
  const color =
    status === "Verified"
      ? "#10B981"
      : status === "In Progress"
      ? "#3B82F6"
      : "#F59E0B";

  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Pulse animation component
const PulseMarker = ({ position, color }) => {
  const [pulseSize, setPulseSize] = useState(20);
  const [pulseOpacity, setPulseOpacity] = useState(0.7);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseSize((prev) => (prev >= 60 ? 20 : prev + 2));
      setPulseOpacity((prev) => (pulseSize >= 55 ? 0.7 : prev - 0.025));
    }, 50);

    return () => clearInterval(interval);
  }, [pulseSize]);

  return (
    <CircleMarker
      center={position}
      radius={pulseSize}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: pulseOpacity,
        weight: 0.5,
      }}
    />
  );
};

// Map component with enhanced visuals
export default function MapView() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [mapStyle, setMapStyle] = useState("satellite");

  return (
    <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
            <Public className="text-green-400" />
            Global Reforestation Sites
          </h3>
          <p className="text-sm text-gray-300">
            Real-time monitoring of carbon capture projects
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                mapStyle === "satellite"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setMapStyle("satellite")}
            >
              <SatelliteAlt fontSize="small" />
              Satellite
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                mapStyle === "streets"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setMapStyle("streets")}
            >
              <Map fontSize="small" />
              Streets
            </button>
          </div>
          <Select
            value="all"
            size="small"
            className="bg-gray-700 text-white rounded-lg text-sm min-w-[120px]"
          >
            <MenuItem value="all">All Projects</MenuItem>
            <MenuItem value="verified">Verified Only</MenuItem>
            <MenuItem value="inProgress">In Progress</MenuItem>
          </Select>
        </div>
      </div>

      <MapContainer
        center={[-5, -55]}
        zoom={3}
        style={{ height: "600px", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url={
            mapStyle === "satellite"
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution={
            mapStyle === "satellite"
              ? "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              : "&copy; OpenStreetMap contributors"
          }
        />

        {siteData.map((site, index) => (
          <div key={site.id}>
            {/* Pulse effect for active site */}
            {activeIndex === index && (
              <PulseMarker
                position={site.coords}
                color={
                  site.status === "Verified"
                    ? "#10B981"
                    : site.status === "In Progress"
                    ? "#3B82F6"
                    : "#F59E0B"
                }
              />
            )}

            {/* Site marker */}
            <Marker
              position={site.coords}
              icon={createCustomIcon(site.status)}
              eventHandlers={{
                mouseover: () => setActiveIndex(index),
                mouseout: () => setActiveIndex(null),
                click: () => console.log(`Selected site: ${site.name}`),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg text-gray-900">
                      {site.name}
                    </h4>
                    <Chip
                      label={site.status}
                      size="small"
                      className={`${
                        site.status === "Verified"
                          ? "bg-green-100 text-green-800"
                          : site.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {site.description}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500 mb-1">
                          NDVI Improvement
                        </span>
                        <span className="font-medium text-green-600 flex items-center">
                          <TrendingUp fontSize="small" className="mr-1" />+
                          {(site.ndviChange * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 mb-1">
                          Carbon Captured
                        </span>
                        <span className="font-medium text-gray-900">
                          {site.carbon.toLocaleString()} tons
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="contained"
                    fullWidth
                    className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300"
                    endIcon={<ArrowForward />}
                  >
                    View Detailed Analysis
                  </Button>
                </div>
              </Popup>
            </Marker>

            {/* Site area polygon */}
            <Polygon
              positions={site.area}
              pathOptions={{
                color:
                  site.status === "Verified"
                    ? "#10B981"
                    : site.status === "In Progress"
                    ? "#3B82F6"
                    : "#F59E0B",
                fillOpacity: 0.3,
                weight: 2,
              }}
            >
              <Tooltip direction="center" permanent>
                <span className="text-xs font-bold">{site.name}</span>
              </Tooltip>
            </Polygon>
          </div>
        ))}
      </MapContainer>

      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Public fontSize="small" className="text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {siteData.length} Active Projects
              </div>
              <div className="text-xs text-gray-500">
                Across{" "}
                {
                  Array.from(
                    new Set(siteData.map((site) => site.coords[0].toFixed(0)))
                  ).length
                }{" "}
                countries
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Chip
              size="small"
              icon={
                <span className="w-2 h-2 rounded-full bg-green-500 ml-2"></span>
              }
              label="Verified"
              className="bg-green-50 text-green-700"
            />
            <Chip
              size="small"
              icon={
                <span className="w-2 h-2 rounded-full bg-blue-500 ml-2"></span>
              }
              label="In Progress"
              className="bg-blue-50 text-blue-700"
            />
            <Chip
              size="small"
              icon={
                <span className="w-2 h-2 rounded-full bg-amber-500 ml-2"></span>
              }
              label="Pending"
              className="bg-amber-50 text-amber-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
