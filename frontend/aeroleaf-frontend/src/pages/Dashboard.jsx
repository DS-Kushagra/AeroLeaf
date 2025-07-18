import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  ButtonGroup,
} from "@mui/material";
import {
  ShoppingCart,
  RestoreFromTrash,
  Analytics,
  ArrowUpward,
  ArrowDownward,
  ShowChart,
  PieChart,
  TrendingUp,
  School,
  School as SchoolIcon,
  Map,
  ViewList,
  LocalAtm,
  Nature,
  Public,
  Timeline,
  VerifiedUser,
  CheckCircle,
  AccountCircle,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import MapView from "../components/MapView";
import CarbonStats from "../components/CarbonStats";
import VerificationProgress from "../components/VerificationProgress";
import UserProfile from "../components/UserProfile";
import Settings from "../components/Settings";
import RetireCredit from "../components/RetireCredit";
import SatelliteComparison from "../components/SatelliteComparison";
import NDVIChart from "../components/NDVIChart";
import { creditsApi } from "../services/api";
import { useHelp } from "../contexts/HelpContext";
import { useAuth } from "../contexts/AuthContext";
import InfoCard from "../components/InfoCard";
import { HelpTooltip } from "../components/Tooltip";

export default function Dashboard() {
  const { startGuidedTour } = useHelp();
  const { currentUser, loading: authLoading } = useAuth();
  const [monthOffset, setMonthOffset] = useState(0);
  const [userCredits, setUserCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retireDialogOpen, setRetireDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [viewType, setViewType] = useState("map"); // 'map' or 'list' for reforestation sites
  const [statsVisible, setStatsVisible] = useState(false);

  const handleOpenRetireDialog = (credit) => {
    setSelectedCredit(credit);
    setRetireDialogOpen(true);
  };

  const handleCloseRetireDialog = () => {
    setRetireDialogOpen(false);
    setSelectedCredit(null);
  };

  const handleCreditRetired = (creditId, reason) => {
    // In a real application, this would update the API
    // For now, we'll update the local state to reflect the change
    setUserCredits((prev) =>
      prev.map((credit) =>
        credit.id === creditId
          ? {
              ...credit,
              status: "retired",
              retired_reason: reason,
              retired_date: new Date().toISOString(),
            }
          : credit
      )
    );
  };

  useEffect(() => {
    // Animation for stats section
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    const statsElement = document.getElementById("stats-section");
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => {
      if (statsElement) {
        observer.unobserve(statsElement);
      }
    };
  }, []);

  useEffect(() => {
    // Only fetch user data when authenticated
    if (currentUser && !authLoading) {
      fetchUserCredits();
    } else if (!authLoading && !currentUser) {
      // User not authenticated, clear data
      setUserCredits([]);
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  // Fetch user's carbon credits from the backend (currently using mock data)
  async function fetchUserCredits() {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with real API call when backend is ready
      // const data = await creditsApi.getUserCredits();
      // setUserCredits(data);

      // Mock data for demonstration - will be replaced with API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUserCredits([
        {
          id: "cc_001",
          token_id: "CC001",
          project_id: "site_001",
          project_name: "Nandurbar Reforestation",
          amount: 15.5,
          status: "verified",
          vintage: "2023",
          acquired_date: "2024-02-15",
          location: "Maharashtra, India",
          image:
            "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
          co2_equivalent: 15.5,
        },
        {
          id: "cc_002",
          token_id: "CC002",
          project_id: "site_003",
          project_name: "Taita Hills Conservation",
          amount: 22.3,
          status: "pending",
          vintage: "2024",
          acquired_date: "2025-01-10",
          location: "Kenya",
          image:
            "https://images.unsplash.com/photo-1504567961542-e24d9439a724?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80",
          co2_equivalent: 22.3,
        },
        {
          id: "cc_003",
          token_id: "CC003",
          project_id: "site_002",
          project_name: "Amazon Reforestation",
          amount: 10.2,
          status: "retired",
          vintage: "2023",
          acquired_date: "2024-03-20",
          retired_date: "2024-12-15",
          retired_reason: "Annual Carbon Offset Program",
          location: "Brazil",
          image:
            "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80",
          co2_equivalent: 10.2,
        },
      ]);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch user's carbon credits:", err);
      setError("Could not load your carbon credits. Please try again later.");
      setLoading(false);
    }
  }

  const timeLabels = [
    "24 months ago",
    "18 months ago",
    "12 months ago",
    "6 months ago",
    "Current",
  ];

  // Show loading spinner while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" className="mt-4 text-gray-600">
            Loading your dashboard...
          </Typography>
        </div>
      </div>
    );
  }

  // Show message for unauthenticated users
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Container maxWidth="sm" className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Typography variant="h4" className="mb-4 text-gray-800">
              Welcome to AeroLeaf
            </Typography>
            <Typography variant="body1" className="mb-6 text-gray-600">
              Please sign in to access your carbon credit dashboard and manage
              your portfolio.
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              className="bg-green-600 hover:bg-green-700"
            >
              Sign In
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <Container maxWidth="xl" className="py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8 fade-in">
          <div>
            <Typography
              variant="h4"
              component="h1"
              className="font-bold mb-1 text-gray-800"
            >
              Dashboard
              <HelpTooltip title="This is your main dashboard where you can monitor your carbon credits and explore reforestation sites" />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome back! Here's an overview of your carbon credit portfolio.
            </Typography>
          </div>
          <div className="hidden md:block">
            <Button
              component={Link}
              to="/marketplace"
              variant="contained"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all mr-2"
            >
              Explore Marketplace
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SchoolIcon />}
              onClick={startGuidedTour}
            >
              Take a Tour
            </Button>
          </div>
        </div>
        <InfoCard
          title="Getting Started with AeroLeaf"
          id="dashboard-welcome"
          defaultExpanded={true}
        >
          <Typography variant="body1" paragraph>
            Welcome to your AeroLeaf dashboard! Here you can monitor your carbon
            credits, explore reforestation sites, and track your environmental
            impact.
          </Typography>
          <Typography variant="body1">
            Use the interactive map below to explore reforestation sites. Click
            on a marker to view basic information about the site and access
            detailed analytics.
          </Typography>
        </InfoCard>
        {/* Quick Stats Cards */}
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <Typography
                  variant="body2"
                  className="flex items-center font-medium text-green-800"
                >
                  <ShowChart fontSize="small" className="mr-2 text-green-600" />
                  Total Carbon Offsets
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  className="font-bold my-2 text-gray-900"
                >
                  48.0
                  <span className="text-lg ml-1 font-medium text-gray-600">
                    tCO₂e
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  className="flex items-center text-green-600"
                >
                  <ArrowUpward fontSize="small" className="mr-1" /> +5.2% from
                  last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <Typography
                  variant="body2"
                  className="flex items-center font-medium text-blue-800"
                >
                  <PieChart fontSize="small" className="mr-2 text-blue-600" />
                  Active Credits
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  className="font-bold my-2 text-gray-900"
                >
                  37.8
                  <span className="text-lg ml-1 font-medium text-gray-600">
                    tCO₂e
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  className="flex items-center gap-1 text-blue-700"
                >
                  <VerifiedUser fontSize="small" />2 active certificates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <Typography
                  variant="body2"
                  className="flex items-center font-medium text-amber-800"
                >
                  <Analytics fontSize="small" className="mr-2 text-amber-600" />
                  Pending Verification
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  className="font-bold my-2 text-gray-900"
                >
                  22.3
                  <span className="text-lg ml-1 font-medium text-gray-600">
                    tCO₂e
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  className="flex items-center gap-1 text-amber-700"
                >
                  <Timeline fontSize="small" />
                  Estimated completion in 14 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4">
                <Typography
                  variant="body2"
                  className="flex items-center font-medium text-purple-800"
                >
                  <RestoreFromTrash
                    fontSize="small"
                    className="mr-2 text-purple-600"
                  />
                  Retired Credits
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  className="font-bold my-2 text-gray-900"
                >
                  10.2
                  <span className="text-lg ml-1 font-medium text-gray-600">
                    tCO₂e
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  className="flex items-center gap-1 text-purple-700"
                >
                  <CheckCircle fontSize="small" />1 certificate retired
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Reforestation Sites Section */}
        <Box className="mb-10 card bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Typography
                variant="h5"
                component="h2"
                className="font-bold text-gray-900 mb-1"
              >
                Reforestation Sites
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Interactive visualization of our global reforestation projects
              </Typography>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewType === "map" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewType("map")}
                className={
                  viewType === "map" ? "bg-green-600 hover:bg-green-700" : ""
                }
                startIcon={<Map />}
              >
                Map View
              </Button>
              <Button
                variant={viewType === "list" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewType("list")}
                className={
                  viewType === "list" ? "bg-green-600 hover:bg-green-700" : ""
                }
                startIcon={<ViewList />}
              >
                List View
              </Button>
            </div>
          </div>

          <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Typography className="mb-3 text-gray-700 font-medium flex items-center gap-2">
              <Timeline fontSize="small" />
              Time Period:{" "}
              <span className="text-green-600 font-semibold">
                {timeLabels[Math.floor(monthOffset / 6)]}
              </span>
            </Typography>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <div className="w-full sm:w-3/4 px-2">
                <input
                  type="range"
                  min={0}
                  max={24}
                  step={6}
                  value={monthOffset}
                  onChange={(e) => setMonthOffset(Number(e.target.value))}
                  className="w-full accent-green-600 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                />
              </div>
              <div className="flex justify-between w-full sm:w-1/4 px-4">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <ArrowUpward fontSize="small" className="text-gray-400" />
                  Past
                </span>
                <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  Current
                  <ArrowDownward fontSize="small" className="text-gray-400" />
                </span>
              </div>
            </div>
          </div>

          {viewType === "map" ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-inner bg-gray-50">
              <MapView offset={monthOffset} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-48 bg-gray-100 animate-pulse rounded-lg"
                      ></div>
                    ))
                : userCredits.map((credit) => (
                    <Link
                      to={`/site/${credit.project_id}`}
                      key={credit.project_id}
                      className="block"
                    >
                      <div className="relative h-48 rounded-lg overflow-hidden group shadow-md hover:shadow-lg transition-all">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                        <img
                          src={credit.image}
                          alt={credit.project_name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                          <Typography variant="h6" className="font-bold">
                            {credit.project_name}
                          </Typography>
                          <Typography variant="body2">
                            {credit.location}
                          </Typography>
                          <div className="flex items-center mt-2">
                            <Chip
                              label={`${credit.co2_equivalent} tCO₂e`}
                              size="small"
                              className="bg-white/30 text-white backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          )}
        </Box>
        {/* User's Carbon Credits */}
        <Box className="mb-10 card bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <Typography
                variant="h5"
                component="h2"
                className="font-bold text-gray-900 mb-1"
              >
                Carbon Credit Portfolio
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Manage and track your verified carbon credits
              </Typography>
            </div>
            <div className="flex gap-3 self-end sm:self-auto">
              <Button
                startIcon={<RestoreFromTrash />}
                variant="outlined"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Retire Credits
              </Button>
              <Button
                component={Link}
                to="/marketplace"
                startIcon={<ShoppingCart />}
                variant="contained"
                className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
              >
                Trade Credits
              </Button>
            </div>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={6}>
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            <Box
              p={4}
              className="bg-red-50 text-red-700 rounded-lg border border-red-200"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </Box>
          ) : userCredits.length === 0 ? (
            <Box
              p={6}
              className="text-center bg-gray-50 rounded-lg border border-dashed border-gray-300"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="text-gray-400" fontSize="large" />
              </div>
              <Typography variant="h6" className="text-gray-500 mb-2">
                No Carbon Credits Yet
              </Typography>
              <Typography variant="body2" className="text-gray-500 mb-4">
                You haven't purchased any carbon credits yet. Visit the
                marketplace to get started.
              </Typography>
              <Button
                component={Link}
                to="/marketplace"
                variant="outlined"
                color="primary"
                className="mt-2"
              >
                Go to Marketplace
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {userCredits.map((credit) => (
                <Grid item xs={12} md={6} lg={4} key={credit.id}>
                  <Card
                    className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      credit.status === "retired"
                        ? "bg-gray-50 border-2 border-gray-200"
                        : "bg-white border border-gray-100"
                    }`}
                  >
                    <CardContent className="p-6">
                      <Box className="flex justify-between items-start mb-4">
                        <div>
                          <Typography
                            variant="h6"
                            className="font-bold text-gray-900 mb-1"
                          >
                            {credit.project_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            className="text-gray-500 flex items-center gap-1"
                          >
                            <LocalAtm fontSize="small" />
                            Token #{credit.token_id}
                          </Typography>
                        </div>
                        <Chip
                          label={credit.status.toUpperCase()}
                          icon={
                            credit.status === "verified" ? (
                              <VerifiedUser />
                            ) : undefined
                          }
                          className={`font-medium ${
                            credit.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : credit.status === "retired"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                          size="small"
                        />
                      </Box>

                      <div className="flex mb-4">
                        <div className="w-24 h-24 rounded-md overflow-hidden mr-3 flex-shrink-0">
                          <img
                            src={credit.image}
                            alt={credit.project_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className="mb-0.5"
                          >
                            Location
                          </Typography>
                          <Typography
                            variant="body2"
                            className="mb-1 font-medium"
                          >
                            {credit.location}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className="mb-0.5"
                          >
                            Amount
                          </Typography>
                          <Typography
                            variant="body2"
                            className="mb-0 font-medium"
                          >
                            {credit.amount} tCO₂e
                          </Typography>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className="mb-0.5"
                          >
                            Vintage
                          </Typography>
                          <Typography variant="body2" className="font-medium">
                            {credit.vintage}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className="mb-0.5"
                          >
                            Acquired
                          </Typography>
                          <Typography variant="body2" className="font-medium">
                            {new Date(
                              credit.acquired_date
                            ).toLocaleDateString()}
                          </Typography>
                        </div>
                      </div>

                      <ButtonGroup
                        variant="outlined"
                        fullWidth
                        className="mt-3"
                      >
                        <Button
                          color="primary"
                          component={Link}
                          to="/marketplace"
                          state={{ listCredit: credit }}
                          startIcon={<ShoppingCart fontSize="small" />}
                          disabled={credit.status === "retired"}
                          className={
                            credit.status !== "retired"
                              ? "hover:bg-green-50"
                              : ""
                          }
                        >
                          List for Sale
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => handleOpenRetireDialog(credit)}
                          startIcon={<RestoreFromTrash fontSize="small" />}
                          disabled={credit.status === "retired"}
                          className={
                            credit.status !== "retired"
                              ? "hover:bg-purple-50"
                              : ""
                          }
                        >
                          Retire
                        </Button>
                      </ButtonGroup>

                      {credit.status === "retired" && (
                        <Box
                          mt={2}
                          p={2}
                          bgcolor="rgba(0,0,0,0.03)"
                          borderRadius={1}
                        >
                          <Typography variant="body2" color="textSecondary">
                            <strong>Retired:</strong>{" "}
                            {new Date(credit.retired_date).toLocaleDateString()}
                          </Typography>
                          {credit.retired_reason && (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              display="block"
                            >
                              <strong>Reason:</strong> {credit.retired_reason}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        {/* Stats & Verification */}
        <Box
          id="stats-section"
          className="mb-10 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 shadow-lg border border-green-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <Typography
                variant="h5"
                component="h2"
                className="font-bold text-gray-900 mb-1"
              >
                Performance Analytics
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Track your environmental impact and verification progress
              </Typography>
            </div>
            <Button
              variant="outlined"
              className="border-green-600 text-green-600 hover:bg-green-50"
              startIcon={<Analytics />}
              component={Link}
              to="/analytics"
            >
              Full Analytics
            </Button>
          </div>
          <Grid container spacing={4}>
            <Grid
              item
              xs={12}
              md={6}
              className={`transition-all duration-700 transform ${
                statsVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <Card className="bg-white shadow h-full">
                <CardContent>
                  <Typography
                    variant="h6"
                    className="mb-4 font-semibold flex items-center gap-2"
                  >
                    <Timeline className="text-green-600" />
                    Carbon Offset Impact
                  </Typography>
                  <CarbonStats />
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              className={`transition-all duration-700 transform ${
                statsVisible
                  ? "translate-y-0 opacity-100 delay-300"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <Card className="bg-white shadow h-full">
                <CardContent>
                  <Typography
                    variant="h6"
                    className="mb-4 font-semibold flex items-center gap-2"
                  >
                    <VerifiedUser className="text-green-600" />
                    Verification Progress
                  </Typography>
                  <VerificationProgress />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        {/* Profile & Settings */}
        <Box className="mb-10 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Typography
                variant="h5"
                component="h2"
                className="font-bold text-gray-900 mb-1"
              >
                Account Management
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Manage your profile and customize platform settings
              </Typography>
            </div>
          </div>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card className="bg-white rounded-xl shadow-lg h-full hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <Typography
                    variant="h6"
                    className="mb-4 font-semibold flex items-center gap-2"
                  >
                    <AccountCircle className="text-indigo-600" />
                    User Profile
                  </Typography>
                  <UserProfile />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="bg-white rounded-xl shadow-lg h-full hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <Typography
                    variant="h6"
                    className="mb-4 font-semibold flex items-center gap-2"
                  >
                    <SettingsIcon className="text-indigo-600" />
                    Platform Settings
                  </Typography>
                  <Settings />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Grid item xs={12}>
          <Box className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <School className="text-blue-600 text-2xl" />
              </div>
              <div>
                <Typography variant="h5" className="font-bold text-gray-900">
                  Understanding Carbon Credits
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Learn how carbon credits work and their impact on the
                  environment
                </Typography>
              </div>
            </div>
            <div className="bg-white/50 rounded-lg p-5 backdrop-blur-sm">
              <Typography variant="body1" paragraph className="text-gray-700">
                Carbon credits represent one ton of carbon dioxide (CO₂) that
                has been sequestered (removed) from the atmosphere through
                reforestation or other carbon capture projects.
              </Typography>
              <Typography variant="body1" paragraph className="text-gray-700">
                Each credit in your portfolio has been verified through
                satellite imagery analysis and blockchain technology, ensuring
                transparency and reliability.
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                You can trade these credits in the Marketplace or retire them to
                offset your carbon footprint, permanently removing them from
                circulation.
              </Typography>
            </div>
          </Box>
        </Grid>
        {/* Mobile view marketplace button */}
        <Box className="fixed bottom-6 right-6 md:hidden z-50">
          <Button
            component={Link}
            to="/marketplace"
            variant="contained"
            className="bg-green-600 hover:bg-green-700 rounded-full w-14 h-14 shadow-xl hover:shadow-2xl transition-all duration-300"
            aria-label="Go to marketplace"
          >
            <ShoppingCart className="text-2xl" />
          </Button>
        </Box>{" "}
        {/* Retire Credit Dialog */}
        <RetireCredit
          credit={selectedCredit}
          open={retireDialogOpen}
          onClose={handleCloseRetireDialog}
          onRetired={handleCreditRetired}
        />
      </Container>
    </div>
  );
}
