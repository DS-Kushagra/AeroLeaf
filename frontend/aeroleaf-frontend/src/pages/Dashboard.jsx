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

export default function Dashboard() {
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
    // In a real application, this would fetch the user's credits
    // from the backend with proper authentication
    async function fetchUserCredits() {
      try {
        setLoading(true);

        // This endpoint would need to be implemented
        // const data = await creditsApi.getUserCredits();
        // setUserCredits(data);

        // Mock data for demo
        setTimeout(() => {
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
          setError(null);
        }, 1200);
      } catch (err) {
        console.error("Failed to fetch user's carbon credits:", err);
        setError("Could not load your carbon credits. Please try again later.");
        setLoading(false);
      }
    }

    fetchUserCredits();
  }, []);

  const timeLabels = [
    "24 months ago",
    "18 months ago",
    "12 months ago",
    "6 months ago",
    "Current",
  ];

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
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all"
            >
              Explore Marketplace
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <Grid container spacing={3} className="mb-8 fade-in">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-green-500 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-4">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="flex items-center"
                >
                  <ShowChart fontSize="small" className="mr-1 text-green-500" />
                  Total Carbon Offsets
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  className="font-bold my-1"
                >
                  48.0 tCO₂e
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
            <Card className="border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-4">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="flex items-center"
                >
                  <PieChart fontSize="small" className="mr-1 text-blue-500" />
                  Active Credits
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  className="font-bold my-1"
                >
                  37.8 tCO₂e
                </Typography>
                <Typography
                  variant="body2"
                  className="flex items-center text-blue-600"
                >
                  2 active certificates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-amber-500 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-4">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="flex items-center"
                >
                  <Analytics fontSize="small" className="mr-1 text-amber-500" />
                  Pending Verification
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  className="font-bold my-1"
                >
                  22.3 tCO₂e
                </Typography>
                <Typography
                  variant="body2"
                  className="flex items-center text-amber-600"
                >
                  Estimated completion in 14 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-4">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="flex items-center"
                >
                  <RestoreFromTrash
                    fontSize="small"
                    className="mr-1 text-purple-500"
                  />
                  Retired Credits
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  className="font-bold my-1"
                >
                  10.2 tCO₂e
                </Typography>
                <Typography
                  variant="body2"
                  className="flex items-center text-purple-600"
                >
                  1 certificate retired
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Reforestation Sites Section */}
        <Box className="mb-10 card bg-white rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <Typography
              variant="h5"
              component="h2"
              className="font-semibold text-gray-800"
            >
              Reforestation Sites
            </Typography>
            <div className="flex space-x-2">
              <Button
                variant={viewType === "map" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewType("map")}
              >
                Map View
              </Button>
              <Button
                variant={viewType === "list" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewType("list")}
              >
                List View
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <Typography className="mb-2 text-gray-600">
              Time period: {timeLabels[Math.floor(monthOffset / 6)]}
            </Typography>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <input
                type="range"
                min={0}
                max={24}
                step={6}
                value={monthOffset}
                onChange={(e) => setMonthOffset(Number(e.target.value))}
                className="w-full sm:w-3/4 accent-green-600"
              />
              <div className="flex justify-between w-full sm:w-1/4 px-2">
                <span className="text-sm text-gray-500">Past</span>
                <span className="text-sm text-gray-500">Current</span>
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
        <Box className="mb-10 card bg-white rounded-lg p-6 shadow-md">
          <Box className="flex justify-between items-center mb-6">
            <Typography
              variant="h5"
              component="h2"
              className="font-semibold text-gray-800"
            >
              Your Carbon Credits
            </Typography>
            <Button
              component={Link}
              to="/marketplace"
              color="primary"
              variant="contained"
              className="bg-gradient-to-r from-green-600 to-green-700 text-white"
            >
              Trade Credits
            </Button>
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
                    className={`border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all ${
                      credit.status === "retired" ? "bg-gray-50" : ""
                    }`}
                  >
                    <CardContent className="p-5">
                      <Box className="flex justify-between items-start mb-3">
                        <div>
                          <Typography variant="h6" className="font-bold">
                            {credit.project_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Token #{credit.token_id}
                          </Typography>
                        </div>
                        <Chip
                          label={credit.status.toUpperCase()}
                          color={
                            credit.status === "verified"
                              ? "success"
                              : credit.status === "retired"
                              ? "secondary"
                              : "warning"
                          }
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
          className="mb-10 card bg-white rounded-lg p-6 shadow-md"
        >
          <Typography
            variant="h5"
            component="h2"
            className="font-semibold mb-6 text-gray-800"
          >
            Analytics
          </Typography>
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
              <Typography variant="h6" className="mb-3 font-medium">
                Carbon Offset Impact
              </Typography>
              <CarbonStats />
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
              <Typography variant="h6" className="mb-3 font-medium">
                Verification Status
              </Typography>
              <VerificationProgress />
            </Grid>
          </Grid>
        </Box>

        {/* Profile & Settings */}
        <Box className="mb-10 card bg-white rounded-lg p-6 shadow-md">
          <Typography
            variant="h5"
            component="h2"
            className="font-semibold mb-6 text-gray-800"
          >
            Account Management
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card className="border border-gray-100 rounded-lg shadow-sm h-full">
                <CardContent className="p-5">
                  <Typography variant="h6" className="mb-4 font-medium">
                    User Profile
                  </Typography>
                  <UserProfile />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="border border-gray-100 rounded-lg shadow-sm h-full">
                <CardContent className="p-5">
                  <Typography variant="h6" className="mb-4 font-medium">
                    Settings
                  </Typography>
                  <Settings />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Mobile view marketplace button */}
        <Box className="fixed bottom-6 right-6 md:hidden">
          <Button
            component={Link}
            to="/marketplace"
            variant="contained"
            className="bg-green-600 hover:bg-green-700 rounded-full w-12 h-12 shadow-lg"
            aria-label="Go to marketplace"
          >
            <ShoppingCart />
          </Button>
        </Box>

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
