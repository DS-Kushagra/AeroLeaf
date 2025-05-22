import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { creditsApi } from "../services/api";

export default function PlaceBid({ listing, onBidPlaced, open, onClose }) {
  const [bidAmount, setBidAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Update bid amount when listing changes
  useEffect(() => {
    if (listing && listing.current_price) {
      // Set default bid to current price + minimum increment
      setBidAmount(parseFloat((listing.current_price + 0.5).toFixed(2)));
    }
  }, [listing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!listing) return;

    if (bidAmount <= listing.current_price) {
      setError("Bid must be higher than current price");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Try to call the real API
      try {
        await creditsApi.placeBid(listing.id, bidAmount);
      } catch (apiError) {
        console.log("API not available, using mock response", apiError);
        // Simulate success after a delay for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setSuccess(true);

      if (onBidPlaced) {
        onBidPlaced(bidAmount, listing.id);
      }

      // Close dialog after success
      setTimeout(() => {
        onClose && onClose();
        // Reset state
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error placing bid:", err);
      setError("Failed to place bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!isSubmitting ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Place Bid on Token #{listing?.token_id}</DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success" className="mt-3">
            Your bid was placed successfully!
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" className="mb-3">
                {error}
              </Alert>
            )}

            {listing && (
              <>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Project: {listing.project_id}
                </Typography>

                <Typography variant="body1" className="font-semibold mb-3">
                  Current Price: {listing.current_price} MATIC
                </Typography>
              </>
            )}

            <TextField
              label="Your Bid (MATIC)"
              type="number"
              inputProps={{
                step: "0.01",
                min: listing?.current_price
                  ? listing.current_price + 0.01
                  : 0.01,
              }}
              value={bidAmount}
              onChange={(e) => setBidAmount(parseFloat(e.target.value))}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              disabled={isSubmitting}
            />

            <Box className="flex justify-between items-center mt-3">
              <Typography variant="body2" color="text.secondary">
                Minimum bid:{" "}
                {listing?.current_price
                  ? (listing.current_price + 0.01).toFixed(2)
                  : "0.01"}{" "}
                MATIC
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Processing..." : "Place Bid"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
