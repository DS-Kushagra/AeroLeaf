import { useState, useEffect } from "react";
import { sitesApi } from "../services/api";

export default function ReviewSites() {
  const [flaggedSites, setFlaggedSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSites() {
      try {
        const data = await sitesApi.getSitesForReview();
        setFlaggedSites(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchSites();
  }, []);
  const markAsVerified = async (siteId) => {
    try {
      await sitesApi.verifySite(siteId);
      // Refresh the site list
      setFlaggedSites(flaggedSites.filter((site) => site.id !== siteId));
    } catch (err) {
      console.error("Failed to mark site as verified:", err);
    }
  };

  const escalateToDispute = async (siteId) => {
    try {
      // If this API endpoint doesn't exist yet, we'll need to add it to the backend
      // For now, we'll just update the UI
      // await sitesApi.escalateSite(siteId);

      // Update the site status in the UI
      setFlaggedSites(
        flaggedSites.map((site) =>
          site.id === siteId ? { ...site, status: "escalated" } : site
        )
      );
    } catch (err) {
      console.error("Failed to escalate site:", err);
    }
  };
  if (loading) return <div>Loading sites needing review...</div>;
  if (error) return <div>Error loading sites: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Sites Flagged For Review</h1>

      {flaggedSites.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-lg text-gray-600">
            No sites currently need review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flaggedSites.map((site) => (
            <div
              key={site.id}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{site.name}</h2>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  {site.status}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{site.region}</p>
              <p className="text-gray-700 mt-4">
                Area: {site.area_hectares} hectares
              </p>

              <div className="mt-4">
                <h3 className="font-semibold text-red-600">Flagged Issues:</h3>
                <ul className="list-disc pl-5 mt-1">
                  {site.flagged_issues &&
                    site.flagged_issues.map((issue, idx) => (
                      <li key={idx} className="text-gray-700">
                        {issue}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => markAsVerified(site.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Mark as Verified
                </button>
                <button
                  onClick={() => escalateToDispute(site.id)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Escalate to Dispute
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
