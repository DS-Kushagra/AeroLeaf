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

// Enhanced site data with more details
const siteData = [
  {
    id: 1,
    name: "Nandurbar Reforestation",
    description: "Community-led reforestation project in Maharashtra",
    status: "Verified",
    ndviChange: 0.37,
    carbon: 2450,
    coords: [22.5726, 88.3639],
    area: [
      [22.5725, 88.3637],
      [22.5728, 88.3637],
      [22.5728, 88.364],
      [22.5725, 88.364],
    ],
  },
  {
    id: 2,
    name: "Taita Hills Project",
    description: "Forest restoration in Eastern Arc Mountains",
    status: "Verified",
    ndviChange: 0.29,
    carbon: 1850,
    coords: [19.076, 72.8777],
    area: [
      [19.0759, 72.8775],
      [19.0762, 72.8775],
      [19.0762, 72.8779],
      [19.0759, 72.8779],
    ],
  },
  {
    id: 3,
    name: "Rio Doce Park",
    description: "Atlantic Forest recovery initiative",
    status: "Pending",
    ndviChange: 0.21,
    carbon: 980,
    coords: [-19.7548, -42.5806],
    area: [
      [-19.7547, -42.5805],
      [-19.7549, -42.5805],
      [-19.7549, -42.5807],
      [-19.7547, -42.5807],
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
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reforestation Sites</h3>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              mapStyle === "satellite" ? "bg-green-500" : "bg-gray-700"
            }`}
            onClick={() => setMapStyle("satellite")}
          >
            Satellite
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              mapStyle === "streets" ? "bg-green-500" : "bg-gray-700"
            }`}
            onClick={() => setMapStyle("streets")}
          >
            Streets
          </button>
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
                <div className="p-2">
                  <h4 className="font-bold text-lg">{site.name}</h4>
                  <p className="text-sm text-gray-600">{site.description}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`ml-1 font-medium ${
                          site.status === "Verified"
                            ? "text-green-600"
                            : site.status === "In Progress"
                            ? "text-blue-600"
                            : "text-amber-600"
                        }`}
                      >
                        {site.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">NDVI Change:</span>
                      <span className="ml-1 font-medium">
                        +{site.ndviChange}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Carbon:</span>
                      <span className="ml-1 font-medium">
                        {site.carbon} tons
                      </span>
                    </div>
                  </div>
                  <button className="mt-2 w-full py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors">
                    View Details
                  </button>
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

      <div className="bg-white p-3 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {siteData.length} reforestation sites monitored
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
              <span className="text-xs">Verified</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
              <span className="text-xs">In Progress</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
              <span className="text-xs">Pending</span>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
