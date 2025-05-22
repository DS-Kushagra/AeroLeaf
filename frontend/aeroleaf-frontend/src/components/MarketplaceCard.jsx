// components/MarketplaceCard.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Box, Typography, Chip, Paper, Button } from "@mui/material";
import { formatDistanceToNow, formatDistance, isPast } from "date-fns";
import { Gavel, ShoppingCart } from "@mui/icons-material";

export default function MarketplaceCard({ listing }) {
  // Calculate time since listing
  const listingDate = listing.created_at
    ? new Date(
        listing.created_at instanceof Object && listing.created_at.seconds
          ? listing.created_at.seconds * 1000
          : listing.created_at
      )
    : new Date();

  const timeAgo = formatDistanceToNow(listingDate, { addSuffix: true });

  // Calculate time remaining for auctions
  const getAuctionTimeRemaining = () => {
    if (!listing.auction_end) return null;

    const endDate = new Date(listing.auction_end);

    if (isPast(endDate)) {
      return "Auction ended";
    }

    return `Ends in ${formatDistance(new Date(), endDate)}`;
  };

  return (
    <Paper className="p-4 bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
      <Box className="flex justify-between items-start mb-3">
        <Typography variant="h6" className="font-bold">
          Token #{listing.token_id}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          {listing.is_auction && (
            <Chip
              icon={<Gavel fontSize="small" />}
              label="AUCTION"
              color="primary"
              size="small"
              className="mr-1"
            />
          )}
          <Chip
            label={listing.status.toUpperCase()}
            color={listing.status === "listed" ? "success" : "default"}
            size="small"
          />
        </Box>
      </Box>

      <Box className="mb-2">
        <Typography variant="body2" color="text.secondary">
          Project
        </Typography>
        <Typography variant="body1">{listing.project_id}</Typography>
      </Box>

      <Box className="mb-2">
        <Typography variant="body2" color="text.secondary">
          {listing.is_auction ? "Current Bid" : "Price"}
        </Typography>
        <Typography variant="h6" className="font-bold text-green-600">
          {listing.current_price} MATIC
        </Typography>
      </Box>

      {listing.is_auction && listing.auction_end && (
        <Box className="mb-2">
          <Typography variant="body2" color="text.secondary">
            Auction Status
          </Typography>
          <Typography
            variant="body1"
            color={isPast(new Date(listing.auction_end)) ? "error" : "primary"}
          >
            {getAuctionTimeRemaining()}
          </Typography>
        </Box>
      )}

      <Box className="mb-2">
        <Typography variant="body2" color="text.secondary">
          Listed
        </Typography>
        <Typography variant="body1">{timeAgo}</Typography>
      </Box>

      <Button
        variant="contained"
        color={listing.is_auction ? "primary" : "success"}
        fullWidth
        startIcon={listing.is_auction ? <Gavel /> : <ShoppingCart />}
        size="small"
        className="mt-2"
      >
        {listing.is_auction ? "Place Bid" : "Buy Now"}
      </Button>

      {listing.price_history && listing.price_history.length > 1 && (
        <Box className="mt-4">
          <PriceHistoryChart history={listing.price_history} />
        </Box>
      )}
    </Paper>
  );
}

function PriceHistoryChart({ history }) {
  const data = history.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleDateString(),
    price: item.price,
  }));

  return (
    <LineChart width={300} height={200} data={data}>
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="#82ca9d" />
    </LineChart>
  );
}
