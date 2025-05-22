import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
// Removed icon imports that were causing issues
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "projects", "market", "impact"
  const [stats, setStats] = useState({
    totalCredits: 0,
    totalCarbon: 0,
    carbonByProject: [],
    creditVolume: [],
    priceHistory: [],
    environmentalImpact: {},
    projectDetails: [],
    marketTrends: {},
    regionData: [],
  });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);

        // In a real app, this would fetch analytics data from the API
        // const data = await analyticsApi.getStats();
        // setStats(data);

        // Mock data for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Enhanced mock data with more detailed information
        setStats({
          totalCredits: 58,
          totalCarbon: 742.5,
          carbonByProject: [
            { name: "Nandurbar Forest", value: 320.2 },
            { name: "Taita Hills", value: 215.8 },
            { name: "Rio Doce", value: 168.5 },
            { name: "Other", value: 38.0 },
          ],
          creditVolume: [
            { month: "Jan", credits: 12 },
            { month: "Feb", credits: 15 },
            { month: "Mar", credits: 22 },
            { month: "Apr", credits: 30 },
            { month: "May", credits: 58 },
          ],
          priceHistory: [
            { month: "Jan", price: 14.2 },
            { month: "Feb", price: 15.8 },
            { month: "Mar", price: 15.2 },
            { month: "Apr", price: 16.5 },
            { month: "May", price: 18.2 },
          ],
          environmentalImpact: {
            trees: 12500,
            area: 85.3,
            biodiversity: 23,
            waterQuality: 17.8,
            carbonOffset: 742.5,
            soilHealth: 78.5,
            wildlifeProtection: 42,
            ecosystemServices: 5.2,
          },
          projectDetails: [
            {
              id: "proj001",
              name: "Nandurbar Forest",
              location: "Maharashtra, India",
              startDate: "2022-03-15",
              area: 42.6,
              treeSpecies: ["Teak", "Bamboo", "Banyan"],
              carbonSeq: 320.2,
              verificationStatus: "verified",
              verifier: "EcoWatch International",
              lastVerified: "2025-03-10",
              ndviChange: 0.28,
            },
            {
              id: "proj002",
              name: "Taita Hills",
              location: "Kenya",
              startDate: "2023-01-20",
              area: 24.2,
              treeSpecies: ["Acacia", "Cedar", "Olive"],
              carbonSeq: 215.8,
              verificationStatus: "verified",
              verifier: "Carbon Trust",
              lastVerified: "2025-04-22",
              ndviChange: 0.22,
            },
            {
              id: "proj003",
              name: "Rio Doce",
              location: "Brazil",
              startDate: "2023-09-05",
              area: 18.5,
              treeSpecies: ["Mahogany", "Ipe", "Brazil Nut"],
              carbonSeq: 168.5,
              verificationStatus: "pending",
              verifier: "Rainforest Alliance",
              lastVerified: "2025-02-18",
              ndviChange: 0.17,
            },
          ],
          marketTrends: {
            averageTokenValue: {
              current: 18.2,
              lastMonth: 16.5,
              growth: 10.3,
            },
            volumeTrends: {
              daily: [22, 19, 25, 28, 31, 27, 30],
              weekly: [145, 152, 168, 172, 190],
            },
            projectedGrowth: 12.5,
            marketCap: 1054280,
            totalTransactions: 283,
          },
          regionData: [
            { region: "South Asia", credits: 320, projects: 5 },
            { region: "Africa", credits: 225, projects: 3 },
            { region: "South America", credits: 168, projects: 2 },
            { region: "Southeast Asia", credits: 29, projects: 2 },
          ],
        });

        setError(null);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError("Could not load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-6 p-5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-xl enhanced-card">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="font-bold"
        >
          Carbon Credits Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1" className="mb-4">
          Comprehensive analytics and insights for carbon credit projects,
          market performance, and environmental impact
        </Typography>

        <Paper className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
          <Grid container spacing={3} className="text-center">
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" className="text-black opacity-75">
                Total Credits
              </Typography>
              <Typography variant="h4" className="font-bold">
                {stats.totalCredits}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" className="text-black opacity-75">
                Carbon Sequestered
              </Typography>
              <Typography variant="h4" className="font-bold">
                {stats.totalCarbon} t
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" className="text-black opacity-75">
                Projects
              </Typography>
              <Typography variant="h4" className="font-bold">
                {stats.projectDetails?.length || 3}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" className="text-black opacity-75">
                Avg. Price
              </Typography>
              <Typography variant="h4" className="font-bold">
                {stats.marketTrends?.averageTokenValue?.current || 18.2} MATIC
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Analytics Navigation Tabs */}
      <Paper className="mb-6 enhanced-card">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="px-2">
          {" "}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="analytics tabs"
          >
            <Tab value="overview" label="Overview" />
            <Tab value="projects" label="Projects" />
            <Tab value="market" label="Market" />
            <Tab value="impact" label="Environmental Impact" />
          </Tabs>
        </Box>
      </Paper>

      {error && (
        <Paper className="p-4 mb-6 bg-red-100 text-red-700 enhanced-card">
          <Typography>{error}</Typography>
        </Paper>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* Enhanced Summary Cards */}
          <Grid container spacing={3} className="mb-8">
            <Grid item xs={12} sm={6} md={3}>
              <Card className="enhanced-card stats-card">
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    className="font-medium"
                  >
                    Total Carbon Credits
                  </Typography>{" "}
                  <Typography variant="h4" className="font-bold">
                    {stats.totalCredits}
                  </Typography>
                  <Box display="flex" alignItems="center" className="mt-2">
                    <span className="text-green-500 mr-1">▲</span>
                    <Typography variant="body2" className="text-green-500">
                      +24% from last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="enhanced-card stats-card-secondary">
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    className="font-medium"
                  >
                    Carbon Sequestered
                  </Typography>{" "}
                  <Typography variant="h4" className="font-bold">
                    {stats.totalCarbon} t
                  </Typography>
                  <Box display="flex" alignItems="center" className="mt-2">
                    <span className="text-green-500 mr-1">▲</span>
                    <Typography variant="body2" className="text-green-500">
                      +17.2% YTD
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="enhanced-card stats-card-success">
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    className="font-medium"
                  >
                    Trees Protected
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {stats.environmentalImpact?.trees.toLocaleString()}
                  </Typography>
                  <Box className="mt-2">
                    <Chip
                      label="Target: 15,000"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="enhanced-card stats-card-accent">
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    className="font-medium"
                  >
                    Area Protected
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {stats.environmentalImpact?.area} ha
                  </Typography>
                  <Box className="mt-2">
                    <Typography variant="body2" color="textSecondary">
                      Across {stats.regionData?.length || 4} regions
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={4} className="mb-8">
            <Grid item xs={12} md={6}>
              <Paper className="p-4 enhanced-card">
                <Typography variant="h6" gutterBottom className="font-semibold">
                  Carbon by Project
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.carbonByProject}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {stats.carbonByProject.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} tCO₂e`} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="p-4 enhanced-card">
                <Typography variant="h6" gutterBottom className="font-semibold">
                  Credit Growth (2025)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={stats.creditVolume}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="credits"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Total Credits"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Price History */}
          <Paper className="p-4 mb-8 enhanced-card">
            <Typography variant="h6" gutterBottom className="font-semibold">
              Average Credit Price (MATIC)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={stats.priceHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip formatter={(value) => `${value} MATIC`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                  name="Price (MATIC)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}

      {/* PROJECTS TAB */}
      {activeTab === "projects" && (
        <>
          <Paper className="p-5 mb-6 enhanced-card">
            <Typography variant="h6" className="mb-4 font-semibold">
              Reforestation Project Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Project</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Location</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Area (ha)</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Carbon (t)</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>NDVI Change</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.projectDetails.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>{project.area}</TableCell>
                      <TableCell>{project.carbonSeq}</TableCell>{" "}
                      <TableCell>
                        {project.verificationStatus === "verified" ? (
                          <Chip
                            label="✓ Verified"
                            size="small"
                            color="success"
                          />
                        ) : (
                          <Chip
                            label="⏱️ Pending"
                            size="small"
                            color="warning"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <span>+{(project.ndviChange * 100).toFixed(1)}%</span>
                          <Box
                            ml={1}
                            width={60}
                            height={6}
                            bgcolor={`rgba(33, 150, 83, ${project.ndviChange})`}
                            borderRadius={3}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Grid container spacing={4} className="mb-8">
            <Grid item xs={12} md={6}>
              <Paper className="p-4 enhanced-card">
                <Typography variant="h6" gutterBottom className="font-semibold">
                  Carbon Sequestration by Region
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={stats.regionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="credits"
                      name="Carbon Credits (t)"
                      fill="#8884d8"
                    />
                    <Bar
                      dataKey="projects"
                      name="Number of Projects"
                      fill="#82ca9d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="p-4 enhanced-card">
                <Typography variant="h6" gutterBottom className="font-semibold">
                  Project Verification Timeline
                </Typography>
                <Box className="p-2">
                  {stats.projectDetails.map((project) => (
                    <Box
                      key={project.id}
                      className="mb-3 pb-3 border-b border-gray-200"
                    >
                      <Grid container alignItems="center">
                        <Grid item xs={6}>
                          <Typography variant="body1" className="font-medium">
                            {project.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {project.location}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                          >
                            <Box className="text-right">
                              <Typography
                                variant="body2"
                                className="font-medium"
                              >
                                {project.verificationStatus === "verified" ? (
                                  <span className="text-green-600">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-amber-600">
                                    Pending
                                  </span>
                                )}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {project.verificationStatus === "verified"
                                  ? `Verified on ${project.lastVerified}`
                                  : "Awaiting verification"}
                              </Typography>
                            </Box>{" "}
                            {project.verificationStatus === "verified" && (
                              <span className="ml-2 text-green-600">✓</span>
                            )}
                            {project.verificationStatus !== "verified" && (
                              <span className="ml-2 text-amber-600">⏱️</span>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* MARKET TAB */}
      {activeTab === "market" && (
        <>
          <Grid container spacing={3} className="mb-8">
            <Grid item xs={12} sm={6} md={3}>
              <Card className="enhanced-card stats-card">
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    className="font-medium"
                  >
                    Avg. Credit Price
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {stats.marketTrends.averageTokenValue.current} MATIC
                  </Typography>{" "}
                  <Box display="flex" alignItems="center" className="mt-2">
                    <span className="text-green-500 mr-1">▲</span>
                    <Typography variant="body2" className="text-green-500">
                      +{stats.marketTrends.averageTokenValue.growth}% MoM
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="enhanced-card stats-card-secondary">
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    className="font-medium"
                  >
                    Market Cap
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {(stats.marketTrends.marketCap / 1000).toFixed(1)}K MATIC
                  </Typography>
                  <Box display="flex" alignItems="center" className="mt-2">
                    <Typography variant="body2" color="textSecondary">
                      Based on {stats.totalCredits} total credits
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="enhanced-card stats-card-accent">
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    className="font-medium"
                  >
                    Total Transactions
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {stats.marketTrends.totalTransactions}
                  </Typography>
                  <Box className="mt-2">
                    <Typography variant="body2" color="textSecondary">
                      Lifetime platform volume
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="enhanced-card stats-card-success">
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    className="font-medium"
                  >
                    Projected Growth
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {stats.marketTrends.projectedGrowth}%
                  </Typography>
                  <Box className="mt-2">
                    <Typography variant="body2" color="textSecondary">
                      Next quarter estimate
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4} className="mb-8">
            <Grid item xs={12} md={8}>
              <Paper className="p-4 enhanced-card">
                <Typography variant="h6" gutterBottom className="font-semibold">
                  Daily Trading Volume (Last 7 Days)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={stats.marketTrends.volumeTrends.daily.map(
                      (volume, index) => ({
                        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                          index
                        ],
                        volume,
                      })
                    )}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} credits`} />
                    <Legend />
                    <Bar
                      dataKey="volume"
                      name="Trading Volume"
                      fill="#3f51b5"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="p-4 enhanced-card">
                <Typography variant="h6" gutterBottom className="font-semibold">
                  Price Correlation
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="area" unit="ha" />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="price"
                      unit="MATIC"
                    />
                    <ZAxis
                      type="number"
                      dataKey="z"
                      range={[50, 400]}
                      name="volume"
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter
                      name="Project Size vs. Price"
                      data={[
                        { x: 42.6, y: 17.8, z: 320 },
                        { x: 24.2, y: 18.2, z: 215 },
                        { x: 18.5, y: 16.9, z: 168 },
                        { x: 10.2, y: 15.4, z: 86 },
                        { x: 31.8, y: 18.6, z: 258 },
                      ]}
                      fill="#8884d8"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* ENVIRONMENTAL IMPACT TAB */}
      {activeTab === "impact" && (
        <>
          <Grid container spacing={3} className="mb-6">
            <Grid item xs={12}>
              <Paper className="p-5 enhanced-card">
                <Typography variant="h6" className="mb-4 font-semibold">
                  Environmental Impact Metrics
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      className="font-medium"
                    >
                      Key Metrics
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <strong>Trees Protected</strong>
                            </TableCell>
                            <TableCell>
                              {stats.environmentalImpact.trees.toLocaleString()}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Area Protected</strong>
                            </TableCell>
                            <TableCell>
                              {stats.environmentalImpact.area} hectares
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Carbon Offset</strong>
                            </TableCell>
                            <TableCell>
                              {stats.environmentalImpact.carbonOffset} tons CO₂
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Biodiversity Impact</strong>
                            </TableCell>
                            <TableCell>
                              {stats.environmentalImpact.biodiversity} species
                              protected
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Water Quality</strong>
                            </TableCell>
                            <TableCell>
                              {stats.environmentalImpact.waterQuality}% improved
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Wildlife Protection</strong>
                            </TableCell>
                            <TableCell>
                              {stats.environmentalImpact.wildlifeProtection}{" "}
                              endangered species
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      className="font-medium"
                    >
                      Impact Radar
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart
                        outerRadius={90}
                        data={[
                          {
                            subject: "Carbon",
                            A: stats.environmentalImpact.carbonOffset / 10,
                            fullMark: 100,
                          },
                          {
                            subject: "Trees",
                            A: stats.environmentalImpact.trees / 200,
                            fullMark: 100,
                          },
                          {
                            subject: "Water",
                            A: stats.environmentalImpact.waterQuality,
                            fullMark: 100,
                          },
                          {
                            subject: "Wildlife",
                            A: stats.environmentalImpact.wildlifeProtection * 2,
                            fullMark: 100,
                          },
                          {
                            subject: "Soil",
                            A: stats.environmentalImpact.soilHealth,
                            fullMark: 100,
                          },
                          {
                            subject: "Biodiversity",
                            A: stats.environmentalImpact.biodiversity * 4,
                            fullMark: 100,
                          },
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Impact"
                          dataKey="A"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.6}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={4} className="mb-8">
            <Grid item xs={12} md={6}>
              <Paper className="p-4 enhanced-card">
                <Typography variant="h6" gutterBottom className="font-semibold">
                  NDVI Change Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      {
                        month: "Jan",
                        Nandurbar: 0.52,
                        Taita: 0.45,
                        RioDoce: 0.67,
                      },
                      {
                        month: "Feb",
                        Nandurbar: 0.54,
                        Taita: 0.47,
                        RioDoce: 0.68,
                      },
                      {
                        month: "Mar",
                        Nandurbar: 0.57,
                        Taita: 0.5,
                        RioDoce: 0.69,
                      },
                      {
                        month: "Apr",
                        Nandurbar: 0.62,
                        Taita: 0.53,
                        RioDoce: 0.71,
                      },
                      {
                        month: "May",
                        Nandurbar: 0.65,
                        Taita: 0.55,
                        RioDoce: 0.73,
                      },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0.4, 0.8]} />
                    <Tooltip formatter={(value) => `NDVI: ${value}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Nandurbar"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Taita"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="RioDoce"
                      stroke="#ffc658"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="p-4 enhanced-card">
                <Typography variant="h6" gutterBottom className="font-semibold">
                  Carbon Sequestration Rate
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={stats.projectDetails.map((project) => ({
                      name: project.name,
                      rate: (project.carbonSeq / project.area).toFixed(2),
                      total: project.carbonSeq,
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="rate"
                      name="Rate (t/ha)"
                      fill="#8884d8"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="total"
                      name="Total (t)"
                      fill="#82ca9d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      <Box className="text-center mt-8">
        <Button
          component={Link}
          to="/marketplace"
          variant="contained"
          color="primary"
          size="large"
          className="enhanced-card"
          sx={{ px: 4, py: 1.2 }}
        >
          Go to Marketplace
        </Button>
      </Box>
    </Container>
  );
}
