import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Map as MapIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { useHelp } from '../contexts/HelpContext';

// Welcome steps content
const steps = [
  {
    label: 'Welcome to AeroLeaf',
    icon: <SchoolIcon />,
    description: (
      <>
        <Typography paragraph>
          Welcome to AeroLeaf, a blockchain-based platform for verifying and trading carbon credits using satellite imagery and AI.
        </Typography>
        <Typography paragraph>
          This quick introduction will help you understand the key features of our platform and how to get started.
        </Typography>
        <Typography>
          Click "Next" to continue or "Skip" to close this introduction.
        </Typography>
      </>
    ),
  },
  {
    label: 'Explore Reforestation Sites',
    icon: <MapIcon />,
    description: (
      <>
        <Typography paragraph>
          The Dashboard features an interactive map showing all reforestation sites tracked by AeroLeaf.
        </Typography>
        <Typography paragraph>
          Click on any site marker to view basic information about the project, including location, size, and current status.
        </Typography>
        <Typography>
          For detailed information, including satellite imagery and NDVI analysis, click "View Details" to open the site's dedicated page.
        </Typography>
      </>
    ),
  },
  {
    label: 'Carbon Credit Marketplace',
    icon: <ShoppingCartIcon />,
    description: (
      <>
        <Typography paragraph>
          The Marketplace allows you to buy and sell carbon credits from verified reforestation projects.
        </Typography>
        <Typography paragraph>
          Each credit represents one ton of CO₂ sequestered by a reforestation project, verified through our satellite imagery and AI analysis.
        </Typography>
        <Typography>
          You can browse available credits, place bids, or list your own credits for sale.
        </Typography>
      </>
    ),
  },
  {
    label: 'Analytics & Reporting',
    icon: <BarChartIcon />,
    description: (
      <>
        <Typography paragraph>
          The Analytics section provides data visualizations and insights about carbon markets, project performance, and your portfolio.
        </Typography>
        <Typography paragraph>
          Track the growth of reforestation sites over time through NDVI analysis, monitor market trends, and generate reports for your carbon offset activities.
        </Typography>
        <Typography>
          Use these insights to make informed decisions about your carbon credit investments and environmental impact.
        </Typography>
      </>
    ),
  },
  {
    label: 'Your Carbon Credit Wallet',
    icon: <AccountBalanceIcon />,
    description: (
      <>
        <Typography paragraph>
          Connect your Ethereum wallet to manage your carbon credits. Your credits are stored as tokens on the blockchain, ensuring transparency and security.
        </Typography>
        <Typography paragraph>
          You can view your credit balance, transaction history, and retirement status from your Dashboard.
        </Typography>
        <Typography>
          When you're ready to offset your carbon footprint, you can retire credits, permanently removing them from circulation and recording your environmental contribution on the blockchain.
        </Typography>
      </>
    ),
  },
];

/**
 * WelcomeDialog component for first-time users
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when the dialog is closed
 * @returns {React.ReactElement} - The welcome dialog component
 */
export default function WelcomeDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { startGuidedTour } = useHelp();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStartTour = () => {
    onClose();
    startGuidedTour();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Welcome to AeroLeaf</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: index === activeStep ? 'primary.main' : 'grey.300',
                      color: index === activeStep ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    {step.icon}
                  </Box>
                )}
              >
                <Typography variant="subtitle1">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {step.description}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      startIcon={<ArrowBackIcon />}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={index === steps.length - 1 ? null : <ArrowForwardIcon />}
                      disabled={index === steps.length - 1}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography paragraph>
              You've completed the introduction to AeroLeaf! You're now ready to explore the platform and start your journey toward carbon neutrality.
            </Typography>
            <Typography paragraph>
              Remember, you can access help resources anytime by clicking the help button in the bottom right corner of the screen.
            </Typography>
            <Button
              onClick={handleStartTour}
              variant="contained"
              color="primary"
              sx={{ mt: 1, mr: 1 }}
              startIcon={<SchoolIcon />}
            >
              Take Interactive Tour
            </Button>
          </Paper>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {activeStep === steps.length ? 'Get Started' : 'Skip'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}