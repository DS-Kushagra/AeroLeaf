import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

const NDVIChart = ({ siteId }) => {
  const [ndviData, setNdviData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNDVIData = async () => {
      try {
        // Try to fetch NDVI data from the backend API
        try {
          const response = await fetch(`/api/sites/${siteId}/ndvi`);
          if (response.ok) {
            const data = await response.json();
            // Transform API data to chart format
            const chartData = [
              {
                id: "NDVI Values",
                color: "hsl(125, 70%, 50%)",
                data: data.ndvi_history.map((item) => ({
                  x: new Date(item.date).toISOString().split("T")[0],
                  y: item.ndvi,
                })),
              },
            ];
            setNdviData(chartData);
            setIsLoading(false);
            return;
          }
        } catch (apiError) {
          console.log("API not available, using mock data", apiError);
        }

        // Fallback to mock data if API fails
        const mockData = [
          {
            id: "NDVI Values",
            color: "hsl(125, 70%, 50%)",
            data: [
              { x: "2023-01", y: 0.21 },
              { x: "2023-06", y: 0.25 },
              { x: "2023-12", y: 0.28 },
              { x: "2024-01", y: 0.31 },
              { x: "2024-03", y: 0.38 },
              { x: "2024-06", y: 0.42 },
              { x: "2025-01", y: 0.45 },
            ],
          },
        ];

        setNdviData(mockData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching NDVI data:", err);
        setError("Failed to load NDVI data");
        setIsLoading(false);
      }
    };

    fetchNDVIData();
  }, [siteId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="h-64 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">NDVI Progress Over Time</h3>
      <div className="h-48">
        <ResponsiveLine
          data={ndviData}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.2f"
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Date",
            legendOffset: 40,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "NDVI Value",
            legendOffset: -50,
            legendPosition: "middle",
          }}
          colors={{ scheme: "greens" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[]}
          enableArea={true}
          areaOpacity={0.2}
        />
      </div>
    </div>
  );
};

export default NDVIChart;
