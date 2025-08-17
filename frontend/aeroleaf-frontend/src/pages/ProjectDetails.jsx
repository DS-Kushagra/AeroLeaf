import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Rating,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tooltip,
  Breadcrumbs,
  Link,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack,
  LocationOn,
  Verified,
  Nature,
  Star,
  Share,
  Bookmark,
  Security,
  Assessment,
  Group,
  Timeline,
  ShoppingCart,
  Gavel,
  Warning,
  CheckCircle,
  BarChart,
  Speed,
  CalendarToday,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { creditsApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useWeb3 } from "../contexts/Web3Context";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { account } = useWeb3();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });

  // Enhanced animations and transitions
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleOnHover = {
    whileHover: { scale: 1.02 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the API
      // const projectData = await creditsApi.getProjectDetails(id);

      // Enhanced mock data with modern structure
      const mockProject = {
        id: id,
        project_id: "AMZN-RF-2024-001",
        project_name: "Amazon Rainforest Restoration Initiative",
        description:
          "Large-scale Amazon rainforest restoration supporting indigenous communities and biodiversity conservation",
        detailed_description:
          "This comprehensive project spans 15,000 hectares of degraded Amazon rainforest, combining advanced satellite monitoring with traditional indigenous knowledge. The initiative focuses on native species reforestation, community empowerment, and long-term carbon sequestration while preserving critical biodiversity hotspots.",

        // Location & basic info
        region: "Pará, Brazil",
        country: "Brazil",
        coordinates: { lat: -3.4653, lng: -62.2159 },
        project_type: "reforestation",
        methodology: "VCS-VM0009",

        // Financial details
        current_price: 24.5,
        market_cap: "18.7M",
        volume_24h: "2.4M",
        price_change_24h: 5.2,
        is_auction: false,
        min_purchase: 1,

        // Project metrics
        project_area: "15,000 hectares",
        co2_amount: "3.2 tCO2e",
        total_credits: 15000,
        available_credits: 8750,
        sold_credits: 6250,
        retirement_rate: "12%",

        // Status & verification
        status: "active",
        verification_status: "verified",
        vintage: "2024",
        issuance_date: "2024-01-15",
        credit_start: "2024-01-01",
        credit_end: "2024-12-31",

        // Certifications with detailed info
        certifications: [
          {
            name: "Gold Standard",
            status: "verified",
            date: "2024-01-10",
            score: 95,
            validator: "SGS",
            certificate_id: "GS-VER-2024-001",
          },
          {
            name: "VCS (Verra)",
            status: "verified",
            date: "2024-01-08",
            score: 92,
            validator: "TÜV SÜD",
            certificate_id: "VCS-2024-AMZN-001",
          },
          {
            name: "CCBS",
            status: "verified",
            date: "2024-01-12",
            score: 88,
            validator: "Rainforest Alliance",
            certificate_id: "CCBS-2024-001",
          },
        ],

        // Enhanced monitoring data
        monitoring: {
          ndvi_improvement: 0.35,
          forest_cover_increase: "65%",
          carbon_sequestration_rate: "12.5 tCO2e/hectare/year",
          biodiversity_index: 8.7,
          community_satisfaction: 94,
          survival_rate: "89%",
          water_quality_improvement: "23%",
          soil_health_index: 7.8,
        },

        // Sustainability metrics
        sdg_alignment: [
          { goal: 13, score: 95, title: "Climate Action" },
          { goal: 15, score: 92, title: "Life on Land" },
          { goal: 1, score: 78, title: "No Poverty" },
          { goal: 8, score: 85, title: "Decent Work" },
          { goal: 6, score: 71, title: "Clean Water" },
          { goal: 11, score: 68, title: "Sustainable Communities" },
        ],

        // Developer information
        developer: {
          name: "Amazon Conservation Alliance",
          logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
          rating: 4.8,
          verified: true,
          projects_completed: 47,
          total_credits_issued: "2.3M",
          years_experience: 12,
          headquarters: "São Paulo, Brazil",
          website: "https://amazonconservation.org",
          description:
            "Leading environmental organization specializing in Amazon rainforest conservation and restoration.",
        },

        // Community impact
        community_impact: {
          beneficiaries: 2500,
          jobs_created: 180,
          women_participation: "45%",
          indigenous_communities: 12,
          local_income_increase: "34%",
          capacity_building_programs: 8,
        },

        // Media gallery
        images: [
          {
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
            caption: "Aerial view of the restoration site",
            type: "aerial",
          },
          {
            url: "https://images.unsplash.com/photo-1574482620889-1d99ebb9fc56?w=1200",
            caption: "Community planting activities",
            type: "community",
          },
          {
            url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",
            caption: "Biodiversity monitoring",
            type: "monitoring",
          },
          {
            url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200",
            caption: "Restored forest canopy",
            type: "results",
          },
        ],

        // Project timeline with enhanced details
        timeline: [
          {
            date: "2024-01-01",
            event: "Project Initiation",
            description:
              "Project planning, stakeholder mapping, and initial assessments",
            status: "completed",
            milestone: true,
          },
          {
            date: "2024-02-15",
            event: "Community Agreements",
            description: "Signed agreements with 12 indigenous communities",
            status: "completed",
            milestone: true,
          },
          {
            date: "2024-04-01",
            event: "Phase 1 Planting",
            description: "Planted 5,000 hectares with native species",
            status: "completed",
            milestone: true,
          },
          {
            date: "2024-06-01",
            event: "Phase 2 Planting",
            description: "Ongoing planting of 6,000 hectares",
            status: "in_progress",
            milestone: true,
          },
          {
            date: "2024-08-01",
            event: "Phase 3 Planting",
            description: "Final planting phase covering 4,000 hectares",
            status: "planned",
            milestone: true,
          },
        ],

        // Reviews and ratings
        rating: 4.9,
        reviews_count: 127,
        rating_breakdown: {
          5: 89,
          4: 28,
          3: 7,
          2: 2,
          1: 1,
        },

        recent_reviews: [
          {
            id: 1,
            author: "Environmental Investor",
            rating: 5,
            date: "2024-05-28",
            comment:
              "Exceptional project with transparent reporting and measurable impact.",
          },
          {
            id: 2,
            author: "Carbon Portfolio Manager",
            rating: 5,
            date: "2024-05-25",
            comment: "High-quality credits with strong community co-benefits.",
          },
        ],

        // Additional metadata
        is_featured: true,
        last_updated: "2024-06-15T14:30:00Z",
        created_at: "2024-01-01T00:00:00Z",
        tags: [
          "reforestation",
          "biodiversity",
          "community",
          "indigenous",
          "amazon",
          "verified",
        ],
      };

      setProject(mockProject);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch project details:", err);
      setError("Could not load project details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    setNotification({
      open: true,
      message: bookmarked ? "Removed from watchlist" : "Added to watchlist",
      type: "success",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: project.project_name,
        text: project.description,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      setNotification({
        open: true,
        message: "Link copied to clipboard",
        type: "success",
      });
    }
  };

  const handleOpenBuy = () => setOpenBuyDialog(true);
  const handleCloseBuy = () => setOpenBuyDialog(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "#10b981";
      case "completed":
        return "#059669";
      case "in_progress":
        return "#3b82f6";
      case "planned":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Box textAlign="center">
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Loading project details...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || "Project not found"}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/marketplace")}
          variant="outlined"
        >
          Back to Marketplace
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      {/* Hero Section with Modern Design */}
      <Box
        sx={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%), url(${
            project.images[imageIndex]?.url || project.images[0]?.url
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          color: "white",
        }}
      >
        {/* Navigation Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ py: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={() => navigate("/marketplace")}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </motion.div>

              <Breadcrumbs sx={{ color: "white" }}>
                <Link
                  component="button"
                  onClick={() => navigate("/marketplace")}
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                  }}
                >
                  Marketplace
                </Link>
                <Typography sx={{ color: "white" }}>
                  {project.project_name}
                </Typography>
              </Breadcrumbs>

              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleBookmark}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      color: bookmarked ? "#ef4444" : "white",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                    }}
                  >
                    <Bookmark />
                  </IconButton>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleShare}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                    }}
                  >
                    <Share />
                  </IconButton>
                </motion.div>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Hero Content */}
        <Container maxWidth="xl" sx={{ mt: 8 }}>
          <motion.div {...fadeInUp}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <motion.div {...staggerChildren}>
                  {/* Status Badges */}
                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    <motion.div {...fadeInUp}>
                      <Chip
                        label="VERIFIED PROJECT"
                        sx={{
                          bgcolor: "rgba(16, 185, 129, 0.9)",
                          color: "white",
                          fontWeight: 700,
                          backdropFilter: "blur(10px)",
                        }}
                        icon={<Verified sx={{ color: "white !important" }} />}
                      />
                    </motion.div>
                    {project.is_featured && (
                      <motion.div {...fadeInUp}>
                        <Chip
                          label="FEATURED"
                          sx={{
                            bgcolor: "rgba(245, 158, 11, 0.9)",
                            color: "white",
                            fontWeight: 700,
                            backdropFilter: "blur(10px)",
                          }}
                          icon={<Star sx={{ color: "white !important" }} />}
                        />
                      </motion.div>
                    )}
                    <motion.div {...fadeInUp}>
                      <Chip
                        label={project.project_type.toUpperCase()}
                        sx={{
                          bgcolor: "rgba(59, 130, 246, 0.9)",
                          color: "white",
                          fontWeight: 700,
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </motion.div>
                  </Box>

                  {/* Title */}
                  <motion.div {...fadeInUp}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        fontSize: { xs: "2rem", md: "3rem" },
                        lineHeight: 1.2,
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {project.project_name}
                    </Typography>
                  </motion.div>

                  {/* Location & Basic Info */}
                  <motion.div {...fadeInUp}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOn />
                        <Typography variant="h6">{project.region}</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Nature />
                        <Typography variant="h6">
                          {project.project_area}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Rating
                          value={project.rating}
                          precision={0.1}
                          readOnly
                          sx={{
                            "& .MuiRating-iconFilled": {
                              color: "#ffd700",
                            },
                          }}
                        />
                        <Typography variant="body1">
                          ({project.reviews_count})
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>

                  {/* Description */}
                  <motion.div {...fadeInUp}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 4,
                        lineHeight: 1.6,
                        opacity: 0.95,
                        maxWidth: "90%",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      {project.detailed_description}
                    </Typography>
                  </motion.div>

                  {/* Key Metrics */}
                  <motion.div {...fadeInUp}>
                    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 800, color: "#4ade80" }}
                        >
                          {project.co2_amount}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          CO2 per Credit
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 800, color: "#60a5fa" }}
                        >
                          {(
                            ((project.total_credits -
                              project.available_credits) /
                              project.total_credits) *
                            100
                          ).toFixed(0)}
                          %
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Credits Sold
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 800, color: "#fbbf24" }}
                        >
                          {project.rating}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Project Rating
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </motion.div>
              </Grid>

              {/* Price Card */}
              <Grid item xs={12} md={4}>
                <motion.div {...scaleOnHover}>
                  <Card
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px)",
                      borderRadius: 4,
                      p: 3,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Price per Credit
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        ${project.current_price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        MATIC
                      </Typography>
                    </Box>

                    {/* Available Credits Progress */}
                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Available Credits
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {project.available_credits.toLocaleString()}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={
                          ((project.total_credits - project.available_credits) /
                            project.total_credits) *
                          100
                        }
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#e5e7eb",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            background:
                              "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                          },
                        }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: 600,
                          py: 1.5,
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleOpenBuy}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: 700,
                          py: 1.5,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                          },
                        }}
                      >
                        Buy Now
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <motion.div {...fadeInUp}>
          {/* Navigation Tabs */}
          <Paper
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  py: 3,
                  minWidth: 120,
                },
                "& .Mui-selected": {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white !important",
                },
              }}
            >
              <Tab label="Overview" icon={<Assessment />} />
              <Tab label="Impact & Monitoring" icon={<BarChart />} />
              <Tab label="Verification" icon={<Security />} />
              <Tab label="Timeline" icon={<Timeline />} />
              <Tab label="Community" icon={<Group />} />
              <Tab label="Risk Assessment" icon={<Warning />} />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {selectedTab === 0 && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Overview Content */}
                <Grid container spacing={4}>
                  {/* Project Stats */}
                  <Grid item xs={12} md={8}>
                    <Card sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        Project Overview
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {project.detailed_description}
                      </Typography>

                      {/* Key Metrics Grid */}
                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={6} md={3}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 2,
                              bgcolor: "#f8fafc",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color="primary"
                            >
                              {project.total_credits.toLocaleString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Total Credits
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 2,
                              bgcolor: "#f0fdf4",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color="success.main"
                            >
                              {project.monitoring.carbon_sequestration_rate}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              CO2/hectare/year
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 2,
                              bgcolor: "#fef3c7",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color="warning.main"
                            >
                              {project.monitoring.biodiversity_index}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Biodiversity Index
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 2,
                              bgcolor: "#ede9fe",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color="secondary.main"
                            >
                              {project.vintage}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Vintage Year
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>

                    {/* SDG Alignment */}
                    <Card sx={{ p: 4, borderRadius: 3 }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        UN Sustainable Development Goals
                      </Typography>
                      <Grid container spacing={2}>
                        {project.sdg_alignment.map((sdg, index) => (
                          <Grid item xs={4} md={2} key={index}>
                            <Box
                              sx={{
                                textAlign: "center",
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "primary.main",
                                color: "white",
                              }}
                            >
                              <Typography variant="h6" fontWeight={700}>
                                {sdg.goal}
                              </Typography>
                              <Typography variant="caption">
                                {sdg.title}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Score: {sdg.score}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                  </Grid>

                  {/* Developer Info */}
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        Project Developer
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Avatar
                          src={project.developer.logo}
                          sx={{ width: 60, height: 60 }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {project.developer.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Rating
                              value={project.developer.rating}
                              precision={0.1}
                              size="small"
                              readOnly
                            />
                            <Typography variant="body2" color="text.secondary">
                              ({project.developer.rating})
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" paragraph>
                        {project.developer.description}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Projects Completed
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {project.developer.projects_completed}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Credits Issued
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {project.developer.total_credits_issued}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Experience
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {project.developer.years_experience} years
                        </Typography>
                      </Box>
                    </Card>

                    {/* Quick Stats */}
                    <Card sx={{ p: 4, borderRadius: 3 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        Quick Stats
                      </Typography>
                      <Box sx={{ space: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            py: 1,
                          }}
                        >
                          <Typography variant="body2">Market Cap</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {project.market_cap}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            py: 1,
                          }}
                        >
                          <Typography variant="body2">24h Volume</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {project.volume_24h}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            py: 1,
                          }}
                        >
                          <Typography variant="body2">Price Change</Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={
                              project.price_change_24h > 0
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {project.price_change_24h > 0 ? "+" : ""}
                            {project.price_change_24h}%
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Add other tab content as placeholders */}
            {selectedTab === 1 && (
              <motion.div
                key="monitoring"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h4" gutterBottom>
                    Impact & Monitoring
                  </Typography>
                  <Typography variant="body1">
                    Detailed monitoring and impact data would be displayed here
                    with advanced charts and real-time data visualization...
                  </Typography>
                </Card>
              </motion.div>
            )}

            {selectedTab === 2 && (
              <motion.div
                key="verification"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h4" gutterBottom>
                    Verification & Certifications
                  </Typography>
                  <Grid container spacing={3}>
                    {project.certifications.map((cert, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Card
                          sx={{
                            p: 3,
                            textAlign: "center",
                            border: "2px solid",
                            borderColor: "success.main",
                          }}
                        >
                          <Box sx={{ mb: 2 }}>
                            <Verified
                              sx={{ fontSize: 40, color: "success.main" }}
                            />
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                          >
                            {cert.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Verified: {cert.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Score: {cert.score}/100
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              </motion.div>
            )}

            {/* Add remaining tabs */}
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* Dialogs */}
      {openBuyDialog && (
        <Dialog
          open={openBuyDialog}
          onClose={handleCloseBuy}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Purchase Carbon Credits</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Purchase credits from {project.project_name}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBuy}>Cancel</Button>
            <Button variant="contained">Purchase</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          severity={notification.type}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectDetails;
