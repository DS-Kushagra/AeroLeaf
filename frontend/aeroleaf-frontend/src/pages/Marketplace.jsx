import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  CardMedia,
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
  Rating,
  CardActions,
  Fade,
  LinearProgress,
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
  ViewModule,
  ViewList,
  Sort,
  Bookmark,
  BookmarkBorder,
  Share,
  Info,
  Group,
  Security,
  Assessment,
  Business,
  AccountBalance,
  Analytics,
  Add,
  Gavel,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { creditsApi } from "../services/api";
import PlaceBid from "../components/PlaceBid";
import { addEventListener, removeEventListener } from "../services/socket";
import { useWeb3 } from "../contexts/Web3Context";
import { useAuth } from "../contexts/AuthContext";

export default function Marketplace() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { account } = useWeb3();
  const { currentUser, loading: authLoading } = useAuth();

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
  const [viewMode, setViewMode] = useState("grid");
  const [bookmarkedProjects, setBookmarkedProjects] = useState(new Set());

  // Enhanced filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 100],
    region: "all",
    projectType: "all",
    verification: "all",
    sortBy: "newest",
    vintage: "all",
    rating: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Market statistics
  const [marketStats, setMarketStats] = useState({
    totalValue: 0,
    totalListings: 0,
    avgPrice: 0,
    priceChange24h: 0,
    topProject: "",
    activeAuctions: 0,
    totalCredits: 0,
    verifiedProjects: 0,
  });
  // Enhanced search and filter handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
      vintage: "all",
      rating: 0,
    });
  };

  const handleBookmark = (projectId) => {
    const newBookmarked = new Set(bookmarkedProjects);
    if (newBookmarked.has(projectId)) {
      newBookmarked.delete(projectId);
    } else {
      newBookmarked.add(projectId);
    }
    setBookmarkedProjects(newBookmarked);

    setNotification({
      open: true,
      message: newBookmarked.has(projectId)
        ? "Added to watchlist"
        : "Removed from watchlist",
      type: "success",
    });
  };

  const handleShare = async (project) => {
    try {
      await navigator.share({
        title: project.project_name || project.project_id,
        text: project.description,
        url: `${window.location.origin}/marketplace/${project.id}`,
      });
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/marketplace/${project.id}`
      );
      setNotification({
        open: true,
        message: "Project link copied to clipboard",
        type: "success",
      });
    }
  };

  const navigateToProject = (projectId) => {
    navigate(`/project/${projectId}`);
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
    const totalCredits = listings.reduce(
      (sum, listing) => sum + (listing.total_credits || 1),
      0
    );
    const verifiedProjects = listings.filter(
      (l) => l.verification_status === "verified"
    ).length;

    setMarketStats({
      totalValue: totalValue.toFixed(2),
      totalListings: listings.length,
      avgPrice: avgPrice.toFixed(2),
      priceChange24h: Math.random() * 10 - 5, // Mock data
      topProject: listings[0]?.project_id || "N/A",
      activeAuctions,
      totalCredits,
      verifiedProjects,
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
          (listing) => listing.is_featured || listing.rating >= 4.5
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
        (listing) =>
          listing.region &&
          listing.region.toLowerCase().includes(filters.region.toLowerCase())
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

    // Vintage filter
    if (filters.vintage !== "all") {
      filtered = filtered.filter(
        (listing) => listing.vintage === filters.vintage
      );
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((listing) => listing.rating >= filters.rating);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.token_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (listing.project_name &&
            listing.project_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
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
      case "rating_high":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "ending_soon":
        filtered.sort((a, b) => {
          if (!a.auction_end && !b.auction_end) return 0;
          if (!a.auction_end) return 1;
          if (!b.auction_end) return -1;
          return new Date(a.auction_end) - new Date(b.auction_end);
        });
        break;
      case "featured":
        filtered.sort(
          (a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
        );
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
      setError("Could not load marketplace listings. Please try again later.");

      // Enhanced professional mock data
      setListings([
        {
          id: "listing_001",
          token_id: "CC001",
          project_id: "AMZN-RF-2024-001",
          project_name: "Amazon Rainforest Restoration Initiative",
          current_price: 24.5,
          status: "listed",
          owner_uid: "user123",
          is_auction: false,
          created_at: "2024-05-15T14:30:00Z",
          region: "Pará, Brazil",
          country: "Brazil",
          project_type: "reforestation",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "3.2 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
          description:
            "Large-scale Amazon rainforest restoration supporting indigenous communities and biodiversity conservation",
          detailed_description:
            "This comprehensive project spans 15,000 hectares of degraded Amazon rainforest, combining advanced satellite monitoring with traditional indigenous knowledge.",
          rating: 4.9,
          seller_rating: 4.8,
          reviews_count: 127,
          is_featured: true,
          project_area: "15,000 hectares",
          total_credits: 15000,
          available_credits: 8750,
          sold_credits: 6250,
          methodology: "VCS-VM0009",
          certifications: ["Gold Standard", "VCS", "CCBS"],
          developer: {
            name: "Amazon Conservation Alliance",
            rating: 4.8,
            verified: true,
          },
        },
        {
          id: "listing_002",
          token_id: "CC002",
          project_id: "KEN-MNG-2024-002",
          project_name: "Kenyan Mangrove Conservation Project",
          current_price: 32.75,
          status: "listed",
          owner_uid: "user456",
          is_auction: true,
          auction_end: "2024-08-20T23:59:59Z",
          created_at: "2024-06-01T09:15:00Z",
          region: "Lamu County, Kenya",
          country: "Kenya",
          project_type: "mangrove",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "4.1 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800",
          description:
            "Coastal mangrove restoration project with significant blue carbon sequestration and community benefits",
          detailed_description:
            "This project focuses on restoring 8,500 hectares of degraded mangrove ecosystems along Kenya's coast, providing crucial protection against sea level rise while supporting local fishing communities.",
          rating: 4.8,
          seller_rating: 4.7,
          reviews_count: 89,
          bid_count: 15,
          is_featured: true,
          project_area: "8,500 hectares",
          total_credits: 12000,
          available_credits: 7200,
          sold_credits: 4800,
          methodology: "VCS-VM0007",
          certifications: ["VCS", "Plan Vivo", "CCBS"],
          developer: {
            name: "Coastal Conservation Initiative",
            rating: 4.7,
            verified: true,
          },
        },
        {
          id: "listing_003",
          token_id: "CC003",
          project_id: "CAN-BOR-2024-003",
          project_name: "Canadian Boreal Forest Protection",
          current_price: 18.9,
          status: "listed",
          owner_uid: "user789",
          is_auction: false,
          created_at: "2024-05-28T11:45:00Z",
          region: "British Columbia, Canada",
          country: "Canada",
          project_type: "conservation",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "2.8 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
          description:
            "Long-term protection of old-growth boreal forest with significant biodiversity and carbon storage benefits",
          detailed_description:
            "This project protects 25,000 hectares of intact boreal forest, preventing logging and ensuring long-term carbon storage while supporting wildlife corridors.",
          rating: 4.7,
          seller_rating: 4.9,
          reviews_count: 156,
          project_area: "25,000 hectares",
          total_credits: 20000,
          available_credits: 12500,
          sold_credits: 7500,
          methodology: "VCS-VM0003",
          certifications: ["VCS", "FSC", "CCBS"],
          developer: {
            name: "Boreal Conservation Trust",
            rating: 4.9,
            verified: true,
          },
        },
        {
          id: "listing_004",
          token_id: "CC004",
          project_id: "IDN-PEAT-2024-004",
          project_name: "Indonesian Peatland Restoration",
          current_price: 28.25,
          status: "listed",
          owner_uid: "user234",
          is_auction: true,
          auction_end: "2024-07-30T18:00:00Z",
          created_at: "2024-05-22T16:20:00Z",
          region: "Central Kalimantan, Indonesia",
          country: "Indonesia",
          project_type: "peatland",
          verification_status: "verified",
          vintage: "2025",
          co2_amount: "5.3 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1574482620889-1d99ebb9fc56?w=800",
          description:
            "Critical peatland restoration preventing massive CO2 emissions and supporting orangutan habitat",
          detailed_description:
            "This vital project restores 18,000 hectares of degraded tropical peatland, preventing fire-related emissions and restoring critical habitat for endangered species.",
          rating: 4.9,
          seller_rating: 4.8,
          reviews_count: 203,
          bid_count: 22,
          is_featured: true,
          project_area: "18,000 hectares",
          total_credits: 25000,
          available_credits: 18750,
          sold_credits: 6250,
          methodology: "VCS-VM0035",
          certifications: ["VCS", "Gold Standard", "CCBS"],
          developer: {
            name: "Tropical Peatland Alliance",
            rating: 4.8,
            verified: true,
          },
        },
        {
          id: "listing_005",
          token_id: "CC005",
          project_id: "NOR-REW-2024-005",
          project_name: "Nordic Rewilding Initiative",
          current_price: 21.6,
          status: "listed",
          owner_uid: "user567",
          is_auction: false,
          created_at: "2024-06-10T10:00:00Z",
          region: "Finnmark, Norway",
          country: "Norway",
          project_type: "rewilding",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "2.1 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          description:
            "Large-scale ecosystem restoration with wildlife reintroduction and natural forest regeneration",
          detailed_description:
            "This ambitious rewilding project covers 30,000 hectares of northern Norway, allowing natural forest succession while reintroducing native species like lynx and wolves.",
          rating: 4.6,
          seller_rating: 4.7,
          reviews_count: 94,
          project_area: "30,000 hectares",
          total_credits: 18000,
          available_credits: 11200,
          sold_credits: 6800,
          methodology: "VCS-VM0017",
          certifications: ["VCS", "Plan Vivo"],
          developer: {
            name: "Nordic Conservation Group",
            rating: 4.7,
            verified: true,
          },
        },
        {
          id: "listing_006",
          token_id: "CC006",
          project_id: "MDG-CONS-2024-006",
          project_name: "Madagascar Baobab Conservation",
          current_price: 35.8,
          status: "listed",
          owner_uid: "user890",
          is_auction: true,
          auction_end: "2024-08-15T20:30:00Z",
          created_at: "2024-05-18T08:15:00Z",
          region: "Menabe, Madagascar",
          country: "Madagascar",
          project_type: "conservation",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "3.8 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1569163139402-1d99ebb9fc59?w=800",
          description:
            "Protection of ancient baobab forests and endemic biodiversity hotspots",
          detailed_description:
            "This project protects 12,000 hectares of unique baobab forests and spiny forests, home to 95% endemic species including lemurs, fossas, and unique flora.",
          rating: 4.9,
          seller_rating: 4.8,
          reviews_count: 76,
          bid_count: 18,
          is_featured: true,
          project_area: "12,000 hectares",
          total_credits: 14000,
          available_credits: 9800,
          sold_credits: 4200,
          methodology: "VCS-VM0003",
          certifications: ["VCS", "CCBS", "Gold Standard"],
          developer: {
            name: "Madagascar Conservation Fund",
            rating: 4.8,
            verified: true,
          },
        },
        {
          id: "listing_007",
          token_id: "CC007",
          project_id: "CHL-PAT-2024-007",
          project_name: "Patagonian Forest Restoration",
          current_price: 26.4,
          status: "listed",
          owner_uid: "user345",
          is_auction: false,
          created_at: "2024-06-05T14:20:00Z",
          region: "Aysén, Chile",
          country: "Chile",
          project_type: "reforestation",
          verification_status: "verified",
          vintage: "2025",
          co2_amount: "3.1 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
          description:
            "Native forest restoration in pristine Patagonian valleys with carbon sequestration and watershed protection",
          detailed_description:
            "This project restores 22,000 hectares of native Patagonian forests using indigenous species, providing crucial watershed protection and carbon sequestration.",
          rating: 4.8,
          seller_rating: 4.9,
          reviews_count: 112,
          project_area: "22,000 hectares",
          total_credits: 19000,
          available_credits: 13300,
          sold_credits: 5700,
          methodology: "VCS-VM0009",
          certifications: ["VCS", "FSC", "CCBS"],
          developer: {
            name: "Patagonia Reforestation Society",
            rating: 4.9,
            verified: true,
          },
        },
        {
          id: "listing_008",
          token_id: "CC008",
          project_id: "AUS-EUC-2024-008",
          project_name: "Australian Post-Fire Recovery",
          current_price: 23.15,
          status: "listed",
          owner_uid: "user678",
          is_auction: true,
          auction_end: "2024-07-25T12:00:00Z",
          created_at: "2024-05-30T09:30:00Z",
          region: "New South Wales, Australia",
          country: "Australia",
          project_type: "regeneration",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "2.7 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=800",
          description:
            "Post-wildfire ecosystem recovery with native species reforestation and koala habitat restoration",
          detailed_description:
            "This recovery project spans 16,500 hectares of fire-damaged eucalyptus forests, focusing on native species regeneration and critical koala habitat restoration.",
          rating: 4.7,
          seller_rating: 4.6,
          reviews_count: 138,
          bid_count: 11,
          project_area: "16,500 hectares",
          total_credits: 16000,
          available_credits: 10400,
          sold_credits: 5600,
          methodology: "VCS-VM0009",
          certifications: ["VCS", "Plan Vivo"],
          developer: {
            name: "Australian Wildlife Recovery",
            rating: 4.6,
            verified: true,
          },
        },
        {
          id: "listing_009",
          token_id: "CC009",
          project_id: "CRI-CLOUD-2024-009",
          project_name: "Costa Rica Cloud Forest Protection",
          current_price: 31.25,
          status: "listed",
          owner_uid: "user901",
          is_auction: false,
          created_at: "2024-06-08T07:45:00Z",
          region: "Monteverde, Costa Rica",
          country: "Costa Rica",
          project_type: "protection",
          verification_status: "verified",
          vintage: "2024",
          co2_amount: "4.2 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1574482620811-1ddbca8b9beb?w=800",
          description:
            "High-altitude cloud forest preservation with endemic species protection and watershed conservation",
          detailed_description:
            "This critical project protects 9,500 hectares of unique cloud forest ecosystem, preserving water resources for over 100,000 people and protecting hundreds of endemic species.",
          rating: 4.9,
          seller_rating: 4.8,
          reviews_count: 167,
          is_featured: true,
          project_area: "9,500 hectares",
          total_credits: 13500,
          available_credits: 8100,
          sold_credits: 5400,
          methodology: "VCS-VM0003",
          certifications: ["VCS", "Gold Standard", "CCBS"],
          developer: {
            name: "Cloud Forest Conservation",
            rating: 4.8,
            verified: true,
          },
        },
        {
          id: "listing_010",
          token_id: "CC010",
          project_id: "MAR-ARGAN-2024-010",
          project_name: "Moroccan Argan Forest Restoration",
          current_price: 19.75,
          status: "listed",
          owner_uid: "user012",
          is_auction: false,
          created_at: "2024-06-12T13:10:00Z",
          region: "Essaouira, Morocco",
          country: "Morocco",
          project_type: "restoration",
          verification_status: "verified",
          vintage: "2025",
          co2_amount: "2.3 tCO2e",
          project_image:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
          description:
            "Traditional argan forest restoration supporting women's cooperatives and sustainable livelihoods",
          detailed_description:
            "This community-driven project restores 11,000 hectares of argan forests while supporting local women's cooperatives in sustainable argan oil production.",
          rating: 4.6,
          seller_rating: 4.7,
          reviews_count: 85,
          project_area: "11,000 hectares",
          total_credits: 11500,
          available_credits: 7475,
          sold_credits: 4025,
          methodology: "VCS-VM0017",
          certifications: ["VCS", "Plan Vivo", "Fair Trade"],
          developer: {
            name: "Argan Forest Cooperative",
            rating: 4.7,
            verified: true,
          },
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
  // Modern Professional Marketplace Card Component
  const ProfessionalMarketplaceCard = ({ listing, onBuyClick, onBidClick }) => {
    const isBookmarked = bookmarkedProjects.has(listing.id);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hovering, setHovering] = useState(false);

    const getRatingColor = (rating) => {
      if (rating >= 4.8) return "#4ade80"; // green-400
      if (rating >= 4.5) return "#3b82f6"; // blue-500
      if (rating >= 4.0) return "#f59e0b"; // amber-500
      return "#ef4444"; // red-500
    };

    const formatTimeLeft = (endDate) => {
      if (!endDate) return null;
      const now = new Date();
      const end = new Date(endDate);
      const diff = end - now;

      if (diff <= 0) return "Ended";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (days > 0) return `${days}d ${hours}h left`;
      return `${hours}h left`;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
      >
        <Card
          sx={{
            height: "100%",
            borderRadius: "20px",
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            boxShadow: hovering
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
            position: "relative",
            "&:hover": {
              transform: "translateY(-8px)",
            },
          }}
        >
          {/* Status Badges */}
          <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {listing.is_featured && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Chip
                    label="FEATURED"
                    size="small"
                    sx={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "10px",
                      height: 24,
                      boxShadow: "0 4px 8px rgba(245, 158, 11, 0.3)",
                      "& .MuiChip-label": { px: 1.5 },
                    }}
                  />
                </motion.div>
              )}
              {listing.is_auction && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Chip
                    label="LIVE AUCTION"
                    size="small"
                    sx={{
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "10px",
                      height: 24,
                      boxShadow: "0 4px 8px rgba(239, 68, 68, 0.3)",
                      "& .MuiChip-label": { px: 1.5 },
                    }}
                  />
                </motion.div>
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(listing);
                  }}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 1)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Share sx={{ fontSize: 16, color: "#64748b" }} />
                </IconButton>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(listing.id);
                  }}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 1)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Bookmark
                    sx={{
                      fontSize: 16,
                      color: isBookmarked ? "#ef4444" : "#64748b",
                    }}
                  />
                </IconButton>
              </motion.div>
            </Box>
          </Box>

          {/* Hero Image */}
          <Box
            sx={{
              position: "relative",
              height: 240,
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => navigateToProject(listing.id)}
          >
            <Box
              component="img"
              src={listing.project_image}
              alt={listing.project_name}
              onLoad={() => setImageLoaded(true)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: hovering ? "scale(1.05)" : "scale(1)",
                opacity: imageLoaded ? 1 : 0,
              }}
            />
            {!imageLoaded && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, #f1f5f9, #e2e8f0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={40} />
              </Box>
            )}

            {/* Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              }}
            />

            {/* Project Type Badge */}
            <Box sx={{ position: "absolute", bottom: 16, left: 16 }}>
              <Chip
                label={
                  listing.project_type?.charAt(0).toUpperCase() +
                  listing.project_type?.slice(1)
                }
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontWeight: 600,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              />
            </Box>

            {/* Verification Badge */}
            {listing.verification_status === "verified" && (
              <Box sx={{ position: "absolute", bottom: 16, right: 16 }}>
                <Tooltip title="Verified Project">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      bgcolor: "rgba(16, 185, 129, 0.9)",
                      backdropFilter: "blur(10px)",
                      px: 1,
                      py: 0.5,
                      borderRadius: 2,
                    }}
                  >
                    <Verified sx={{ fontSize: 14, color: "white" }} />
                    <Typography
                      sx={{ fontSize: 11, color: "white", fontWeight: 600 }}
                    >
                      VERIFIED
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Header Section */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#1e293b",
                  mb: 0.5,
                  lineHeight: 1.3,
                  cursor: "pointer",
                  "&:hover": { color: "#3b82f6" },
                }}
                onClick={() => navigateToProject(listing.id)}
              >
                {listing.project_name}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <LocationOn sx={{ fontSize: 14, color: "#64748b" }} />
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
                  {listing.region}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Rating
                    value={listing.rating}
                    precision={0.1}
                    size="small"
                    readOnly
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: getRatingColor(listing.rating),
                      },
                    }}
                  />
                  <Typography
                    sx={{ fontSize: "0.8rem", color: "#64748b", ml: 0.5 }}
                  >
                    ({listing.reviews_count})
                  </Typography>
                </Box>

                {listing.developer?.verified && (
                  <Chip
                    label="Verified Developer"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      bgcolor: "#dbeafe",
                      color: "#1d4ed8",
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Stats Section */}
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1.5,
                      bgcolor: "#f8fafc",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#059669",
                      }}
                    >
                      {listing.co2_amount}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      CO2/Credit
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1.5,
                      bgcolor: "#f8fafc",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#3b82f6",
                      }}
                    >
                      {listing.project_area}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Area
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Progress Bar for Available Credits */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Available Credits
                </Typography>
                <Typography
                  sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e293b" }}
                >
                  {listing.available_credits?.toLocaleString()} /{" "}
                  {listing.total_credits?.toLocaleString()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  ((listing.total_credits - listing.available_credits) /
                    listing.total_credits) *
                  100
                }
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    background:
                      "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                  },
                }}
              />
            </Box>

            {/* Price Section */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}
              >
                <Typography
                  sx={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "#1e293b",
                    background:
                      "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ${listing.current_price}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 500 }}
                >
                  MATIC
                </Typography>
              </Box>

              {listing.is_auction && listing.bid_count && (
                <Typography
                  sx={{ fontSize: "0.8rem", color: "#ef4444", fontWeight: 600 }}
                >
                  {listing.bid_count} bids •{" "}
                  {formatTimeLeft(listing.auction_end)}
                </Typography>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigateToProject(listing.id)}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": {
                    borderColor: "#3b82f6",
                    color: "#3b82f6",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                Details
              </Button>

              {listing.is_auction ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onBidClick(listing)}
                  startIcon={<Gavel sx={{ fontSize: 16 }} />}
                  sx={{
                    flex: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                      boxShadow: "0 6px 16px rgba(239, 68, 68, 0.4)",
                    },
                  }}
                >
                  Place Bid
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onBuyClick(listing)}
                  startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
                  sx={{
                    flex: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
                    },
                  }}
                >
                  Buy Now
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Authentication Check */}
      {authLoading ? (
        <Box className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <CircularProgress size={60} color="primary" />
            <Typography variant="h6" className="mt-4 text-gray-600">
              Loading marketplace...
            </Typography>
          </div>
        </Box>
      ) : !currentUser ? (
        <Box className="text-center py-16">
          <Card className="max-w-md mx-auto p-8">
            <Typography variant="h4" className="mb-4 text-gray-800">
              Sign In Required
            </Typography>
            <Typography variant="body1" className="mb-6 text-gray-600">
              Please sign in to access the carbon credit marketplace and start
              trading.
            </Typography>
            <Button
              href="/login"
              variant="contained"
              size="large"
              className="bg-green-600 hover:bg-green-700"
            >
              Sign In
            </Button>
          </Card>
        </Box>
      ) : (
        <>
          {/* Professional Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                mb: 6,
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab  50%, #5e35b1 75%, #7e57c2 100%)",
                color: "white",
                boxShadow: "0 20px 60px rgba(26, 35, 126, 0.3)",
              }}
            >
              {/* Professional Background Pattern */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.08) 0%, transparent 50%),
                    linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.03) 50%, transparent 51%)
                  `,
                  backgroundSize: "200px 200px, 300px 300px, 20px 20px",
                }}
              />

              <Container maxWidth="xl" sx={{ position: "relative", py: 6 }}>
                <Grid container spacing={4} alignItems="center">
                  {/* Main Content */}
                  <Grid item xs={12} lg={8}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                          mb: 2,
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #e8eaf6 100%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        }}
                      >
                        Professional Carbon Markets
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 400,
                          mb: 3,
                          lineHeight: 1.4,
                          maxWidth: "600px",
                        }}
                      >
                        Trade institutional-grade carbon credits with blockchain
                        verification, real-time pricing, and comprehensive
                        project analytics.
                      </Typography>

                      {/* Professional Action Buttons */}
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleOpenListDialog}
                          disabled={!account}
                          startIcon={<Add />}
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "white",
                            py: 1.5,
                            px: 4,
                            fontWeight: "bold",
                            borderRadius: 3,
                            fontSize: "1rem",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.25)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          List Credits
                        </Button>

                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={<Analytics />}
                          sx={{
                            borderColor: "rgba(255,255,255,0.3)",
                            color: "white",
                            py: 1.5,
                            px: 4,
                            fontWeight: "bold",
                            borderRadius: 3,
                            fontSize: "1rem",
                            textTransform: "none",
                            "&:hover": {
                              borderColor: "rgba(255,255,255,0.5)",
                              backgroundColor: "rgba(255,255,255,0.1)",
                              transform: "translateY(-1px)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Market Analytics
                        </Button>
                      </Box>

                      {!account && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 2,
                            opacity: 0.7,
                            fontStyle: "italic",
                          }}
                        >
                          Connect your wallet to access full trading features
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Professional Market Statistics */}
                  <Grid item xs={12} lg={4}>
                    <Box
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(20px)",
                        borderRadius: 3,
                        p: 3,
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
                      >
                        Live Market Data
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="h4"
                                sx={{ fontWeight: "bold" }}
                              >
                                {marketStats.totalListings}
                              </Typography>
                              <TrendingUp sx={{ ml: 1, color: "#4caf50" }} />
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Active Projects
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h4"
                              sx={{ fontWeight: "bold", mb: 1 }}
                            >
                              ${marketStats.totalValue}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Total Volume
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="h4"
                                sx={{ fontWeight: "bold" }}
                              >
                                ${marketStats.avgPrice}
                              </Typography>
                              {marketStats.priceChange24h >= 0 ? (
                                <TrendingUp
                                  sx={{
                                    ml: 1,
                                    color: "#4caf50",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              ) : (
                                <TrendingDown
                                  sx={{
                                    ml: 1,
                                    color: "#f44336",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Avg Price/tCO2e
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="h4"
                                sx={{ fontWeight: "bold" }}
                              >
                                {marketStats.activeAuctions}
                              </Typography>
                              <LocalFireDepartment
                                sx={{
                                  ml: 1,
                                  color: "#ff9800",
                                  fontSize: "1.2rem",
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Live Auctions
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Market Status Indicator */}
                      <Box
                        sx={{
                          mt: 3,
                          pt: 3,
                          borderTop: "1px solid rgba(255,255,255,0.2)",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "#4caf50",
                              animation: "pulse 2s infinite",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            Market Open
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          Last updated: {new Date().toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Container>
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
                      ) && (
                        <Badge color="primary" variant="dot" className="ml-2" />
                      )}
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

                {/* Professional Advanced Filters */}
                <Collapse in={showFilters}>
                  <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.08)" }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
                    >
                      Advanced Filters
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Price Range */}
                      <Grid item xs={12} md={6} lg={3}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            border: "1px solid",
                            borderColor: "rgba(0,0,0,0.08)",
                            borderRadius: 2,
                            bgcolor: "rgba(25, 118, 210, 0.02)",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              mb: 2,
                              fontWeight: "600",
                              color: "text.primary",
                            }}
                          >
                            Price Range (MATIC)
                          </Typography>
                          <Slider
                            value={filters.priceRange}
                            onChange={(e, newValue) =>
                              handleFilterChange("priceRange", newValue)
                            }
                            valueLabelDisplay="on"
                            valueLabelFormat={(value) => `$${value}`}
                            min={0}
                            max={100}
                            step={1}
                            marks={[
                              { value: 0, label: "$0" },
                              { value: 25, label: "$25" },
                              { value: 50, label: "$50" },
                              { value: 75, label: "$75" },
                              { value: 100, label: "$100+" },
                            ]}
                            sx={{
                              "& .MuiSlider-thumb": {
                                bgcolor: "primary.main",
                                "&:hover": {
                                  boxShadow:
                                    "0 0 0 8px rgba(25, 118, 210, 0.16)",
                                },
                              },
                              "& .MuiSlider-track": {
                                bgcolor: "primary.main",
                              },
                              "& .MuiSlider-rail": {
                                bgcolor: "rgba(0,0,0,0.1)",
                              },
                            }}
                          />
                        </Paper>
                      </Grid>

                      {/* Geographic Filters */}
                      <Grid item xs={12} md={6} lg={3}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            border: "1px solid",
                            borderColor: "rgba(0,0,0,0.08)",
                            borderRadius: 2,
                            bgcolor: "rgba(76, 175, 80, 0.02)",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              mb: 2,
                              fontWeight: "600",
                              color: "text.primary",
                            }}
                          >
                            Location & Region
                          </Typography>
                          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel>Region</InputLabel>
                            <Select
                              value={filters.region}
                              label="Region"
                              onChange={(e) =>
                                handleFilterChange("region", e.target.value)
                              }
                            >
                              <MenuItem value="all">All Regions</MenuItem>
                              <MenuItem value="Brazil">🇧🇷 Brazil</MenuItem>
                              <MenuItem value="Kenya">🇰🇪 Kenya</MenuItem>
                              <MenuItem value="Canada">🇨🇦 Canada</MenuItem>
                              <MenuItem value="Indonesia">
                                🇮🇩 Indonesia
                              </MenuItem>
                              <MenuItem value="Norway">🇳🇴 Norway</MenuItem>
                              <MenuItem value="Peru">🇵🇪 Peru</MenuItem>
                              <MenuItem value="India">🇮🇳 India</MenuItem>
                              <MenuItem value="Australia">
                                🇦🇺 Australia
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl fullWidth size="small">
                            <InputLabel>Project Area</InputLabel>
                            <Select
                              value={filters.projectArea || "all"}
                              label="Project Area"
                              onChange={(e) =>
                                handleFilterChange(
                                  "projectArea",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="all">Any Size</MenuItem>
                              <MenuItem value="small">
                                Small (&lt; 1,000 ha)
                              </MenuItem>
                              <MenuItem value="medium">
                                Medium (1,000 - 10,000 ha)
                              </MenuItem>
                              <MenuItem value="large">
                                Large (&gt; 10,000 ha)
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Paper>
                      </Grid>

                      {/* Project Classification */}
                      <Grid item xs={12} md={6} lg={3}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            border: "1px solid",
                            borderColor: "rgba(0,0,0,0.08)",
                            borderRadius: 2,
                            bgcolor: "rgba(255, 152, 0, 0.02)",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              mb: 2,
                              fontWeight: "600",
                              color: "text.primary",
                            }}
                          >
                            Project Classification
                          </Typography>
                          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel>Project Type</InputLabel>
                            <Select
                              value={filters.projectType}
                              label="Project Type"
                              onChange={(e) =>
                                handleFilterChange(
                                  "projectType",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="all">All Types</MenuItem>
                              <MenuItem value="reforestation">
                                🌳 Reforestation
                              </MenuItem>
                              <MenuItem value="afforestation">
                                🌲 Afforestation
                              </MenuItem>
                              <MenuItem value="mangrove">
                                🌿 Mangrove Restoration
                              </MenuItem>
                              <MenuItem value="peatland">
                                🏞️ Peatland Conservation
                              </MenuItem>
                              <MenuItem value="rewilding">
                                🦅 Rewilding
                              </MenuItem>
                              <MenuItem value="agroforestry">
                                🌾 Agroforestry
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl fullWidth size="small">
                            <InputLabel>Vintage Year</InputLabel>
                            <Select
                              value={filters.vintage || "all"}
                              label="Vintage Year"
                              onChange={(e) =>
                                handleFilterChange("vintage", e.target.value)
                              }
                            >
                              <MenuItem value="all">All Vintages</MenuItem>
                              <MenuItem value="2024">2024</MenuItem>
                              <MenuItem value="2023">2023</MenuItem>
                              <MenuItem value="2022">2022</MenuItem>
                              <MenuItem value="2021">2021</MenuItem>
                              <MenuItem value="2020">2020</MenuItem>
                              <MenuItem value="older">
                                2019 &amp; Earlier
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Paper>
                      </Grid>

                      {/* Quality & Verification */}
                      <Grid item xs={12} md={6} lg={3}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            border: "1px solid",
                            borderColor: "rgba(0,0,0,0.08)",
                            borderRadius: 2,
                            bgcolor: "rgba(156, 39, 176, 0.02)",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              mb: 2,
                              fontWeight: "600",
                              color: "text.primary",
                            }}
                          >
                            Quality &amp; Verification
                          </Typography>
                          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel>Minimum Rating</InputLabel>
                            <Select
                              value={filters.minRating || "all"}
                              label="Minimum Rating"
                              onChange={(e) =>
                                handleFilterChange("minRating", e.target.value)
                              }
                            >
                              <MenuItem value="all">Any Rating</MenuItem>
                              <MenuItem value="4.5">⭐ 4.5+ Stars</MenuItem>
                              <MenuItem value="4.0">⭐ 4.0+ Stars</MenuItem>
                              <MenuItem value="3.5">⭐ 3.5+ Stars</MenuItem>
                              <MenuItem value="3.0">⭐ 3.0+ Stars</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl fullWidth size="small">
                            <InputLabel>Certification</InputLabel>
                            <Select
                              value={filters.certification || "all"}
                              label="Certification"
                              onChange={(e) =>
                                handleFilterChange(
                                  "certification",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="all">
                                All Certifications
                              </MenuItem>
                              <MenuItem value="verified">
                                ✅ Verified Only
                              </MenuItem>
                              <MenuItem value="vcs">VCS Certified</MenuItem>
                              <MenuItem value="gold-standard">
                                Gold Standard
                              </MenuItem>
                              <MenuItem value="ccb">CCB Standards</MenuItem>
                              <MenuItem value="plan-vivo">Plan Vivo</MenuItem>
                            </Select>
                          </FormControl>
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* Advanced Options */}
                    <Box
                      sx={{
                        mt: 3,
                        p: 2.5,
                        bgcolor: "rgba(0,0,0,0.02)",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ mb: 2, fontWeight: "600", color: "text.primary" }}
                      >
                        Advanced Options
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Sort By</InputLabel>
                            <Select
                              value={filters.sortBy}
                              label="Sort By"
                              onChange={(e) =>
                                handleFilterChange("sortBy", e.target.value)
                              }
                            >
                              <MenuItem value="newest">
                                📅 Newest First
                              </MenuItem>
                              <MenuItem value="price_low">
                                💰 Price: Low to High
                              </MenuItem>
                              <MenuItem value="price_high">
                                💰 Price: High to Low
                              </MenuItem>
                              <MenuItem value="rating">
                                ⭐ Highest Rated
                              </MenuItem>
                              <MenuItem value="ending_soon">
                                ⏰ Ending Soon
                              </MenuItem>
                              <MenuItem value="most_popular">
                                🔥 Most Popular
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={filters.featuredOnly || false}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "featuredOnly",
                                    e.target.checked
                                  )
                                }
                                color="primary"
                              />
                            }
                            label="Featured Projects Only"
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={filters.auctionOnly || false}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "auctionOnly",
                                    e.target.checked
                                  )
                                }
                                color="secondary"
                              />
                            }
                            label="Live Auctions Only"
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
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
                <Typography
                  variant="h5"
                  color="text.secondary"
                  className="mb-2"
                >
                  No credits found
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  className="mb-4"
                >
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
                          className="h-full"
                        >
                          <ProfessionalMarketplaceCard
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
              <Button
                onClick={handleBuyCredit}
                variant="contained"
                color="primary"
              >
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
        </>
      )}
    </Container>
  );
}
