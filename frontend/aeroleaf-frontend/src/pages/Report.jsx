import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  LinearProgress,
  Chip,
} from "@mui/material";

export default function Report() {
  // State for tracking the current step in the multi-step form
  const [activeStep, setActiveStep] = useState(0);

  // State for form data across all steps
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    siteName: "",
    location: "",
    areaHectares: "",
    siteType: "",

    // Step 2: Detailed Information
    treeSpecies: "",
    treeCount: "",
    siteAge: "",
    previousLandUse: "",
    description: "",

    // Step 3: Contact and Verification
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    organization: "",
    existingDocumentation: "",

    // Step 4: Additional Information
    additionalNotes: "",
    howDidYouHear: "",
    visitAvailability: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Steps for the multi-step form
  const steps = [
    "Basic Information",
    "Site Details",
    "Contact Information",
    "Review & Submit",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form data for the current step
  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 0) {
      // Validate Step 1
      if (!formData.siteName.trim()) {
        newErrors.siteName = "Site name is required";
        isValid = false;
      }

      if (!formData.location.trim()) {
        newErrors.location = "Location is required";
        isValid = false;
      }

      if (!formData.areaHectares || formData.areaHectares <= 0) {
        newErrors.areaHectares = "Please enter a valid area";
        isValid = false;
      }

      if (!formData.siteType) {
        newErrors.siteType = "Site type is required";
        isValid = false;
      }
    } else if (step === 1) {
      // Validate Step 2
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
        isValid = false;
      }
    } else if (step === 2) {
      // Validate Step 3
      if (!formData.contactName.trim()) {
        newErrors.contactName = "Contact name is required";
        isValid = false;
      }

      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
        newErrors.contactEmail = "Please enter a valid email";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(
      (value) => value !== ""
    ).length;
    return (filledFields / totalFields) * 100;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateStep(activeStep)) {
      // In a real app, this would send the data to the API
      console.log("Submitting form data:", formData);
      setSubmitted(true);

      // Reset form after success
      setTimeout(() => {
        setSubmitted(false);
        setActiveStep(0);
        setFormData({
          siteName: "",
          location: "",
          areaHectares: "",
          siteType: "",
          treeSpecies: "",
          treeCount: "",
          siteAge: "",
          previousLandUse: "",
          description: "",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
          organization: "",
          existingDocumentation: "",
          additionalNotes: "",
          howDidYouHear: "",
          visitAvailability: "",
        });
      }, 3000);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box
        sx={{
          pt: 2,
          pb: 6,
          backgroundImage:
            "linear-gradient(135deg, rgba(104, 189, 147, 0.1), rgba(59, 130, 246, 0.1))",
          borderRadius: "16px",
          mb: 4,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "700", color: "#2d3748" }}
          >
            Report a Forest Site for Carbon Credits
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "800px", mx: "auto" }}
          >
            Submit your reforestation or conservation site details to get it
            verified and tokenized as carbon credits
          </Typography>
          <Box sx={{ mt: 3, mb: 4 }}>
            <LinearProgress
              variant="determinate"
              value={calculateCompletion()}
              sx={{
                height: 10,
                borderRadius: 5,
                maxWidth: "50%",
                mx: "auto",
                bgcolor: "rgba(255,255,255,0.5)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#4ade80",
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Profile Completion: {Math.round(calculateCompletion())}%
            </Typography>
          </Box>
        </Box>

        {submitted && (
          <Alert
            severity="success"
            sx={{ maxWidth: "800px", mx: "auto", mb: 4 }}
          >
            Your site report has been submitted successfully! Our team will
            review your submission and contact you within 3-5 business days.
          </Alert>
        )}

        <Box sx={{ width: "100%", maxWidth: "950px", mx: "auto", px: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Card
            elevation={3}
            sx={{
              borderRadius: 2,
              mb: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              background: "white",
              position: "relative",
              overflow: "visible",
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: "linear-gradient(90deg, #4ade80, #3b82f6)",
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box component="form">
                {/* Step 1: Basic Information */}
                {activeStep === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Basic Site Information
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Please provide basic details about your forest site
                        location and size
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Site Name"
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleChange}
                        error={!!errors.siteName}
                        helperText={errors.siteName}
                        placeholder="e.g. Nandurbar East Forest"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Location (Region, Country)"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        error={!!errors.location}
                        helperText={errors.location}
                        placeholder="e.g. Maharashtra, India"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Area (Hectares)"
                        name="areaHectares"
                        type="number"
                        value={formData.areaHectares}
                        onChange={handleChange}
                        error={!!errors.areaHectares}
                        helperText={errors.areaHectares}
                        placeholder="e.g. 42.6"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors.siteType}>
                        <InputLabel>Site Type</InputLabel>
                        <Select
                          name="siteType"
                          value={formData.siteType}
                          onChange={handleChange}
                          label="Site Type"
                        >
                          <MenuItem value="reforestation">
                            Reforestation
                          </MenuItem>
                          <MenuItem value="conservation">Conservation</MenuItem>
                          <MenuItem value="agroforestry">Agroforestry</MenuItem>
                          <MenuItem value="urban">Urban Forest</MenuItem>
                          <MenuItem value="mangrove">
                            Mangrove Restoration
                          </MenuItem>
                        </Select>
                        {errors.siteType && (
                          <FormHelperText>{errors.siteType}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

                {/* Step 2: Site Details */}
                {activeStep === 1 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Detailed Site Information
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        These details help us accurately estimate carbon
                        sequestration potential
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tree Species (comma separated)"
                        name="treeSpecies"
                        value={formData.treeSpecies}
                        onChange={handleChange}
                        placeholder="e.g. Teak, Bamboo, Banyan"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Estimated Tree Count"
                        name="treeCount"
                        type="number"
                        value={formData.treeCount}
                        onChange={handleChange}
                        placeholder="e.g. 5000"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Site Age (years)"
                        name="siteAge"
                        type="number"
                        value={formData.siteAge}
                        onChange={handleChange}
                        placeholder="How long has this forest existed?"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Previous Land Use"
                        name="previousLandUse"
                        value={formData.previousLandUse}
                        onChange={handleChange}
                        placeholder="e.g. Agricultural, Degraded forest, Unused"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Site Description"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                        placeholder="Describe the site, its ecological importance, and current status..."
                      />
                    </Grid>
                  </Grid>
                )}

                {/* Step 3: Contact Information */}
                {activeStep === 2 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Contact & Verification Information
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Please provide your contact details and any existing
                        documentation about the site
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Contact Name"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        error={!!errors.contactName}
                        helperText={errors.contactName}
                        placeholder="Your full name"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Contact Email"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        error={!!errors.contactEmail}
                        helperText={errors.contactEmail}
                        placeholder="your.email@example.com"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Phone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="Your phone number with country code"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Organization (if applicable)"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="Company or organization name"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Existing Documentation"
                        name="existingDocumentation"
                        multiline
                        rows={3}
                        value={formData.existingDocumentation}
                        onChange={handleChange}
                        placeholder="List any existing documentation, surveys, or certifications for this site"
                      />
                    </Grid>
                  </Grid>
                )}

                {/* Step 4: Review & Submit */}
                {activeStep === 3 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Review Your Information
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Please review your submission details before finalizing
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "rgba(104, 189, 147, 0.1)",
                          borderRadius: 2,
                          mb: 3,
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Site Name:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {formData.siteName || "Not provided"}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Location:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {formData.location || "Not provided"}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Area:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {formData.areaHectares
                                ? `${formData.areaHectares} hectares`
                                : "Not provided"}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Site Type:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {formData.siteType || "Not provided"}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Contact:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {formData.contactName || "Not provided"}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Email:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {formData.contactEmail || "Not provided"}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Tree Species:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {formData.treeSpecies || "Not provided"}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Organization:
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {formData.organization || "Not provided"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Additional Notes"
                            name="additionalNotes"
                            multiline
                            rows={2}
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            placeholder="Any other information you'd like to add"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="How did you hear about us?"
                            name="howDidYouHear"
                            value={formData.howDidYouHear}
                            onChange={handleChange}
                            placeholder="e.g. Google, Friend, Conference"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="On-site Visit Availability"
                            name="visitAvailability"
                            value={formData.visitAvailability}
                            onChange={handleChange}
                            placeholder="When would be a good time for our team to visit the site?"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ px: 3, py: 1 }}
            >
              Back
            </Button>
            <Box>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    px: 4,
                    py: 1.2,
                    background: "linear-gradient(90deg, #3b82f6, #4ade80)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #2563eb, #22c55e)",
                    },
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    px: 4,
                    py: 1.2,
                    background: "linear-gradient(90deg, #3b82f6, #4ade80)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #2563eb, #22c55e)",
                    },
                  }}
                >
                  Submit Report
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Info Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Chip label="Step 1" color="primary" size="small" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Report Your Forest Site
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submit detailed information about your reforestation or
                conservation project to start the assessment process.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Chip label="Step 2" color="primary" size="small" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Verification Process
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our team will analyze satellite imagery and conduct field
                verification to assess carbon sequestration potential.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Chip label="Step 3" color="primary" size="small" />
              </Box>
              <Typography variant="h6" gutterBottom>
                Generate Carbon Credits
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Once verified, your forest site will generate tokenized carbon
                credits that can be traded on our marketplace.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
