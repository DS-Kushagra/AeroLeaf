import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Badge,
  Tooltip,
  Collapse,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Inventory,
  ShoppingCart,
  LocalOffer,
  Search,
  FilterList,
  Refresh,
  TrendingUp,
  TrendingDown,
  Timeline,
  ExpandMore,
  ExpandLess,
  Star,
  Verified,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Speed,
  Nature,
  PublicOutlined,
  LocalFireDepartment,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { creditsApi } from "../services/api";
import PlaceBid from "../components/PlaceBid";
import { addEventListener, removeEventListener } from "../services/socket";
import { useWeb3 } from "../contexts/Web3Context";

export default function Marketplace() {
  const { account } = useWeb3();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openListDialog, setOpenListDialog] = useState(false);
  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const [newListing, setNewListing] = useState({
    tokenId: "",
    projectId: "",
    price: "",
    isAuction: false,
    auctionEndDate: "",
  });
  const [tabValue, setTabValue] = useState(0);

  // Enhanced filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 100],
    region: "all",
    projectType: "all",
    verification: "all",
    sortBy: "newest",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Market statistics
  const [marketStats, setMarketStats] = useState({
    totalValue: 0,
    totalListings: 0,
    avgPrice: 0,
    priceChange24h: 0,
    topProject: "",
    activeAuctions: 0,
  });
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Enhanced search and filter handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100],
      region: "all",
      projectType: "all",
      verification: "all",
      sortBy: "newest",
    });
  };

  // Calculate market statistics
  const calculateMarketStats = (listings) => {
    if (!listings.length) return;

    const totalValue = listings.reduce(
      (sum, listing) => sum + listing.current_price,
      0
    );
    const avgPrice = totalValue / listings.length;
    const activeAuctions = listings.filter((l) => l.is_auction).length;

    setMarketStats({
      totalValue: totalValue.toFixed(2),
      totalListings: listings.length,
      avgPrice: avgPrice.toFixed(2),
      priceChange24h: Math.random() * 10 - 5, // Mock data
      topProject: listings[0]?.project_id || "N/A",
      activeAuctions,
    });
  };

  // Handler for refresh button
  const handleRefresh = () => {
    fetchListings();
    setNotification({
      open: true,
      message: "Marketplace refreshed",
      type: "success",
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  }; // Enhanced filter function
  const getFilteredListings = () => {
    let filtered = listings;

    // Tab filtering
    switch (tabValue) {
      case 1: // Buy Now
        filtered = filtered.filter((listing) => !listing.is_auction);
        break;
      case 2: // Auctions
        filtered = filtered.filter((listing) => listing.is_auction);
        break;
      case 3: // Featured/Hot
        filtered = filtered.filter(
          (listing) =>
            listing.current_price > marketStats.avgPrice || listing.is_auction
        );
        break;
      default: // All
        break;
    }

    // Price range filter
    filtered = filtered.filter(
      (listing) =>
        listing.current_price >= filters.priceRange[0] &&
        listing.current_price <= filters.priceRange[1]
    );

    // Region filter
    if (filters.region !== "all") {
      filtered = filtered.filter(
        (listing) => listing.region === filters.region
      );
    }

    // Project type filter
    if (filters.projectType !== "all") {
      filtered = filtered.filter(
        (listing) => listing.project_type === filters.projectType
      );
    }

    // Verification filter
    if (filters.verification !== "all") {
      filtered = filtered.filter(
        (listing) => listing.verification_status === filters.verification
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.token_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (listing.region &&
            listing.region.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.current_price - b.current_price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.current_price - a.current_price);
        break;
      case "ending_soon":
        filtered.sort((a, b) => {
          if (!a.auction_end && !b.auction_end) return 0;
          if (!a.auction_end) return 1;
          if (!b.auction_end) return -1;
          return new Date(a.auction_end) - new Date(b.auction_end);
        });
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    return filtered;
  };
  // Filter listings when search term, tab, or filters change
  useEffect(() => {
    const filtered = getFilteredListings();
    setFilteredListings(filtered);
    calculateMarketStats(listings);
  }, [listings, searchTerm, tabValue, filters]);

  // Handle real-time marketplace updates
  useEffect(() => {
    // Set up listener for marketplace updates
    const marketplaceUpdateHandler = (data) => {
      setNotification({
        open: true,
        message: `Marketplace updated: ${data.type}`,
        type: "info",
      });

      // Refresh listings
      fetchListings();
    };

    // Subscribe to marketplace updates
    const unsubscribe = addEventListener(
      "marketplaceUpdated",
      marketplaceUpdateHandler
    );

    // Fetch initial listings
    fetchListings();

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  async function fetchListings() {
    try {
      setLoading(true);
      const data = await creditsApi.getListings();
      setListings(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch marketplace listings:", err);
      setError("Could not load marketplace listings. Please try again later."); // Enhanced fallback mock data with more details
      setListings([
        {
          id: "listing_001",
          token_id: "CC001",
          project_id: "Amazon Rainforest Restoration",
          current_price: 15.5,
          status: "listed",
          owner_uid: "user123",
          is_auction: false,
          created_at: "2025-05-10T14:30:00Z",
          region: "Brazil",
          project_type: "reforestation",
          verification_status: "verified",
          vintage: "2025",
          co2_amount: "1.2 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
          description:
            "Verified carbon credit from Amazon rainforest restoration project",
          rating: 4.8,
          seller_rating: 4.9,
        },
        {
          id: "listing_002",
          token_id: "CC002",
          project_id: "Kenyan Mangrove Conservation",
          current_price: 18.25,
          status: "listed",
          owner_uid: "user456",
          is_auction: true,
          auction_end: "2025-06-15T23:59:59Z",
          created_at: "2025-05-15T09:15:00Z",
          region: "Kenya",
          project_type: "mangrove",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "1.5 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400",
          description: "Premium mangrove restoration with blue carbon benefits",
          rating: 4.9,
          seller_rating: 4.7,
          bid_count: 7,
        },
        {
          id: "listing_003",
          token_id: "CC003",
          project_id: "Canadian Boreal Afforestation",
          current_price: 12.75,
          status: "listed",
          owner_uid: "user789",
          is_auction: false,
          created_at: "2025-05-18T11:45:00Z",
          region: "Canada",
          project_type: "afforestation",
          verification_status: "verified",
          vintage: "2025",
          co2_amount: "1.0 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
          description: "Boreal forest expansion with biodiversity co-benefits",
          rating: 4.6,
          seller_rating: 4.8,
        },
        {
          id: "listing_004",
          token_id: "CC004",
          project_id: "Indonesian Peatland Restoration",
          current_price: 22.5,
          status: "listed",
          owner_uid: "user123",
          is_auction: true,
          auction_end: "2025-06-05T23:59:59Z",
          created_at: "2025-05-20T16:20:00Z",
          region: "Indonesia",
          project_type: "peatland",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "2.1 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1574482620889-1d99ebb9fc56?w=400",
          description: "Critical peatland restoration preventing emissions",
          rating: 4.9,
          seller_rating: 4.9,
          bid_count: 12,
          is_featured: true,
        },
        {
          id: "listing_005",
          token_id: "CC005",
          project_id: "Nordic Rewilding Initiative",
          current_price: 14.8,
          status: "listed",
          owner_uid: "user456",
          is_auction: false,
          created_at: "2025-05-21T10:00:00Z",
          region: "Norway",
          project_type: "rewilding",
          verification_status: "verified",
          vintage: "2025",
          co2_amount: "1.3 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
          description: "Ecosystem restoration with wildlife habitat creation",
          rating: 4.7,
          seller_rating: 4.6,
        },
        {
          id: "listing_006",
          token_id: "CC006",
          project_id: "Madagascar Baobab Conservation",
          current_price: 28.5,
          status: "listed",
          owner_uid: "user321",
          is_auction: true,
          auction_end: "2025-06-20T18:30:00Z",
          created_at: "2025-05-22T08:15:00Z",
          region: "Madagascar",
          project_type: "conservation",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "2.8 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1569163139402-1d99ebb9fc59?w=400",
          description:
            "Protecting ancient baobab trees and endemic biodiversity",
          rating: 4.9,
          seller_rating: 4.8,
          bid_count: 15,
          is_featured: true,
        },
        {
          id: "listing_007",
          token_id: "CC007",
          project_id: "Chilean Patagonia Reforestation",
          current_price: 16.2,
          status: "listed",
          owner_uid: "user654",
          is_auction: false,
          created_at: "2025-05-23T14:20:00Z",
          region: "Chile",
          project_type: "reforestation",
          verification_status: "verified",
          vintage: "2025",
          co2_amount: "1.4 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
          description:
            "Native forest restoration in pristine Patagonian valleys",
          rating: 4.8,
          seller_rating: 4.7,
        },
        {
          id: "listing_008",
          token_id: "CC008",
          project_id: "Australian Eucalyptus Regeneration",
          current_price: 19.9,
          status: "listed",
          owner_uid: "user987",
          is_auction: true,
          auction_end: "2025-06-12T12:00:00Z",
          created_at: "2025-05-24T09:30:00Z",
          region: "Australia",
          project_type: "regeneration",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "1.8 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=400",
          description:
            "Post-wildfire ecosystem recovery with koala habitat restoration",
          rating: 4.6,
          seller_rating: 4.9,
          bid_count: 9,
        },
        {
          id: "listing_009",
          token_id: "CC009",
          project_id: "Costa Rica Cloud Forest Protection",
          current_price: 24.75,
          status: "listed",
          owner_uid: "user111",
          is_auction: false,
          created_at: "2025-05-25T07:45:00Z",
          region: "Costa Rica",
          project_type: "protection",
          verification_status: "verified",
          vintage: "2025",
          co2_amount: "2.2 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1574482620811-1ddbca8b9beb?w=400",
          description:
            "High-altitude cloud forest preservation with endemic species protection",
          rating: 4.9,
          seller_rating: 4.8,
          is_featured: true,
        },
        {
          id: "listing_010",
          token_id: "CC010",
          project_id: "Moroccan Argan Forest Restoration",
          current_price: 17.3,
          status: "listed",
          owner_uid: "user222",
          is_auction: false,
          created_at: "2025-05-26T13:10:00Z",
          region: "Morocco",
          project_type: "restoration",
          verification_status: "verified",
          vintage: "2025",
          co2_amount: "1.6 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          description:
            "Traditional argan forest restoration supporting local communities",
          rating: 4.5,
          seller_rating: 4.7,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenListDialog = () => {
    setOpenListDialog(true);
  };

  const handleCloseListDialog = () => {
    setOpenListDialog(false);
  };

  const handleListingChange = (e) => {
    const { name, value } = e.target;
    setNewListing({
      ...newListing,
      [name]: value,
    });
  };

  const handleCreateListing = async () => {
    try {
      await creditsApi.listCredit(newListing);
      // Refresh the listings
      const data = await creditsApi.getListings();
      setListings(data);
      handleCloseListDialog();
      // Reset form
      setNewListing({
        tokenId: "",
        projectId: "",
        price: "",
      });
    } catch (err) {
      console.error("Failed to create listing:", err);
      alert("Failed to create listing. Please try again.");
    }
  };

  const handleOpenBuyDialog = (listing) => {
    setSelectedListing(listing);
    setOpenBuyDialog(true);
  };

  const handleCloseBuyDialog = () => {
    setOpenBuyDialog(false);
    setSelectedListing(null);
  };

  const handleBuyCredit = async () => {
    try {
      await creditsApi.buyCredit(selectedListing.id);
      // Refresh the listings
      const data = await creditsApi.getListings();
      setListings(data);
      handleCloseBuyDialog();
    } catch (err) {
      console.error("Failed to buy credit:", err);
      alert("Failed to complete purchase. Please try again.");
    }
  };
  if (loading && listings.length === 0) {
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
  const handleOpenBidDialog = (listing) => {
    setSelectedListing(listing);
    setOpenBidDialog(true);
  };

  const handleCloseBidDialog = () => {
    setOpenBidDialog(false);
    setSelectedListing(null);
  };
  const handleBidPlaced = (amount, listingId) => {
    // In a real app, we would refresh the listings
    console.log(`Bid placed: ${amount} MATIC on listing ${listingId}`);
    // For now, just update the UI optimistically
    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, current_price: amount } : item
      )
    );
  };
  // Enhanced Marketplace Card Component
  const EnhancedMarketplaceCard = ({ listing, onBuyClick, onBidClick }) => (
    <motion.div
      className="h-full"
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          border: listing.is_featured
            ? "3px solid #ff6b35"
            : "1px solid rgba(0,0,0,0.08)",
          position: "relative",
          overflow: "visible",
          background: listing.is_featured
            ? "linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,255,255,1) 60%)"
            : "linear-gradient(135deg, rgba(76,175,80,0.02) 0%, rgba(255,255,255,1) 100%)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            border: listing.is_featured
              ? "3px solid #ff4517"
              : "2px solid #4caf50",
          },
        }}
      >
        {/* Status Badges */}
        <Box
          sx={{
            position: "absolute",
            top: -12,
            left: 16,
            right: 16,
            zIndex: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {listing.is_featured && (
              <Chip
                label="⭐ FEATURED"
                size="small"
                sx={{
                  background: "linear-gradient(45deg, #ff6b35, #f7931e)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  boxShadow: "0 4px 12px rgba(255,107,53,0.4)",
                }}
              />
            )}
            {listing.is_auction && (
              <Chip
                label="🔥 LIVE AUCTION"
                size="small"
                sx={{
                  background: "linear-gradient(45deg, #f44336, #d32f2f)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  animation: "pulse 2s infinite",
                  ml: listing.is_featured ? 1 : 0,
                }}
              />
            )}
            {listing.verification_status === "verified" && (
              <Chip
                icon={<Verified sx={{ fontSize: "1rem !important" }} />}
                label="CERTIFIED"
                size="small"
                color="success"
                sx={{
                  backgroundColor: "rgba(76,175,80,0.9)",
                  color: "white",
                  fontWeight: "bold",
                  ml: "auto",
                }}
              />
            )}
          </Box>
        </Box>

        {/* Enhanced Project Image with Overlay */}
        <Box sx={{ position: "relative", height: 220 }}>
          <img
            src={listing.project_image}
            alt={listing.project_id}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            }}
          />

          {/* Project Type & Vintage */}
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Chip
              label={listing.project_type}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.95)",
                fontWeight: "bold",
                textTransform: "capitalize",
                border: "1px solid rgba(76,175,80,0.3)",
              }}
            />
            <Chip
              label={`Vintage ${listing.vintage}`}
              size="small"
              sx={{ backgroundColor: "rgba(255,255,255,0.9)" }}
            />
          </Box>

          {/* Auction countdown or quick stats */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "8px 12px",
              borderRadius: 2,
              backdropFilter: "blur(10px)",
            }}
          >
            {listing.is_auction ? (
              <Box textAlign="center">
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontWeight: "bold" }}
                >
                  {listing.bid_count || 0} BIDS
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.7rem", opacity: 0.8 }}
                >
                  Ending Soon
                </Typography>
              </Box>
            ) : (
              <Box textAlign="center">
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontWeight: "bold" }}
                >
                  BUY NOW
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.7rem", opacity: 0.8 }}
                >
                  Fixed Price
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Enhanced Header with title and comprehensive rating */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontSize: "1.2rem",
                lineHeight: 1.3,
                color: "#2e7d32",
              }}
            >
              {listing.project_id}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      sx={{
                        color:
                          i < Math.floor(listing.rating)
                            ? "#ffc107"
                            : "#e0e0e0",
                        fontSize: "1rem",
                      }}
                    />
                  ))}
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", ml: 0.5 }}
                  >
                    {listing.rating}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  ({listing.seller_rating} seller)
                </Typography>
              </Box>
              <Chip
                icon={<LocationOn sx={{ fontSize: "1rem !important" }} />}
                label={listing.region}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: "bold",
                  color: "#1976d2",
                  borderColor: "#1976d2",
                }}
              />
            </Box>
          </Box>

          {/* Enhanced Description and Stats */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1.5, lineHeight: 1.5 }}
            >
              {listing.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Nature sx={{ color: "#4caf50", fontSize: "1.2rem" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#4caf50" }}
                >
                  {listing.co2_amount}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarToday sx={{ color: "#757575", fontSize: "1rem" }} />
                <Typography variant="caption" color="text.secondary">
                  {new Date(listing.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Enhanced Price and Action Section */}
          <Box sx={{ mt: "auto" }}>
            <Divider sx={{ mb: 2, borderColor: "rgba(76,175,80,0.2)" }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                mb: 2.5,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  {listing.is_auction ? "CURRENT BID" : "FIXED PRICE"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: listing.is_auction ? "#f44336" : "#1976d2",
                      textShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    ${listing.current_price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MATIC
                  </Typography>
                </Box>
              </Box>

              {listing.is_auction && listing.bid_count && (
                <Chip
                  label={`${listing.bid_count} bids`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {listing.is_auction ? (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onBidClick(listing)}
                  sx={{
                    background: "linear-gradient(45deg, #ff6b35, #f7931e)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #e55a2b, #e8851a)",
                    },
                  }}
                >
                  Place Bid
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onBuyClick(listing)}
                  startIcon={<ShoppingCart />}
                  sx={{
                    background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1976D2, #1CB5E0)",
                    },
                  }}
                >
                  Buy Now
                </Button>
              )}
            </Box>

            {/* Auction end time */}
            {listing.is_auction && listing.auction_end && (
              <Typography
                variant="caption"
                color="error"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 1,
                  fontWeight: "bold",
                }}
              >
                ⏰ Ends: {new Date(listing.auction_end).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Enhanced Hero Section with Live Market Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                className="font-bold"
                sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
              >
                🌍 Carbon Credit Marketplace
              </Typography>
              <Typography variant="h6" className="mb-4 opacity-90">
                Trade verified carbon credits from global reforestation projects
                with blockchain transparency
              </Typography>

              {/* Real-time Market Indicators */}
              <Grid container spacing={2} className="mt-2">
                <Grid item xs={6} sm={3}>
                  <Box className="text-center">
                    <Typography
                      variant="h4"
                      className="font-bold flex items-center justify-center"
                    >
                      {marketStats.totalListings}
                      <TrendingUp className="ml-1" />
                    </Typography>
                    <Typography variant="body2" className="opacity-75">
                      Active Listings
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box className="text-center">
                    <Typography variant="h4" className="font-bold">
                      ${marketStats.totalValue}
                    </Typography>
                    <Typography variant="body2" className="opacity-75">
                      Market Value
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box className="text-center">
                    <Typography
                      variant="h4"
                      className="font-bold flex items-center justify-center"
                    >
                      ${marketStats.avgPrice}
                      {marketStats.priceChange24h >= 0 ? (
                        <TrendingUp className="ml-1 text-green-300" />
                      ) : (
                        <TrendingDown className="ml-1 text-red-300" />
                      )}
                    </Typography>
                    <Typography variant="body2" className="opacity-75">
                      Avg Price
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box className="text-center">
                    <Typography
                      variant="h4"
                      className="font-bold flex items-center justify-center"
                    >
                      {marketStats.activeAuctions}
                      <LocalFireDepartment className="ml-1 text-orange-300" />
                    </Typography>
                    <Typography variant="body2" className="opacity-75">
                      Live Auctions
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="text-center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleOpenListDialog}
                  disabled={!account}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    py: 2,
                    px: 4,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  startIcon={<LocalOffer />}
                >
                  List Your Credit
                </Button>
                {!account && (
                  <Typography
                    variant="caption"
                    className="block mt-2 opacity-75"
                  >
                    Connect wallet to list credits
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Alert severity="error" className="rounded-lg shadow-md">
            {error}
          </Alert>
        </motion.div>
      )}
      {/* Enhanced Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="mb-6 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <Box className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search Bar */}
              <TextField
                label="Search credits, projects, or regions..."
                variant="outlined"
                size="medium"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  flexGrow: 1,
                  minWidth: "300px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Quick Actions */}
              <Box className="flex gap-2 flex-wrap">
                <Button
                  variant={showFilters ? "contained" : "outlined"}
                  startIcon={<FilterList />}
                  onClick={toggleFilters}
                  className="rounded-lg"
                >
                  Filters
                  {Object.values(filters).some(
                    (f) => f !== "all" && !Array.isArray(f)
                  ) && <Badge color="primary" variant="dot" className="ml-2" />}
                </Button>

                <Tooltip title="Refresh listings">
                  <IconButton
                    color="primary"
                    onClick={handleRefresh}
                    className="border border-gray-300 hover:border-primary-main rounded-lg"
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={resetFilters}
                  className="rounded-lg"
                >
                  Clear
                </Button>
              </Box>
            </Box>

            {/* Advanced Filters Collapse */}
            <Collapse in={showFilters}>
              <Divider className="my-4" />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    variant="subtitle2"
                    className="mb-2 font-semibold"
                  >
                    Price Range (MATIC)
                  </Typography>
                  <Slider
                    value={filters.priceRange}
                    onChange={(e, newValue) =>
                      handleFilterChange("priceRange", newValue)
                    }
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    step={5}
                    marks={[
                      { value: 0, label: "$0" },
                      { value: 50, label: "$50" },
                      { value: 100, label: "$100+" },
                    ]}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Region</InputLabel>
                    <Select
                      value={filters.region}
                      label="Region"
                      onChange={(e) =>
                        handleFilterChange("region", e.target.value)
                      }
                    >
                      <MenuItem value="all">All Regions</MenuItem>
                      <MenuItem value="Brazil">Brazil</MenuItem>
                      <MenuItem value="Kenya">Kenya</MenuItem>
                      <MenuItem value="Canada">Canada</MenuItem>
                      <MenuItem value="Indonesia">Indonesia</MenuItem>
                      <MenuItem value="Norway">Norway</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Project Type</InputLabel>
                    <Select
                      value={filters.projectType}
                      label="Project Type"
                      onChange={(e) =>
                        handleFilterChange("projectType", e.target.value)
                      }
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="reforestation">Reforestation</MenuItem>
                      <MenuItem value="afforestation">Afforestation</MenuItem>
                      <MenuItem value="mangrove">Mangrove</MenuItem>
                      <MenuItem value="peatland">Peatland</MenuItem>
                      <MenuItem value="rewilding">Rewilding</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filters.sortBy}
                      label="Sort By"
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                    >
                      <MenuItem value="newest">Newest First</MenuItem>
                      <MenuItem value="price_low">Price: Low to High</MenuItem>
                      <MenuItem value="price_high">Price: High to Low</MenuItem>
                      <MenuItem value="ending_soon">Ending Soon</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Collapse>
          </CardContent>
        </Card>
      </motion.div>
      {/* Enhanced Tabs with Icons and Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="marketplace tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minHeight: "64px",
                fontWeight: "600",
                fontSize: "1rem",
              },
            }}
          >
            <Tab
              icon={<Inventory />}
              label={`All Listings (${listings.length})`}
              iconPosition="start"
            />
            <Tab
              icon={<ShoppingCart />}
              label={`Buy Now (${
                listings.filter((l) => !l.is_auction).length
              })`}
              iconPosition="start"
            />
            <Tab
              icon={<LocalOffer />}
              label={`Live Auctions (${marketStats.activeAuctions})`}
              iconPosition="start"
            />
            <Tab
              icon={<LocalFireDepartment />}
              label={`Featured (${
                listings.filter((l) => l.is_featured).length
              })`}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </motion.div>{" "}
      {/* Enhanced Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {loading && listings.length === 0 ? (
          <Box display="flex" justifyContent="center" py={12}>
            <Box textAlign="center">
              <CircularProgress size={60} thickness={4} />
              <Typography variant="h6" className="mt-4 text-gray-600">
                Loading marketplace...
              </Typography>
            </Box>
          </Box>
        ) : filteredListings.length === 0 ? (
          <Box py={12} textAlign="center">
            <Nature sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" className="mb-2">
              No credits found
            </Typography>
            <Typography variant="body1" color="text.secondary" className="mb-4">
              Try adjusting your search or filters
            </Typography>
            <Button variant="outlined" onClick={resetFilters}>
              Clear all filters
            </Button>
          </Box>
        ) : (
          <>
            {/* Results Header */}
            <Box className="flex justify-between items-center mb-6">
              <Typography variant="h6" className="font-semibold">
                {filteredListings.length} credit
                {filteredListings.length !== 1 ? "s" : ""} found
              </Typography>
              <Box className="flex items-center gap-2">
                <Typography variant="body2" color="text.secondary">
                  View:
                </Typography>
                <Button
                  variant={viewMode === "grid" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </Box>
            </Box>

            {/* Enhanced Grid Layout */}
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredListings.map((listing, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <EnhancedMarketplaceCard
                        listing={listing}
                        onBuyClick={() => handleOpenBuyDialog(listing)}
                        onBidClick={() => handleOpenBidDialog(listing)}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </>
        )}
      </motion.div>
      {/* List Dialog */}
      <Dialog open={openListDialog} onClose={handleCloseListDialog}>
        <DialogTitle>List a Carbon Credit</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="tokenId"
            label="Token ID"
            type="text"
            fullWidth
            variant="outlined"
            value={newListing.tokenId}
            onChange={handleListingChange}
          />
          <TextField
            margin="dense"
            name="projectId"
            label="Project ID"
            type="text"
            fullWidth
            variant="outlined"
            value={newListing.projectId}
            onChange={handleListingChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price (MATIC)"
            type="number"
            fullWidth
            variant="outlined"
            value={newListing.price}
            onChange={handleListingChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseListDialog}>Cancel</Button>
          <Button
            onClick={handleCreateListing}
            variant="contained"
            color="primary"
          >
            List Credit
          </Button>
        </DialogActions>
      </Dialog>{" "}
      {/* Buy Dialog */}
      <Dialog open={openBuyDialog} onClose={handleCloseBuyDialog}>
        <DialogTitle>Buy Carbon Credit</DialogTitle>
        <DialogContent>
          {selectedListing && (
            <Box>
              <Typography variant="h6">
                Token #{selectedListing.token_id}
              </Typography>
              <Typography>Project: {selectedListing.project_id}</Typography>
              <Typography>
                Price: {selectedListing.current_price} MATIC
              </Typography>
              <Typography className="mt-4 font-bold">
                Are you sure you want to purchase this carbon credit?
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBuyDialog}>Cancel</Button>
          <Button onClick={handleBuyCredit} variant="contained" color="primary">
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>
      {/* Bid Dialog */}{" "}
      <PlaceBid
        listing={selectedListing}
        onBidPlaced={handleBidPlaced}
        open={openBidDialog}
        onClose={handleCloseBidDialog}
      />
      {/* Notification system */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
