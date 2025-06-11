import { useState, useEffect } from "react";
import {
  Tooltip,
  IconButton,
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
  Popper,
  Fade,
  ClickAwayListener,
} from "@mui/material";
import {
  HelpOutline,
  Close,
  ArrowForward,
  ArrowBack,
  Info,
  CheckCircleOutline,
} from "@mui/icons-material";

/**
 * HelpTooltip - Simple tooltip with help icon
 * @param {string} title - Tooltip text
 * @param {object} props - Additional props
 */
export const HelpTooltip = ({ title, children, ...props }) => {
  return (
    <Tooltip title={title} arrow placement="top" {...props}>
      <IconButton size="small" color="primary" sx={{ ml: 0.5 }}>
        <HelpOutline fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

/**
 * FeatureHighlight - Highlights a new feature with a pulsing effect
 * @param {ReactNode} children - The component to wrap
 * @param {string} message - Message to display
 * @param {boolean} active - Whether the highlight is active
 */
export const FeatureHighlight = ({ children, message, active = true }) => {
  const [show, setShow] = useState(active);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setShow(false);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl) && show;

  return (
    <>
      <Box
        className={`relative ${show ? "feature-pulse" : ""}`}
        onClick={handleClick}
        ref={setAnchorEl}
      >
        {children}
        {show && (
          <Box
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"
            sx={{ zIndex: 1 }}
          />
        )}
      </Box>

      <Popper open={open} anchorEl={anchorEl} transition placement="top">
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                maxWidth: 300,
                bgcolor: "primary.light",
                color: "primary.contrastText",
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    New Feature!
                  </Typography>
                  <Typography variant="body2">{message}</Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={handleClose}
                    sx={{ color: "primary.contrastText", mt: 1 }}
                    endIcon={<CheckCircleOutline />}
                  >
                    Got it
                  </Button>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

/**
 * ContextualHelp - Provides detailed help for a specific feature
 * @param {string} title - Help dialog title
 * @param {string} content - Help content (supports markdown)
 */
export const ContextualHelp = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        size="small"
        color="primary"
        onClick={handleOpen}
        aria-label="Help"
      >
        <HelpOutline />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{title}</Typography>
            <IconButton size="small" onClick={handleClose} aria-label="Close">
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body1" component="div">
            {content}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/**
 * GuidedTour - Step-by-step guided tour of features
 * @param {Array} steps - Array of tour steps
 * @param {boolean} open - Whether the tour is open
 * @param {function} onClose - Function to call when tour is closed
 */
export const GuidedTour = ({ steps, open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setCompleted(false);
    }
  }, [open]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setCompleted(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    setCompleted(true);
    if (onClose) onClose();
  };

  const handleSkip = () => {
    if (onClose) onClose();
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleSkip}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Welcome to AeroLeaf</Typography>
          <IconButton size="small" onClick={handleSkip} aria-label="Close">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {!completed ? (
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === steps.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography>{step.description}</Typography>
                    {step.image && (
                      <Box
                        component="img"
                        src={step.image}
                        alt={step.label}
                        sx={{
                          maxWidth: "100%",
                          height: "auto",
                          my: 2,
                          borderRadius: 1,
                        }}
                      />
                    )}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        endIcon={
                          index === steps.length - 1 ? (
                            <CheckCircleOutline />
                          ) : (
                            <ArrowForward />
                          )
                        }
                      >
                        {index === steps.length - 1 ? "Finish" : "Continue"}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                        startIcon={<ArrowBack />}
                      >
                        Back
                      </Button>
                      <Button onClick={handleSkip} sx={{ mt: 1, mr: 1 }}>
                        Skip Tour
                      </Button>
                    </Box>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <CheckCircleOutline
              color="success"
              sx={{ fontSize: 60, mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              All Done!
            </Typography>
            <Typography variant="body1" paragraph>
              You've completed the tour of AeroLeaf. You can restart the tour
              anytime from the help menu.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinish}
            >
              Get Started
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * InfoCard - Displays important information in a card format
 * @param {string} title - Card title
 * @param {string} content - Card content
 * @param {string} severity - Severity level (info, warning, error)
 */
export const InfoCard = ({ title, content, severity = "info" }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const getColor = () => {
    switch (severity) {
      case "warning":
        return "#FFA726";
      case "error":
        return "#EF5350";
      case "success":
        return "#66BB6A";
      default:
        return "#42A5F5";
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        borderLeft: `4px solid ${getColor()}`,
        bgcolor: `${getColor()}22`,
      }}
    >
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Info sx={{ mr: 1, color: getColor() }} />
          <Typography variant="subtitle1" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {content}
      </Typography>
    </Paper>
  );
};

// Export all components as a single HelpSystem object
const HelpSystem = {
  HelpTooltip,
  FeatureHighlight,
  ContextualHelp,
  GuidedTour,
  InfoCard,
};

export default HelpSystem;