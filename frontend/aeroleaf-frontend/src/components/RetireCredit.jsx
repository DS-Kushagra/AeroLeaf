import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { creditsApi } from "../services/api";
import BlockchainService from "../services/blockchain";
import { useWeb3 } from "../contexts/Web3Context";

export default function RetireCredit({ credit, open, onClose, onRetired }) {
  const { account, provider, signer } = useWeb3();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const handleRetire = async () => {
    if (!credit) return;

    if (!account) {
      setError("Please connect your wallet to retire a carbon credit");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First perform the blockchain transaction
      let blockchainResult;
      try {
        blockchainResult = await BlockchainService.retireCredit(
          credit.token_id || credit.id,
          reason,
          provider,
          signer
        );

        setTransactionHash(blockchainResult.transactionHash);
      } catch (blockchainError) {
        console.error("Blockchain error:", blockchainError);
        throw new Error(
          "Failed to retire credit on the blockchain. Please try again."
        );
      }

      // Then update in the backend API
      try {
        await creditsApi.retireCredit(credit.id);
      } catch (apiError) {
        console.log("API not available or error:", apiError);
        // If blockchain worked but API failed, consider it successful
        console.log("Using blockchain transaction result instead");
      }

      setSuccess(true);

      // Notify parent component
      if (onRetired) {
        onRetired(credit.id, reason);
      }

      // Close dialog after success
      setTimeout(() => {
        onClose();
        // Reset state for next use
        setSuccess(false);
        setReason("");
        setTransactionHash("");
      }, 2000);
    } catch (err) {
      console.error("Error retiring carbon credit:", err);
      setError("Failed to retire carbon credit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Retire Carbon Credit</DialogTitle>
      <DialogContent>
        {" "}
        {success ? (
          <>
            <Alert severity="success" sx={{ mt: 2 }}>
              Carbon credit successfully retired! This credit has been
              permanently marked as used for offsetting carbon emissions.
            </Alert>
            {transactionHash && (
              <Typography
                variant="body2"
                sx={{ mt: 2, wordBreak: "break-all" }}
              >
                Transaction hash: {transactionHash}
              </Typography>
            )}
          </>
        ) : (
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {credit && (
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Credit Details
                </Typography>
                <Box mt={1}>
                  <Typography variant="body2">
                    <strong>Token ID:</strong> {credit.token_id}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Project:</strong> {credit.project_id}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Amount:</strong> {credit.amount} tCO₂e
                  </Typography>
                  <Typography variant="body2">
                    <strong>Vintage:</strong> {credit.vintage}
                  </Typography>
                </Box>
              </Box>
            )}

            <Typography variant="body2" color="text.secondary" paragraph>
              Retiring a carbon credit permanently removes it from circulation,
              marking it as used for offsetting emissions. This action cannot be
              undone.
            </Typography>

            <TextField
              label="Retirement Reason (Optional)"
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              placeholder="e.g., Offsetting business travel emissions for Q2 2025"
              variant="outlined"
              margin="normal"
              disabled={loading}
            />
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>{" "}
          <Button
            onClick={handleRetire}
            variant="contained"
            color="primary"
            disabled={loading || !account}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "Processing..." : "Retire Credit"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
