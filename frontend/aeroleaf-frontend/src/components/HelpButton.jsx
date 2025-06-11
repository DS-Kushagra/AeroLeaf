import { useState } from "react";
import {
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  HelpOutline,
  School,
  LiveHelp,
  MenuBook,
  Lightbulb,
  ExpandLess,
  ExpandMore,
  Close,
  QuestionAnswer,
  Feedback,
  Settings,
  Info,
} from "@mui/icons-material";
import { useHelp } from "../contexts/HelpContext";
import { GuidedTour } from "./HelpSystem";

// Tour steps for the guided tour
const tourSteps = [
  {
    label: "Welcome to AeroLeaf",
    description:
      "AeroLeaf is a blockchain-based platform for verifying and trading carbon credits using satellite imagery and AI. This quick tour will help you get started.",
  },
  {
    label: "Dashboard Overview",
    description:
      "The Dashboard is your central hub for monitoring your carbon credit portfolio, viewing reforestation sites, and accessing key features.",
  },
  {
    label: "Interactive Map",
    description:
      "The interactive map shows all reforestation sites. Click on a marker to view basic information about the site and access detailed information.",
  },
  {
    label: "Carbon Credit Portfolio",
    description:
      "View your carbon credits, their status, and details. You can also retire credits to offset your carbon footprint.",
  },
  {
    label: "Marketplace",
    description:
      "The Marketplace allows you to buy and sell carbon credits. Browse available credits, place bids, or list your credits for sale.",
  },
  {
    label: "Analytics",
    description:
      "The Analytics section provides data visualizations and insights about carbon markets, project performance, and your portfolio.",
  },
  {
    label: "Getting Help",
    description:
      "Click the help button (like the one you used to start this tour) anytime to access help resources, restart this tour, or view the user guide.",
  },
];

// FAQ items for the FAQ dialog
const faqItems = [
  {
    question: "What is AeroLeaf?",
    answer:
      "AeroLeaf is a platform that uses satellite imagery and AI to verify reforestation projects and enable the trading of carbon credits on a blockchain-based marketplace.",
  },
  {
    question: "How are carbon credits verified?",
    answer:
      "Carbon credits are verified through a combination of satellite imagery analysis, AI-powered vegetation detection, and on-the-ground verification by certified partners.",
  },
  {
    question: "What is NDVI?",
    answer:
      "NDVI (Normalized Difference Vegetation Index) is a measure of vegetation health and density derived from satellite imagery. It helps us track the growth and health of reforestation projects.",
  },
  {
    question: "How do I buy carbon credits?",
    answer:
      "You can buy carbon credits in the Marketplace section. Browse available credits, click on one you're interested in, and follow the purchase process.",
  },
  {
    question: "How do I retire carbon credits?",
    answer:
      "To retire credits (permanently remove them to offset emissions), go to your Dashboard, select a credit, click 'Retire Credit', and provide a reason for retirement.",
  },
  {
    question: "What blockchain does AeroLeaf use?",
    answer:
      "AeroLeaf uses Ethereum for its carbon credit tokens and transactions.",
  },
  {
    question: "Can I use AeroLeaf without connecting a wallet?",
    answer:
      "You can browse projects and view data without connecting a wallet, but you'll need to connect one to buy, sell, or retire carbon credits.",
  },
  {
    question: "What if I lose access to my wallet?",
    answer:
      "Your carbon credits are stored on the blockchain linked to your wallet address. Make sure to follow proper wallet security practices and backup procedures.",
  },
];

/**
 * HelpButton component - Floating action button that provides access to help resources
 */
