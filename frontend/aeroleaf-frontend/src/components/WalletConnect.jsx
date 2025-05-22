import React from "react";
import {
  Button,
  Box,
  Typography,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  AccountBalanceWallet,
  ContentCopy,
  ExitToApp,
} from "@mui/icons-material";
import { useWeb3 } from "../contexts/Web3Context";

export default function WalletConnect() {
  const {
    account,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  } = useWeb3();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (account) {
      setAnchorEl(event.currentTarget);
    } else {
      handleConnect();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    handleClose();
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      handleClose();
    }
  };

  // Format address for display (0x1234...5678)
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // If MetaMask is not installed
  if (!isMetaMaskInstalled()) {
    return (
      <Button
        color="secondary"
        variant="contained"
        startIcon={<AccountBalanceWallet />}
        onClick={() => window.open("https://metamask.io/download/", "_blank")}
        sx={{ ml: 1 }}
      >
        Install MetaMask
      </Button>
    );
  }

  // If we have an error
  if (error) {
    return (
      <Button
        color="error"
        variant="contained"
        onClick={handleConnect}
        sx={{ ml: 1 }}
      >
        Retry Connection
      </Button>
    );
  }

  // If we're connecting
  if (isConnecting) {
    return (
      <Button disabled variant="outlined" sx={{ ml: 1 }}>
        Connecting...
      </Button>
    );
  }

  // If connected
  if (account) {
    return (
      <>
        <Chip
          icon={<AccountBalanceWallet />}
          label={formatAddress(account)}
          color="primary"
          variant="outlined"
          onClick={handleClick}
          sx={{
            ml: 1,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "wallet-button",
          }}
        >
          <MenuItem onClick={copyAddress}>
            <ListItemIcon>
              <ContentCopy fontSize="small" />
            </ListItemIcon>
            Copy Address
          </MenuItem>
          <MenuItem onClick={handleDisconnect}>
            <ListItemIcon>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            Disconnect
          </MenuItem>
        </Menu>
      </>
    );
  }

  // If not connected
  return (
    <Button
      color="primary"
      variant="contained"
      startIcon={<AccountBalanceWallet />}
      onClick={handleConnect}
      sx={{ ml: 1 }}
    >
      Connect Wallet
    </Button>
  );
}
