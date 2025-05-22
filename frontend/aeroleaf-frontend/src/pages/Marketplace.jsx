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
} from "@mui/material";
import {
  Inventory,
  ShoppingCart,
  LocalOffer,
  Search,
  FilterList,
  Refresh,
} from "@mui/icons-material";
import { creditsApi } from "../services/api";
import MarketplaceCard from "../components/MarketplaceCard";
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
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  }; // Handler for search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
  };
  // Filter listings based on tab selection
  const getFilteredListings = () => {
    switch (tabValue) {
      case 0: // All
        return listings;
      case 1: // Buy Now
        return listings.filter((listing) => !listing.is_auction);
      case 2: // Auctions
        return listings.filter((listing) => listing.is_auction);
      default:
        return listings;
    }
  };

  // Filter listings when search term or tab changes
  useEffect(() => {
    const filtered = getFilteredListings().filter(
      (listing) =>
        !searchTerm ||
        listing.token_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.project_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredListings(filtered);
  }, [listings, searchTerm, tabValue]);

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
      // Fallback to mock data if API fails
      setListings([
        {
          id: "listing_001",
          token_id: "CC001",
          project_id: "site_001",
          current_price: 15.5,
          status: "listed",
          owner_uid: "user123",
          is_auction: false,
          created_at: "2025-05-10T14:30:00Z",
        },
        {
          id: "listing_002",
          token_id: "CC002",
          project_id: "site_002",
          current_price: 18.25,
          status: "listed",
          owner_uid: "user456",
          is_auction: true,
          auction_end: "2025-05-30T23:59:59Z",
          created_at: "2025-05-15T09:15:00Z",
        },
        {
          id: "listing_003",
          token_id: "CC003",
          project_id: "site_003",
          current_price: 12.75,
          status: "listed",
          owner_uid: "user789",
          is_auction: false,
          created_at: "2025-05-18T11:45:00Z",
        },
        {
          id: "listing_004",
          token_id: "CC004",
          project_id: "site_001",
          current_price: 22.5,
          status: "listed",
          owner_uid: "user123",
          is_auction: true,
          auction_end: "2025-06-05T23:59:59Z",
          created_at: "2025-05-20T16:20:00Z",
        },
        {
          id: "listing_005",
          token_id: "CC005",
          project_id: "site_002",
          current_price: 14.8,
          status: "listed",
          owner_uid: "user456",
          is_auction: false,
          created_at: "2025-05-21T10:00:00Z",
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

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-6 p-5 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-xl">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="font-bold"
        >
          Carbon Credit Marketplace
        </Typography>
        <Typography variant="subtitle1">
          Buy, sell, and trade verified carbon credits from reforestation
          projects worldwide
        </Typography>
        <Grid container spacing={2} className="mt-4">
          <Grid item xs={12} sm={4}>
            <Paper className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <Typography variant="body2" className="text-black opacity-75">
                Total Credits Available
              </Typography>
              <Typography variant="h5" className="font-bold">
                58 Credits
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <Typography variant="body2" className="text-black opacity-75">
                Average Price
              </Typography>
              <Typography variant="h5" className="font-bold">
                18.2 MATIC
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <Typography variant="body2" className="text-black opacity-75">
                Projects Represented
              </Typography>
              <Typography variant="h5" className="font-bold">
                12 Projects
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenListDialog}
        disabled={!account}
        className="mb-4 enhanced-card"
        fullWidth
        sx={{ py: 1.5, fontSize: "1.1rem" }}
      >
        List Your Carbon Credit
      </Button>
      {error && (
        <Paper className="p-4 mb-6 bg-red-100 text-red-700 enhanced-card">
          <Typography>{error}</Typography>
        </Paper>
      )}
      {/* Search and filters */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
        className="p-4 bg-gray-50 rounded-lg enhanced-card"
      >
        <TextField
          label="Search by ID or project"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: { xs: "100%", sm: "300px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button startIcon={<FilterList />} variant="outlined" size="small">
            Filters
          </Button>
          <IconButton
            color="primary"
            onClick={handleRefresh}
            aria-label="Refresh listings"
          >
            <Refresh />
          </IconButton>
        </Box>
      </Box>
      {/* Tabs for filtering */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="marketplace tabs"
        >
          <Tab icon={<Inventory />} label="All Listings" />
          <Tab icon={<ShoppingCart />} label="Buy Now" />
          <Tab icon={<LocalOffer />} label="Auctions" />
        </Tabs>
      </Box>
      {loading && listings.length === 0 ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : filteredListings.length === 0 ? (
        <Box py={8} textAlign="center">
          <Typography variant="h6" color="text.secondary">
            No listings available in this category
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <Box
                onClick={() =>
                  listing.is_auction
                    ? handleOpenBidDialog(listing)
                    : handleOpenBuyDialog(listing)
                }
                className="cursor-pointer"
              >
                <MarketplaceCard listing={listing} />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
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