export default function HelpButton() {
  const {
    startGuidedTour,
    showGuidedTour,
    endGuidedTour,
    toggleHelpMode,
    helpModeActive,
    resetHelpSettings,
  } = useHelp();

  // State for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // State for help center dialog
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  
  // State for FAQ dialog
  const [faqOpen, setFaqOpen] = useState(false);
  
  // State for expanded FAQ items
  const [expandedFaq, setExpandedFaq] = useState(-1);

  // State for about dialog
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartTour = () => {
    handleClose();
    startGuidedTour();
  };

  const handleToggleHelpMode = () => {
    handleClose();
    toggleHelpMode();
  };

  const handleOpenHelpCenter = () => {
    handleClose();
    setHelpCenterOpen(true);
  };

  const handleCloseHelpCenter = () => {
    setHelpCenterOpen(false);
  };

  const handleOpenFaq = () => {
    handleClose();
    setFaqOpen(true);
  };

  const handleCloseFaq = () => {
    setFaqOpen(false);
    setExpandedFaq(-1);
  };

  const handleToggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? -1 : index);
  };

  const handleOpenAbout = () => {
    handleClose();
    setAboutOpen(true);
  };

  const handleCloseAbout = () => {
    setAboutOpen(false);
  };

  const handleOpenUserGuide = () => {
    handleClose();
    // Open the user guide in a new tab
    window.open("/docs/USER_GUIDE.md", "_blank");
  };

  const handleResetHelp = () => {
    handleClose();
    resetHelpSettings();
  };

  return (
    <>
      <Tooltip title="Help & Resources" arrow placement="left">
        <Fab
          color="primary"
          aria-label="help"
          size="medium"
          onClick={handleClick}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            boxShadow: 3,
          }}
        >
          <HelpOutline />
        </Fab>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 3,
          sx: { width: 220, borderRadius: 2 },
        }}
      >
        <MenuItem onClick={handleStartTour}>
          <ListItemIcon>
            <School fontSize="small" />
          </ListItemIcon>
          <ListItemText>Guided Tour</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleOpenHelpCenter}>
          <ListItemIcon>
            <LiveHelp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help Center</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleOpenFaq}>
          <ListItemIcon>
            <QuestionAnswer fontSize="small" />
          </ListItemIcon>
          <ListItemText>FAQ</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleOpenUserGuide}>
          <ListItemIcon>
            <MenuBook fontSize="small" />
          </ListItemIcon>
          <ListItemText>User Guide</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleToggleHelpMode}>
          <ListItemIcon>
            <Lightbulb
              fontSize="small"
              color={helpModeActive ? "primary" : "inherit"}
            />
          </ListItemIcon>
          <ListItemText>
            {helpModeActive ? "Disable Help Mode" : "Enable Help Mode"}
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleOpenAbout}>
          <ListItemIcon>
            <Info fontSize="small" />
          </ListItemIcon>
          <ListItemText>About AeroLeaf</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleResetHelp}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset Help Settings</ListItemText>
        </MenuItem>
      </Menu>

      {/* Guided Tour */}
      <GuidedTour
        steps={tourSteps}
        open={showGuidedTour}
        onClose={endGuidedTour}
      />

      {/* Help Center Dialog */}
      <Dialog
        open={helpCenterOpen}
        onClose={handleCloseHelpCenter}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Help Center</Typography>
            <IconButton
              size="small"
              onClick={handleCloseHelpCenter}
              aria-label="Close"
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
            {/* Left column - Help topics */}
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
                Help Topics
              </Typography>

              <List sx={{ bgcolor: "background.paper" }}>
                <ListItem disablePadding>
                  <ListItemButton
                    component="a"
                    href="#getting-started"
                    onClick={handleCloseHelpCenter}
                  >
                    <ListItemText primary="Getting Started" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component="a"
                    href="#dashboard"
                    onClick={handleCloseHelpCenter}
                  >
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component="a"
                    href="#marketplace"
                    onClick={handleCloseHelpCenter}
                  >
                    <ListItemText primary="Marketplace" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component="a"
                    href="#analytics"
                    onClick={handleCloseHelpCenter}
                  >
                    <ListItemText primary="Analytics" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component="a"
                    href="#carbon-credits"
                    onClick={handleCloseHelpCenter}
                  >
                    <ListItemText primary="Carbon Credits" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component="a"
                    href="#account"
                    onClick={handleCloseHelpCenter}
                  >
                    <ListItemText primary="Account Management" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>

            {/* Right column - Quick help */}
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
                Quick Help
              </Typography>

              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleStartTour}>
                    <ListItemIcon>
                      <School />
                    </ListItemIcon>
                    <ListItemText
                      primary="Take the Guided Tour"
                      secondary="Step-by-step introduction to AeroLeaf"
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton onClick={handleOpenFaq}>
                    <ListItemIcon>
                      <QuestionAnswer />
                    </ListItemIcon>
                    <ListItemText
                      primary="Frequently Asked Questions"
                      secondary="Quick answers to common questions"
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton onClick={handleOpenUserGuide}>
                    <ListItemIcon>
                      <MenuBook />
                    </ListItemIcon>
                    <ListItemText
                      primary="User Guide"
                      secondary="Comprehensive documentation"
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Feedback />
                    </ListItemIcon>
                    <ListItemText
                      primary="Contact Support"
                      secondary="Get help from our team"
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseHelpCenter} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog
        open={faqOpen}
        onClose={handleCloseFaq}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Frequently Asked Questions</Typography>
            <IconButton
              size="small"
              onClick={handleCloseFaq}
              aria-label="Close"
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <List sx={{ width: "100%" }}>
            {faqItems.map((item, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleToggleFaq(index)}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {item.question}
                      </Typography>
                    }
                  />
                  {expandedFaq === index ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse
                  in={expandedFaq === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                    <Typography variant="body1">{item.answer}</Typography>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseFaq} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* About Dialog */}
      <Dialog
        open={aboutOpen}
        onClose={handleCloseAbout}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">About AeroLeaf</Typography>
            <IconButton
              size="small"
              onClick={handleCloseAbout}
              aria-label="Close"
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="h5" gutterBottom align="center">
            AeroLeaf
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph>
            A blockchain-based platform to verify and trade carbon credits using
            satellite imagery and AI.
          </Typography>

          <Typography variant="body1" paragraph>
            AeroLeaf is a comprehensive platform designed to bring transparency
            and reliability to the carbon credit market through a combination of
            cutting-edge technologies. Our mission is to enable trustworthy
            carbon offsetting by providing verifiable evidence of reforestation
            projects through satellite imagery analysis and blockchain-based
            validation.
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>Our Vision:</strong> To create a decentralized, transparent
            platform for tracking reforestation and trading carbon credits with
            real environmental impact.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Technology Stack
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Frontend:</strong> React, Material UI, Tailwind CSS
            <br />
            <strong>Backend:</strong> Node.js, Express, Firebase
            <br />
            <strong>Blockchain:</strong> Ethereum, Smart Contracts
            <br />
            <strong>Machine Learning:</strong> Python, TensorFlow
          </Typography>

          <Typography variant="body2" color="textSecondary" align="center">
            Version 1.0.0
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseAbout} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}